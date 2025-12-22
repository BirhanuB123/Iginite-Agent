import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

export type KnowledgeCitation = {
  documentId: string;
  title: string;
  chunkId: string;
  snippet: string;
};

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * MVP: returns latest chunks by corpus with a simple ILIKE match.
   * Production: replace with embeddings + pgvector cosine similarity search.
   */
  async search(tenantId: string, query: string, corpus: string, topK: number) {
    const client = this.prisma.client();

    const docs = await client.document.findMany({
      where: { tenantId, corpus },
      take: 50,
      orderBy: { createdAt: 'desc' },
    });

    const docIds = docs.map(d => d.id);
    if (!docIds.length) {
      return { answerHints: 'No documents found for this tenant/corpus.', citations: [] as KnowledgeCitation[] };
    }

    const chunks = await client.documentChunk.findMany({
      where: {
        tenantId,
        documentId: { in: docIds },
        chunkText: { contains: query, mode: 'insensitive' },
      },
      take: topK,
      orderBy: { createdAt: 'desc' },
    });

    const docById = new Map(docs.map(d => [d.id, d]));
    const citations: KnowledgeCitation[] = chunks.map(c => ({
      documentId: c.documentId,
      title: docById.get(c.documentId)?.title ?? 'Untitled',
      chunkId: c.id,
      snippet: c.chunkText.slice(0, 400),
    }));

    return {
      answerHints: citations.length ? `Found ${citations.length} matching snippets.` : 'No direct text matches found. Consider embedding-based search.',
      citations,
    };
  }
}
