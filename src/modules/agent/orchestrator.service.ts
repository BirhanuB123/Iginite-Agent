import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ToolRegistryService } from '../tools/tool-registry.service';
import { AuditService } from '../../common/audit/audit.service';
import { PolicyService } from '../../common/auth/policy.service';
import { TenantContext } from '../../common/tenant/tenant-context';

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
    const toolDefs = this.tools.list().map((t) => ({
      type: 'function' as const,
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
      strict: true,
    }));

    /** -----------------------------
     * 2. Initial request
     * ----------------------------- */
    let response = await this.client.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: [
            { type: 'input_text', text: this.systemInstructions() },
          ],
        },
        {
          role: 'user',
          content: [
            { type: 'input_text', text: userMessage },
          ],
        },
      ],
      tools: toolDefs,
    });

    /** -----------------------------
     * 3. Tool loop
     * ----------------------------- */
    for (let i = 0; i < 8; i++) {
      const toolCalls = (response.output ?? []).filter(
        (item): item is any => item.type === 'function_call',
      );

      if (toolCalls.length === 0) break;

      const toolOutputs: {
        type: 'function_call_output';
        call_id: string;
        output: string;
      }[] = [];

      for (const call of toolCalls) {
        const toolName = call.name;
        const input = safeJson(call.arguments);

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

          toolOutputs.push({
            type: 'function_call_output',
            call_id: call.call_id,
            output: JSON.stringify(denied),
          });
          continue;
        }

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

        toolOutputs.push({
          type: 'function_call_output',
          call_id: call.call_id,
          output: JSON.stringify(result),
        });
      }

      response = await this.client.responses.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
        previous_response_id: response.id,
        input: toolOutputs,
      });
    }

    /** -----------------------------
     * 4. Final output
     * ----------------------------- */
    return {
      text:
        typeof response.output_text === 'string'
          ? response.output_text
          : 'No response text generated.',
      responseId: response.id,
    };
  }

  private systemInstructions(): string {
    return [
      'You are Ignite-Agent.',
      'Rules:',
      '- Never mix data across tenants.',
      '- Use tools for factual statements.',
      '- If information is missing, suggest creating a request.',
      '- Keep responses professional and concise.',
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
