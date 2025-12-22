import { Injectable } from '@nestjs/common';
import { KnowledgeService } from '../../knowledge/knowledge.service';

@Injectable()
export class KnowledgeToolHandlers {
  constructor(private readonly knowledge: KnowledgeService) {}

  async searchKnowledge(ctx: { tenantId: string }, input: { query: string; corpus: string; topK?: number }) {
    return this.knowledge.search(ctx.tenantId, input.query, input.corpus, input.topK ?? 5);
  }
}
