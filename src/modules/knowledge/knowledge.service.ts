import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import OpenAI from 'openai';

export type KnowledgeCitation = {
  documentId: string;
  title: string;
  chunkId: string;
  snippet: string;
  similarity?: number;
};

@Injectable()
export class KnowledgeService {
  private readonly openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  /**
   * Generate embedding for a given text using OpenAI.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.slice(0, 8000), // Limit to 8000 chars to avoid token limits
        dimensions: 1536,
      });
      return response.data[0].embedding;
    } catch (error: any) {
      console.error('OpenAI embedding error:', error.message);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Semantic search using pgvector cosine similarity.
   */
  async search(tenantId: string, query: string, corpus: string, topK: number = 5) {
    const client = this.prisma.client();

    // Generate embedding for query
    const queryEmbedding = await this.generateEmbedding(query);
    const embeddingVector = `[${queryEmbedding.join(',')}]`;

    // Perform vector similarity search with RLS (tenant isolation via app.tenantId)
    const results = await client.$queryRaw<Array<{
      id: string;
      documentId: string;
      chunkText: string;
      similarity: number;
      title: string;
    }>>`
      SELECT 
        c.id,
        c."documentId",
        c."chunkText",
        1 - (c.embedding <=> ${embeddingVector}::vector) as similarity,
        d.title
      FROM "document_chunks" c
      JOIN "documents" d ON d.id = c."documentId"
      WHERE c."tenantId" = ${tenantId}::uuid
        AND d.corpus = ${corpus}
        AND c.embedding IS NOT NULL
      ORDER BY c.embedding <=> ${embeddingVector}::vector
      LIMIT ${topK}
    `;

    if (!results || results.length === 0) {
      return {
        answerHints: 'No documents found for this query in the knowledge base.',
        citations: [] as KnowledgeCitation[],
      };
    }

    const citations: KnowledgeCitation[] = results.map(r => ({
      documentId: r.documentId,
      title: r.title ?? 'Untitled',
      chunkId: r.id,
      snippet: r.chunkText.slice(0, 400),
      similarity: Math.round(r.similarity * 100) / 100,
    }));

    const context = results.map(r => r.chunkText).join('\n\n');

    return {
      answerHints: `Found ${citations.length} relevant document chunks. Context:\n\n${context}`,
      citations,
    };
  }

  /**
   * Ingest a document by splitting it into chunks and generating embeddings.
   */
  async ingestDocument(
    tenantId: string,
    corpus: string,
    title: string,
    content: string,
    sourceUri?: string,
  ) {
    const client = this.prisma.client();

    // Create document record
    const document = await client.document.create({
      data: {
        id: this.generateUuid(),
        tenantId,
        corpus,
        title,
        sourceUri,
        accessLevel: 'TENANT',
        metadataJson: {},
      },
    });

    // Split content into chunks (simple implementation - split by paragraphs or every 500 chars)
    const chunks = this.splitIntoChunks(content, 500);

    // Generate embeddings and store chunks
    for (const chunkText of chunks) {
      const embedding = await this.generateEmbedding(chunkText);
      const embeddingVector = `[${embedding.join(',')}]`;
      const chunkHash = this.hashString(chunkText);

      await client.$executeRaw`
        INSERT INTO "document_chunks" 
          (id, "tenantId", "documentId", "chunkText", "chunkHash", embedding, "createdAt")
        VALUES 
          (${this.generateUuid()}::uuid, ${tenantId}::uuid, ${document.id}::uuid, 
           ${chunkText}, ${chunkHash}, ${embeddingVector}::vector, NOW())
      `;
    }

    return {
      documentId: document.id,
      title: document.title,
      chunksCreated: chunks.length,
    };
  }

  /**
   * Simple text chunking by character count with overlap.
   */
  private splitIntoChunks(text: string, chunkSize: number = 500): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/[.!?]\s+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter(c => c.length > 0);
  }

  /**
   * Simple hash for chunk deduplication.
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Generate UUID v4.
   */
  private generateUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
