import { Injectable } from '@nestjs/common';
import { KnowledgeService, SearchOptions } from '../../knowledge/knowledge.service';

@Injectable()
export class KnowledgeToolHandlers {
  constructor(private readonly knowledge: KnowledgeService) {}

  async searchKnowledge(
    ctx: { tenantId: string }, 
    input: { 
      query: string; 
      corpus: string; 
      topK?: number;
      similarityThreshold?: number;
      enableQueryExpansion?: boolean;
      rerank?: boolean;
    }
  ) {
    const options: SearchOptions = {
      similarityThreshold: input.similarityThreshold,
      enableQueryExpansion: input.enableQueryExpansion ?? true,
      rerank: input.rerank ?? true,
    };

    return this.knowledge.search(
      ctx.tenantId, 
      input.query, 
      input.corpus, 
      input.topK ?? 5,
      options
    );
  }
}
