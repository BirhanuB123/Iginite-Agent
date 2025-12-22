import { Module, OnModuleInit } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service';
import { KnowledgeToolHandlers } from './handlers/knowledge.tool';
import { WorkflowToolHandlers } from './handlers/workflow.tool';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [KnowledgeModule, WorkflowModule],
  providers: [ToolRegistryService, KnowledgeToolHandlers, WorkflowToolHandlers],
  exports: [ToolRegistryService],
})
export class ToolsModule implements OnModuleInit {
  constructor(
    private readonly registry: ToolRegistryService,
    private readonly knowledgeHandlers: KnowledgeToolHandlers,
    private readonly workflowHandlers: WorkflowToolHandlers,
  ) {}

  onModuleInit() {
    this.registry.register({
      name: 'search_knowledge',
      description: 'Search tenant knowledge base by corpus with citations.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          corpus: { type: 'string', description: 'client_public | client_private | internal' },
          topK: { type: 'number' },
        },
        required: ['query', 'corpus'],
      },
      handler: (ctx, input) => this.knowledgeHandlers.searchKnowledge(ctx, input),
    });

    this.registry.register({
      name: 'create_client_request',
      description: 'Create a client request work item for triage and assignment.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          details: { type: 'string' },
          priority: { type: 'string', description: 'LOW | MEDIUM | HIGH | URGENT' },
        },
        required: ['title'],
      },
      handler: (ctx, input) => this.workflowHandlers.createClientRequest(ctx, input),
    });
  }
}
