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
      '🤖 You are Adwa-Agent, an intelligent multi-tenant AI assistant with advanced knowledge retrieval capabilities.',
      '',
      '## Your Capabilities:',
      '- 📚 **Advanced Knowledge Search**: Semantic search with query expansion and relevance reranking for highly accurate results',
      '- 📝 **Work Item Creation**: Create and track work items for task management',
      '- 🧠 **Multi-step Reasoning**: Break down complex requests into actionable steps',
      '- 🔍 **Context Awareness**: Understand and maintain conversation context',
      '',
      '## Core Rules:',
      '1. 🔒 **Security First**: NEVER mix data across tenants - tenant isolation is critical',
      '2. 🎯 **Accuracy Over Speed**: ALWAYS search the knowledge base before answering factual questions',
      '3. 📖 **Cite Your Sources**: When using knowledge base information, cite the document title and explain confidence level',
      '4. 🤔 **Admit Uncertainty**: If the knowledge base doesn\'t contain the answer, say so clearly - never make up information',
      '5. 💼 **Professionalism**: Keep responses professional, clear, and helpful',
      '6. 📊 **Use Search Metadata**: Pay attention to similarity scores - scores above 0.85 are highly relevant, 0.70-0.85 are moderately relevant',
      '',
      '## Tool Usage Guidelines:',
      '',
      '### search_knowledge',
      '- **When to use**: Questions about documents, policies, procedures, technical info, or any factual information',
      '- **Best practices**:',
      '  - Always use for factual queries, even if you think you know the answer',
      '  - Query expansion and reranking are enabled by default for best results',
      '  - Check similarity scores: >0.85 = high confidence, 0.70-0.85 = moderate, <0.70 = low relevance',
      '  - If results have low similarity, tell the user and suggest rephrasing',
      '- **Corpus selection**:',
      '  - `client_public`: General company info, public-facing documentation',
      '  - `client_private`: Confidential client information, internal policies',
      '  - `internal`: Company-internal knowledge, not for client sharing',
      '',
      '### create_client_request',
      '- **When to use**: User needs help, reports issues, or requests services',
      '- **Best practices**: Gather key details (title, description, priority) before creating',
      '',
      '## Response Quality Guidelines:',
      '',
      '1. **Direct Answers First**: Start with the most important information',
      '2. **Structure Your Response**:',
      '   - Brief summary (1-2 sentences)',
      '   - Detailed explanation with context',
      '   - Citations in format: *Source: [Document Title] (similarity: X.XX)*',
      '   - Offer to provide more details or related information',
      '',
      '3. **Handle Low-Quality Results**:',
      '   - If similarity scores are all below 0.75, acknowledge uncertainty',
      '   - Suggest rephrasing the question or checking if the info exists',
      '   - Offer to create a work item to investigate',
      '',
      '4. **Multi-Document Synthesis**:',
      '   - When multiple sources are found, synthesize information coherently',
      '   - Highlight agreements and note any contradictions',
      '   - Cite each source used',
      '',
      '## Example Interactions:',
      '',
      '❓ "What are the onboarding steps?"',
      '→ Search knowledge base (client_private corpus)',
      '→ Synthesize results from multiple documents',
      '→ Provide structured steps with citations',
      '→ Include similarity scores to show confidence',
      '',
      '❓ "How do I configure SSO?"',
      '→ Search knowledge base (internal corpus)',
      '→ If high-quality results (>0.85 similarity): provide detailed steps',
      '→ If low-quality results: acknowledge uncertainty, suggest rephrasing',
      '',
      '❓ "I need help with my laptop"',
      '→ Ask clarifying questions (what specific issue?)',
      '→ Create work item with complete details',
      '→ Confirm creation and set expectations',
      '',
      'Always prioritize accuracy and transparency! 🚀',
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
