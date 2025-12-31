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

export type SearchOptions = {
  similarityThreshold?: number;  // Minimum similarity score (0-1)
  maxContextLength?: number;      // Maximum total context length in chars
  enableQueryExpansion?: boolean; // Generate alternative query phrasings
  rerank?: boolean;               // Use LLM-based reranking for better relevance
};

@Injectable()
export class KnowledgeService {
  private readonly openai: OpenAI;
  private readonly MIN_SIMILARITY = 0.70;  // Default minimum similarity threshold
  private readonly CHUNK_SIZE = 800;        // Increased from 500 for better context
  private readonly CHUNK_OVERLAP = 200;     // Overlap to preserve context at boundaries

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
   * Enhanced semantic search with query expansion and relevance filtering.
   */
  async search(
    tenantId: string, 
    query: string, 
    corpus: string, 
    topK: number = 5,
    options: SearchOptions = {}
  ) {
    const client = this.prisma.client();
    const similarityThreshold = options.similarityThreshold ?? this.MIN_SIMILARITY;
    const maxContextLength = options.maxContextLength ?? 8000;
    const enableQueryExpansion = options.enableQueryExpansion ?? true;
    const rerank = options.rerank ?? true;

    // Step 1: Query preprocessing - normalize and clean
    const normalizedQuery = this.normalizeQuery(query);

    // Step 2: Query expansion (optional) - generate alternative phrasings
    let queries = [normalizedQuery];
    if (enableQueryExpansion && normalizedQuery.length > 10) {
      try {
        const expandedQueries = await this.expandQuery(normalizedQuery);
        queries = [normalizedQuery, ...expandedQueries];
      } catch (error) {
        console.warn('Query expansion failed, using original query:', error);
      }
    }

    // Step 3: Multi-query retrieval - search with all query variations
    const allResults: Array<{
      id: string;
      documentId: string;
      chunkText: string;
      similarity: number;
      title: string;
      queryUsed: string;
    }> = [];

    for (const q of queries) {
      const queryEmbedding = await this.generateEmbedding(q);
      const embeddingVector = `[${queryEmbedding.join(',')}]`;

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
          AND 1 - (c.embedding <=> ${embeddingVector}::vector) >= ${similarityThreshold}
        ORDER BY c.embedding <=> ${embeddingVector}::vector
        LIMIT ${topK * 2}
      `;

      allResults.push(...results.map(r => ({ ...r, queryUsed: q })));
    }

    // Step 4: Deduplicate and merge results
    const uniqueResults = this.deduplicateResults(allResults);

    if (uniqueResults.length === 0) {
      return {
        answerHints: `No relevant documents found matching your query in the knowledge base. Try rephrasing your question or checking if the information exists in the system.`,
        citations: [] as KnowledgeCitation[],
        searchMetadata: {
          queriesUsed: queries.length,
          similarityThreshold,
          resultsBeforeFilter: allResults.length,
        },
      };
    }

    // Step 5: Rerank results using LLM for better relevance (optional)
    let rankedResults = uniqueResults.slice(0, topK * 2);
    if (rerank && uniqueResults.length > 1) {
      try {
        rankedResults = await this.rerankResults(normalizedQuery, uniqueResults.slice(0, topK * 2));
      } catch (error) {
        console.warn('Reranking failed, using similarity scores:', error);
      }
    }

    // Step 6: Take top K after reranking
    const finalResults = rankedResults.slice(0, topK);

    // Step 7: Build citations with enhanced snippets
    const citations: KnowledgeCitation[] = finalResults.map(r => ({
      documentId: r.documentId,
      title: r.title ?? 'Untitled',
      chunkId: r.id,
      snippet: this.extractRelevantSnippet(r.chunkText, normalizedQuery),
      similarity: Math.round(r.similarity * 100) / 100,
    }));

    // Step 8: Assemble context with deduplication and length limits
    const context = this.assembleContext(finalResults, maxContextLength);

    // Step 9: Generate structured answer hints
    const answerHints = this.formatAnswerHints(context, citations, normalizedQuery);

    return {
      answerHints,
      citations,
      searchMetadata: {
        queriesUsed: queries.length,
        similarityThreshold,
        resultsFound: finalResults.length,
        averageSimilarity: finalResults.reduce((sum, r) => sum + r.similarity, 0) / finalResults.length,
        reranked: rerank,
      },
    };
  }

  /**
   * Normalize query - clean up and prepare for search.
   */
  private normalizeQuery(query: string): string {
    return query
      .trim()
      .replace(/\s+/g, ' ')  // Collapse multiple spaces
      .replace(/[^\w\s?!.,'-]/g, '');  // Remove special chars but keep punctuation
  }

  /**
   * Expand query using LLM to generate alternative phrasings.
   */
  private async expandQuery(query: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a query expansion assistant. Generate 2 alternative phrasings of the user query that preserve the original meaning but use different words. Return only the alternative queries, one per line, without numbering or explanation.',
          },
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content || '';
      const alternatives = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 5 && line.length < 200)
        .slice(0, 2);

      return alternatives;
    } catch (error) {
      console.warn('Query expansion failed:', error);
      return [];
    }
  }

  /**
   * Deduplicate results by chunk ID and keep highest similarity.
   */
  private deduplicateResults(results: Array<any>): Array<any> {
    const map = new Map<string, any>();
    
    for (const result of results) {
      const existing = map.get(result.id);
      if (!existing || result.similarity > existing.similarity) {
        map.set(result.id, result);
      }
    }

    return Array.from(map.values()).sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Rerank results using LLM to assess relevance to the query.
   */
  private async rerankResults(query: string, results: Array<any>): Promise<Array<any>> {
    if (results.length <= 1) return results;

    try {
      // Build prompt for LLM to score relevance
      const chunks = results.map((r, idx) => `[${idx}] ${r.chunkText}`).join('\n\n---\n\n');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a relevance scoring assistant. Given a query and document chunks, rank the chunks by relevance to the query. Return ONLY a comma-separated list of chunk indices in order of relevance (most relevant first). Example: 2,0,3,1`,
          },
          {
            role: 'user',
            content: `Query: ${query}\n\nChunks:\n${chunks}\n\nRank these chunks by relevance:`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const content = response.choices[0]?.message?.content || '';
      const indices = content
        .split(',')
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n) && n >= 0 && n < results.length);

      if (indices.length === 0) return results;

      // Reorder results based on LLM ranking
      const reranked = indices.map(idx => results[idx]);
      
      // Add any missing results at the end
      const included = new Set(indices);
      for (let i = 0; i < results.length; i++) {
        if (!included.has(i)) {
          reranked.push(results[i]);
        }
      }

      return reranked;
    } catch (error) {
      console.warn('Reranking failed:', error);
      return results;
    }
  }

  /**
   * Extract most relevant snippet from chunk text based on query.
   */
  private extractRelevantSnippet(text: string, query: string, maxLength: number = 400): string {
    // Simple implementation: try to find query terms and extract context around them
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    
    if (queryTerms.length === 0 || text.length <= maxLength) {
      return text.slice(0, maxLength);
    }

    // Find first occurrence of any query term
    const lowerText = text.toLowerCase();
    let bestIndex = -1;
    
    for (const term of queryTerms) {
      const idx = lowerText.indexOf(term);
      if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
        bestIndex = idx;
      }
    }

    if (bestIndex === -1) {
      return text.slice(0, maxLength);
    }

    // Extract context around the match
    const start = Math.max(0, bestIndex - 150);
    const end = Math.min(text.length, start + maxLength);
    let snippet = text.slice(start, end);

    // Add ellipsis if truncated
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet.trim();
  }

  /**
   * Assemble context from results with length limits and deduplication.
   */
  private assembleContext(results: Array<any>, maxLength: number): string {
    const contextParts: string[] = [];
    let totalLength = 0;

    for (const result of results) {
      const part = `[Source: ${result.title}]\n${result.chunkText}`;
      
      if (totalLength + part.length > maxLength) {
        // Try to add partial content
        const remaining = maxLength - totalLength;
        if (remaining > 200) {
          contextParts.push(part.slice(0, remaining - 20) + '...');
        }
        break;
      }

      contextParts.push(part);
      totalLength += part.length + 2; // +2 for separator
    }

    return contextParts.join('\n\n---\n\n');
  }

  /**
   * Format answer hints for better LLM consumption.
   */
  private formatAnswerHints(context: string, citations: KnowledgeCitation[], query: string): string {
    const citationList = citations
      .map((c, idx) => `${idx + 1}. ${c.title} (similarity: ${c.similarity})`)
      .join('\n');

    return [
      `# Knowledge Base Search Results`,
      ``,
      `**Query:** ${query}`,
      `**Found:** ${citations.length} relevant document(s)`,
      ``,
      `## Sources:`,
      citationList,
      ``,
      `## Context:`,
      context,
      ``,
      `---`,
      `**Instructions:** Use the above context to answer the user's question accurately. Always cite the sources when providing information. If the context doesn't fully answer the question, acknowledge this and provide the best answer possible based on available information.`,
    ].join('\n');
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

    // Split content into chunks with improved strategy
    const chunks = this.splitIntoChunks(content);

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
   * Enhanced text chunking with overlap for better context preservation.
   */
  private splitIntoChunks(text: string, chunkSize?: number, overlap?: number): string[] {
    const size = chunkSize ?? this.CHUNK_SIZE;
    const overlapSize = overlap ?? this.CHUNK_OVERLAP;
    const chunks: string[] = [];
    
    // First, split into sentences for better semantic boundaries
    const sentences = this.splitIntoSentences(text);
    
    let currentChunk: string[] = [];
    let currentLength = 0;
    let sentenceIndex = 0;

    while (sentenceIndex < sentences.length) {
      const sentence = sentences[sentenceIndex];
      const sentenceLength = sentence.length;

      // If adding this sentence exceeds chunk size and we have content
      if (currentLength + sentenceLength > size && currentChunk.length > 0) {
        // Save current chunk
        const chunkText = currentChunk.join(' ').trim();
        if (chunkText.length > 50) {  // Minimum chunk size
          chunks.push(chunkText);
        }

        // Calculate overlap: keep last few sentences for context
        let overlapLength = 0;
        const overlapSentences: string[] = [];
        
        for (let i = currentChunk.length - 1; i >= 0 && overlapLength < overlapSize; i--) {
          const sent = currentChunk[i];
          if (overlapLength + sent.length <= overlapSize) {
            overlapSentences.unshift(sent);
            overlapLength += sent.length;
          } else {
            break;
          }
        }

        // Start new chunk with overlap
        currentChunk = overlapSentences;
        currentLength = overlapLength;
      } else {
        // Add sentence to current chunk
        currentChunk.push(sentence);
        currentLength += sentenceLength;
        sentenceIndex++;
      }
    }

    // Don't forget the last chunk
    if (currentChunk.length > 0) {
      const chunkText = currentChunk.join(' ').trim();
      if (chunkText.length > 50) {
        chunks.push(chunkText);
      }
    }

    return chunks;
  }

  /**
   * Split text into sentences more intelligently.
   */
  private splitIntoSentences(text: string): string[] {
    // Handle common abbreviations to avoid false sentence breaks
    let processed = text
      .replace(/Dr\./g, 'Dr<DOT>')
      .replace(/Mr\./g, 'Mr<DOT>')
      .replace(/Mrs\./g, 'Mrs<DOT>')
      .replace(/Ms\./g, 'Ms<DOT>')
      .replace(/Jr\./g, 'Jr<DOT>')
      .replace(/Sr\./g, 'Sr<DOT>')
      .replace(/Inc\./g, 'Inc<DOT>')
      .replace(/Ltd\./g, 'Ltd<DOT>')
      .replace(/Corp\./g, 'Corp<DOT>')
      .replace(/\bi\.e\./gi, 'i<DOT>e<DOT>')
      .replace(/\be\.g\./gi, 'e<DOT>g<DOT>');

    // Split on sentence boundaries
    const sentences = processed
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map(s => s.replace(/<DOT>/g, '.').trim())
      .filter(s => s.length > 0);

    return sentences;
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
