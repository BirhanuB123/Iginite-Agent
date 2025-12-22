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
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }

  async runChat(ctx: TenantContext, userMessage: string) {
    const toolDefs = this.tools.list().map((t) => ({
      type: 'function' as const,
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    }));

    let response = await this.client.responses.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: [{ type: 'text', text: this.systemInstructions() }],
        },
        {
          role: 'user',
          content: [{ type: 'text', text: userMessage }],
        },
      ],
      tools: toolDefs,
    });

    // Tool-calling loop (bounded)
    for (let i = 0; i < 8; i++) {
      const toolCalls = (response.output ?? []).filter((o: any) => o.type === 'function_call');
      if (!toolCalls.length) break;

      const toolOutputs: any[] = [];

      for (const call of toolCalls) {
        const toolName = call.name as string;
        const tool = this.tools.get(toolName);
        const input = safeJson(call.arguments);

        const allowed = this.policy.canExecuteTool(ctx, toolName, input);
        if (!allowed) {
          const denied = { error: 'NOT_AUTHORIZED', tool: toolName };
          await this.audit.log(ctx.tenantId, ctx.userId, 'TOOL_DENIED', toolName, input, denied);
          toolOutputs.push({ type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(denied) });
          continue;
        }

        const result = await tool.handler(ctx, input);
        await this.audit.log(ctx.tenantId, ctx.userId, 'TOOL_EXECUTED', toolName, input, result);
        toolOutputs.push({ type: 'function_call_output', call_id: call.call_id, output: JSON.stringify(result) });
      }

      response = await this.client.responses.create({
        model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
        previous_response_id: response.id,
        input: toolOutputs,
      });
    }

    const finalText = (response.output ?? [])
      .filter((o: any) => o.type === 'message')
      .flatMap((m: any) => m.content)
      .filter((c: any) => c.type === 'output_text')
      .map((c: any) => c.text)
      .join('\n');

    return { text: finalText, responseId: response.id };
  }

  private systemInstructions() {
    return [
      'You are Ignite-Agent.',
      'Hard rules:',
      '- Never mix data across tenants.',
      '- Use tools for factual statements about teams, documents, policies, or request status.',
      '- If information is not found, say so and suggest creating a request.',
      '- Keep responses professional and concise.',
    ].join('\n');
  }
}

function safeJson(s: any): any {
  try {
    if (!s) return {};
    if (typeof s === 'object') return s;
    return JSON.parse(s);
  } catch {
    return {};
  }
}
