import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ToolRegistryService } from '../tools/tool-registry.service';
import { AuditService } from '../../common/audit/audit.service';
import { PolicyService } from '../../common/auth/policy.service';
import { TenantContext } from '../../common/tenant/tenant-context';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';

@Injectable()
export class OrchestratorService {
  private readonly client: OpenAI;

  constructor(
    private readonly tools: ToolRegistryService,
    private readonly audit: AuditService,
    private readonly policy: PolicyService,
  ) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  async runChat(ctx: TenantContext, userMessage: string) {
    /** -----------------------------
     * 1. Tool definitions
     * ----------------------------- */
    const toolDefs: ChatCompletionTool[] = this.tools.list().map((t) => ({
      type: 'function' as const,
      function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
      strict: true,
      },
    }));

    /** -----------------------------
     * 2. Message history
     * ----------------------------- */
    const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
        content: this.systemInstructions(),
        },
        {
          role: 'user',
        content: userMessage,
        },
    ];

    /** -----------------------------
     * 3. Tool loop
     * ----------------------------- */
    let iterations = 0;
    const maxIterations = 8;

    while (iterations < maxIterations) {
      iterations++;

      const response = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
        messages,
        tools: toolDefs.length > 0 ? toolDefs : undefined,
        tool_choice: 'auto',
      });

      const assistantMessage = response.choices[0]?.message;
      if (!assistantMessage) {
        throw new Error('No response from OpenAI');
      }

      // Add assistant message to history
      messages.push(assistantMessage);

      // Check if there are tool calls
      const toolCalls = assistantMessage.tool_calls;
      if (!toolCalls || toolCalls.length === 0) {
        // No more tool calls, return the final response
        return {
          text: assistantMessage.content ?? 'No response generated.',
          conversationId: response.id,
          iterations,
        };
      }

      // Execute tool calls
      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        const input = safeJson(toolCall.function.arguments);

        // Check authorization
        if (!this.policy.canExecuteTool(ctx, toolName, input)) {
          const denied = { error: 'NOT_AUTHORIZED', tool: toolName };

          await this.audit.log(
            ctx.tenantId,
            ctx.userId,
            'TOOL_DENIED',
            toolName,
            input,
            denied,
          );

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(denied),
          });
          continue;
        }

        // Execute tool
        try {
        const tool = this.tools.get(toolName);
        const result = await tool.handler(ctx, input);

        await this.audit.log(
          ctx.tenantId,
          ctx.userId,
          'TOOL_EXECUTED',
          toolName,
          input,
          result,
        );

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result),
        });
        } catch (error: any) {
          const errorResult = {
            error: 'TOOL_EXECUTION_FAILED',
            tool: toolName,
            message: error.message || 'Unknown error',
          };

          await this.audit.log(
            ctx.tenantId,
            ctx.userId,
            'TOOL_ERROR',
            toolName,
            input,
            errorResult,
          );

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(errorResult),
      });
        }
      }
    }

    // If we reach max iterations, return the last assistant message
    const lastAssistantMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'assistant');

    return {
      text: (lastAssistantMessage as any)?.content ?? 'Max iterations reached without final response.',
      conversationId: 'max-iterations',
      iterations,
    };
  }

  private systemInstructions(): string {
    return [
      'You are Ignite-Agent, a multi-tenant AI assistant with access to specialized tools.',
      '',
      'Rules:',
      '- NEVER mix data across tenants - tenant isolation is critical.',
      '- Always use tools to retrieve factual information from the knowledge base.',
      '- When asked about documents, policies, or procedures, use search_knowledge.',
      '- When creating work items or requests, use create_client_request.',
      '- If information is missing or unclear, ask clarifying questions.',
      '- Keep responses professional, concise, and helpful.',
      '- Cite sources when providing information from documents.',
    ].join('\n');
  }
}

function safeJson(value: unknown): any {
  try {
    if (!value) return {};
    if (typeof value === 'object') return value;
    return JSON.parse(value as string);
  } catch {
    return {};
  }
}
