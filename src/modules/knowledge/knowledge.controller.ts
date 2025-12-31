import { Body, Controller, Post, Req, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post('ingest')
  @HttpCode(HttpStatus.CREATED)
  async ingestDocument(
    @Req() req: any,
    @Body() body: {
      corpus: string;
      title: string;
      content: string;
      sourceUri?: string;
    },
  ) {
    // Validation
    if (!body.corpus || !body.title || !body.content) {
      throw new BadRequestException('corpus, title, and content are required');
    }

    if (body.content.length < 10) {
      throw new BadRequestException('content must be at least 10 characters');
    }

    if (body.title.length > 500) {
      throw new BadRequestException('title must be less than 500 characters');
    }

    const validCorpuses = ['internal', 'client_public', 'client_private'];
    if (!validCorpuses.includes(body.corpus)) {
      throw new BadRequestException(`corpus must be one of: ${validCorpuses.join(', ')}`);
    }

    const ctx = req.tenantContext;
    
    try {
      return await this.knowledgeService.ingestDocument(
        ctx.tenantId,
        body.corpus,
        body.title,
        body.content,
        body.sourceUri,
      );
    } catch (error: any) {
      throw new BadRequestException(`Failed to ingest document: ${error.message}`);
    }
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
    // Validation
    if (!body.query || !body.corpus) {
      throw new BadRequestException('query and corpus are required');
    }

    if (body.query.length < 2) {
      throw new BadRequestException('query must be at least 2 characters');
    }

    if (body.topK && (body.topK < 1 || body.topK > 50)) {
      throw new BadRequestException('topK must be between 1 and 50');
    }

    const ctx = req.tenantContext;
    
    try {
      return await this.knowledgeService.search(
        ctx.tenantId,
        body.query,
        body.corpus,
        body.topK ?? 5,
      );
    } catch (error: any) {
      throw new BadRequestException(`Failed to search knowledge base: ${error.message}`);
    }
  }
}

