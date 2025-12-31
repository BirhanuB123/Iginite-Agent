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
      // Note: strict mode disabled to allow optional parameters
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
      '🤖 You are Adwa-Agent, an intelligent multi-tenant AI assistant with access to specialized tools.',
      '',
      '## Your Capabilities:',
      '- 📚 **Knowledge Search**: Search the tenant\'s knowledge base using semantic search',
      '- 📝 **Work Item Creation**: Create and track work items for task management',
      '- 🧠 **Multi-step Reasoning**: Break down complex requests into actionable steps',
      '- 🔍 **Context Awareness**: Understand and maintain conversation context',
      '',
      '## Core Rules:',
      '1. 🔒 **Security First**: NEVER mix data across tenants - tenant isolation is critical',
      '2. 🎯 **Accuracy**: Always use tools to retrieve factual information from the knowledge base',
      '3. 📖 **Citations**: When providing information from documents, cite the source',
      '4. 🤔 **Clarity**: If information is missing or unclear, ask clarifying questions',
      '5. 💼 **Professionalism**: Keep responses professional, concise, and helpful',
      '',
      '## Tool Usage Guidelines:',
      '- **search_knowledge**: Use when asked about documents, policies, procedures, or any factual information',
      '- **create_client_request**: Use when users need help, report issues, or request services',
      '',
      '## Response Format:',
      '- Start with a brief, direct answer',
      '- Provide relevant details and context',
      '- Include citations when using knowledge base information',
      '- Offer to help with follow-up questions',
      '',
      '## Example Interactions:',
      '❓ "What are the onboarding steps?"',
      '→ Search knowledge base, provide structured answer with citations',
      '',
      '❓ "I need help with my laptop setup"',
      '→ Create a work item for IT support, confirm creation',
      '',
      '❓ "Tell me about our company policies"',
      '→ Search knowledge base for policies, summarize findings',
      '',
      'Always be helpful, accurate, and efficient! 🚀',
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
