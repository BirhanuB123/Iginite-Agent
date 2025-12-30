import { Body, Controller, Post, Req } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post('ingest')
  async ingestDocument(
    @Req() req: any,
    @Body() body: {
      corpus: string;
      title: string;
      content: string;
      sourceUri?: string;
    },
  ) {
    const ctx = req.tenantContext;
    return this.knowledgeService.ingestDocument(
      ctx.tenantId,
      body.corpus,
      body.title,
      body.content,
      body.sourceUri,
    );
  }

  @Post('search')
  async searchKnowledge(
    @Req() req: any,
    @Body() body: {
      query: string;
      corpus: string;
      topK?: number;
    },
  ) {
    const ctx = req.tenantContext;
    return this.knowledgeService.search(
      ctx.tenantId,
      body.query,
      body.corpus,
      body.topK ?? 5,
    );
  }
}

