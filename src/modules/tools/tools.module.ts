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
      description: 'Search tenant knowledge base using semantic search with automatic query expansion and relevance reranking for highly accurate results. Returns relevant document chunks with citations.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { 
            type: 'string',
            description: 'The user question or search query'
          },
          corpus: { 
            type: 'string', 
            description: 'Knowledge base corpus: client_public (publicly shareable), client_private (confidential), or internal (company-internal)' 
          },
          topK: { 
            type: 'number',
            description: 'Number of results to return (default: 5, max: 15)'
          },
          enableQueryExpansion: {
            type: 'boolean',
            description: 'Generate alternative query phrasings for better retrieval (default: true)'
          },
          rerank: {
            type: 'boolean',
            description: 'Use LLM-based reranking for better relevance (default: true)'
          },
        },
        required: ['query', 'corpus'],
        additionalProperties: false,
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
        additionalProperties: false,
      },
      handler: (ctx, input) => this.workflowHandlers.createClientRequest(ctx, input),
    });
  }
}
