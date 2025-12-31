# RAG System Architecture

## Enhanced Search Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER QUERY                                     │
│                    "How do I reset my password?"                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STEP 1: Query Preprocessing                          │
│  • Normalize query (trim, clean special chars)                          │
│  • Input: "How do I reset my password?"                                 │
│  • Output: "How do I reset my password"                                 │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STEP 2: Query Expansion (Optional)                   │
│  • Generate alternative phrasings using GPT-4o-mini                      │
│  • Original: "How do I reset my password"                               │
│  • Expansion 1: "How can I change my password"                          │
│  • Expansion 2: "Steps to recover my account password"                  │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STEP 3: Generate Embeddings                          │
│  • Create embeddings for each query variation                           │
│  • Model: text-embedding-3-small (1536 dimensions)                      │
│  • 3 queries → 3 embedding vectors                                      │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 4: Vector Similarity Search                        │
│  • Query PostgreSQL with pgvector                                       │
│  • Cosine similarity search per embedding                               │
│  • Filter by similarity threshold (≥ 0.70)                              │
│  • Tenant isolation enforced                                            │
│  • Corpus filtering applied                                             │
│                                                                          │
│  SQL: SELECT ... WHERE similarity >= 0.70                               │
│       ORDER BY embedding <=> query_vector                               │
│       LIMIT topK * 2                                                    │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 5: Deduplication & Merging                        │
│  • Combine results from all query variations                            │
│  • Remove duplicate chunks (by chunk ID)                                │
│  • Keep highest similarity score for duplicates                         │
│  • Sort by similarity (descending)                                      │
│                                                                          │
│  Example:                                                               │
│  Query 1: [Chunk A (0.85), Chunk B (0.80)]                             │
│  Query 2: [Chunk A (0.82), Chunk C (0.78)]                             │
│  Merged:  [Chunk A (0.85), Chunk B (0.80), Chunk C (0.78)]             │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 6: LLM-Based Reranking (Optional)                 │
│  • Send chunks + original query to GPT-4o-mini                          │
│  • Ask LLM to rank by relevance to original question                    │
│  • Reorder results based on LLM's ranking                               │
│                                                                          │
│  Before reranking: [A(0.85), B(0.80), C(0.78)]                         │
│  After reranking:  [C(0.78), A(0.85), B(0.80)]                         │
│  (Because C best answers the question despite lower similarity)         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 7: Take Top K Results                             │
│  • Select top K chunks (default: 5)                                     │
│  • Results are now optimally ranked                                     │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 8: Build Citations                                │
│  • Extract relevant snippets (query-aware)                              │
│  • Create citation objects with:                                        │
│    - Document ID & Title                                                │
│    - Chunk ID                                                           │
│    - Relevant snippet (max 400 chars)                                   │
│    - Similarity score                                                   │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 9: Assemble Context                               │
│  • Combine chunks with source attribution                               │
│  • Format: [Source: Title]\nContent\n\n---\n\n[Source: ...]            │
│  • Respect max context length (8000 chars)                              │
│  • Add partial content if needed                                        │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 10: Format Answer Hints                           │
│  • Create structured prompt for LLM                                     │
│  • Include:                                                             │
│    - Query summary                                                      │
│    - Source list with similarities                                      │
│    - Formatted context                                                  │
│    - Instructions for using the context                                 │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  STEP 11: Return Results                                │
│  • Return JSON response with:                                           │
│    - answerHints (structured context)                                   │
│    - citations (array of sources)                                       │
│    - searchMetadata (quality metrics)                                   │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  LLM AGENT (Orchestrator)                               │
│  • Receives answerHints as tool result                                  │
│  • Analyzes context and citations                                       │
│  • Checks similarity scores                                             │
│  • Synthesizes final answer                                             │
│  • Cites sources in response                                            │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     FINAL ANSWER TO USER                                │
│  "To reset your password, follow these steps: [detailed answer]         │
│  *Source: Password Reset Guide (similarity: 0.89)*"                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Document Ingestion Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        NEW DOCUMENT                                      │
│  { title: "Password Reset Guide", content: "..." }                      │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   STEP 1: Create Document Record                        │
│  • Store in 'documents' table                                           │
│  • Fields: id, tenantId, corpus, title, sourceUri, accessLevel         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   STEP 2: Split into Sentences                          │
│  • Smart sentence boundary detection                                    │
│  • Handle abbreviations (Dr., Inc., e.g., i.e.)                        │
│  • Split on: . ! ? followed by space and capital letter                │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              STEP 3: Create Chunks with Overlap                         │
│                                                                          │
│  Settings:                                                              │
│  • Chunk size: 800 characters                                           │
│  • Overlap: 200 characters                                              │
│                                                                          │
│  Example:                                                               │
│  ┌─────────────────────────────┐                                       │
│  │   Chunk 1 (800 chars)       │                                       │
│  │ ┌───────────────────────────┼───────────┐                          │
│  │ │   Overlap (200 chars)     │           │                          │
│  │ └───────────────────────────┤ Chunk 2   │                          │
│  │                             │ (800)     │                          │
│  │                             └───────────┤                          │
│  │                                         └─────────┐                │
│  │                                         Chunk 3   │                │
│  │                                         (800)     │                │
│  │                                         └─────────┘                │
│  └───────────────────────────────────────────────────────────────────┐│
│  • Preserves context at boundaries                                     ││
│  • Minimum chunk size: 50 chars                                        ││
│  • Respects sentence boundaries                                        ││
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               STEP 4: Generate Embeddings                               │
│  • For each chunk, call OpenAI API                                      │
│  • Model: text-embedding-3-small                                        │
│  • Dimensions: 1536                                                     │
│  • Input: chunk text (up to 8000 chars)                                │
│  • Output: [0.123, -0.456, 0.789, ...]                                 │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│               STEP 5: Store Chunks in Database                          │
│  • Table: document_chunks                                               │
│  • Fields:                                                              │
│    - id (UUID)                                                          │
│    - tenantId (for isolation)                                           │
│    - documentId (reference)                                             │
│    - chunkText (the actual text)                                        │
│    - chunkHash (for deduplication)                                      │
│    - embedding (vector(1536))                                           │
│    - createdAt                                                          │
│  • pgvector extension handles vector storage                            │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   STEP 6: Create Vector Index                           │
│  • PostgreSQL automatically indexes vector column                       │
│  • Enables fast similarity search                                       │
│  • Index type: ivfflat or hnsw                                          │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      INGESTION COMPLETE                                 │
│  • Document ready for search                                            │
│  • Chunks indexed and queryable                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌──────────────┐
│   Frontend   │
│  (Web App)   │
└──────┬───────┘
       │
       │ POST /agent/chat
       │ { message: "How do I reset my password?" }
       │
       ▼
┌────────────────────────────────────────────────────────────────┐
│                    Backend API (NestJS)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            OrchestratorService                           │ │
│  │  • Receives user message                                 │ │
│  │  • Calls OpenAI with tools                              │ │
│  │  • Executes tool calls                                   │ │
│  └────────────┬─────────────────────────────────────────────┘ │
│               │                                                 │
│               │ Tool: search_knowledge                          │
│               │ { query: "...", corpus: "..." }                │
│               ▼                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         KnowledgeToolHandlers                            │ │
│  │  • Validates input                                       │ │
│  │  • Calls KnowledgeService                               │ │
│  └────────────┬─────────────────────────────────────────────┘ │
│               │                                                 │
│               ▼                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │            KnowledgeService                              │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │  1. normalizeQuery()                               │ │ │
│  │  │  2. expandQuery()         ← OpenAI API            │ │ │
│  │  │  3. generateEmbedding()   ← OpenAI API            │ │ │
│  │  │  4. vectorSearch()        ← PostgreSQL            │ │ │
│  │  │  5. deduplicateResults()                          │ │ │
│  │  │  6. rerankResults()       ← OpenAI API            │ │ │
│  │  │  7. extractRelevantSnippet()                      │ │ │
│  │  │  8. assembleContext()                             │ │ │
│  │  │  9. formatAnswerHints()                           │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │  • Returns: { answerHints, citations, metadata }      │ │ │
│  └────────────┬─────────────────────────────────────────────┘ │
│               │                                                 │
│               │ Tool result                                     │
│               ▼                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │         OrchestratorService (continued)                  │ │
│  │  • Receives tool result                                  │ │
│  │  • Passes to OpenAI for synthesis                       │ │
│  │  • Gets final answer                                     │ │
│  └────────────┬─────────────────────────────────────────────┘ │
└───────────────┼──────────────────────────────────────────────┘
                │
                │ Response with answer
                ▼
┌──────────────────────────────┐
│    Frontend (continued)       │
│  • Displays answer            │
│  • Shows citations            │
│  • Displays confidence        │
└───────────────────────────────┘

External Services:
┌──────────────┐     ┌──────────────┐
│   OpenAI API │     │ PostgreSQL   │
│              │     │  + pgvector  │
│ • Embeddings │     │              │
│ • Chat       │     │ • Vector DB  │
│ • Reranking  │     │ • Similarity │
└──────────────┘     └──────────────┘
```

---

## Data Flow: Query to Answer

```
User Input
    │
    ├─→ "How do I reset my password?"
    │
    ▼
Preprocessing
    │
    ├─→ Normalize: "How do I reset my password"
    │
    ▼
Query Expansion
    │
    ├─→ Original: "How do I reset my password"
    ├─→ Alt 1:    "How can I change my password"
    ├─→ Alt 2:    "Steps to recover account password"
    │
    ▼
Embedding Generation
    │
    ├─→ Embedding 1: [0.12, -0.45, 0.78, ...]
    ├─→ Embedding 2: [0.15, -0.42, 0.81, ...]
    ├─→ Embedding 3: [0.10, -0.48, 0.75, ...]
    │
    ▼
Vector Search (per embedding)
    │
    ├─→ Query 1 Results: [ChunkA(0.89), ChunkB(0.85), ChunkC(0.82)]
    ├─→ Query 2 Results: [ChunkA(0.87), ChunkD(0.83), ChunkB(0.80)]
    ├─→ Query 3 Results: [ChunkC(0.85), ChunkA(0.84), ChunkE(0.78)]
    │
    ▼
Merge & Deduplicate
    │
    ├─→ ChunkA: max(0.89, 0.87, 0.84) = 0.89
    ├─→ ChunkB: max(0.85, 0.80) = 0.85
    ├─→ ChunkC: max(0.82, 0.85) = 0.85
    ├─→ ChunkD: 0.83
    ├─→ ChunkE: 0.78
    │
    ├─→ Sorted: [A(0.89), B(0.85), C(0.85), D(0.83), E(0.78)]
    │
    ▼
Reranking
    │
    ├─→ LLM analyzes: Which chunks best answer the question?
    │
    ├─→ Reranked: [A(0.89), C(0.85), D(0.83), B(0.85), E(0.78)]
    │                (C moved up because more relevant despite same score)
    │
    ▼
Take Top K (5)
    │
    ├─→ [A(0.89), C(0.85), D(0.83), B(0.85), E(0.78)]
    │
    ▼
Extract Snippets
    │
    ├─→ Chunk A: "...to reset your password, navigate to Settings..."
    ├─→ Chunk C: "...click 'Forgot Password' and enter your email..."
    ├─→ ...
    │
    ▼
Assemble Context
    │
    ├─→ [Source: Password Reset Guide]
    │   To reset your password, navigate to Settings...
    │   
    │   ---
    │   
    │   [Source: Account Security FAQ]
    │   If you forgot your password, click 'Forgot Password'...
    │
    ▼
Format Answer Hints
    │
    ├─→ # Knowledge Base Search Results
    │   **Query:** How do I reset my password
    │   **Found:** 5 relevant documents
    │   
    │   ## Sources:
    │   1. Password Reset Guide (similarity: 0.89)
    │   ...
    │   
    │   ## Context:
    │   [assembled context from above]
    │
    ▼
Return to Orchestrator
    │
    ├─→ Tool result: { answerHints, citations, metadata }
    │
    ▼
OpenAI Synthesis
    │
    ├─→ System: You are Adwa-Agent...
    ├─→ User: How do I reset my password?
    ├─→ Tool result: [context with 5 sources]
    ├─→ LLM: Analyzes context and generates answer
    │
    ▼
Final Answer
    │
    └─→ "To reset your password, follow these steps:
        1. Navigate to Settings > Account Security
        2. Click 'Reset Password'
        3. Enter your email address
        4. Check your email for the reset link
        
        *Source: Password Reset Guide (similarity: 0.89)*
        *Source: Account Security FAQ (similarity: 0.85)*"
```

---

## Performance Characteristics

### Time Complexity

| Step | Time | Notes |
|------|------|-------|
| Query Expansion | ~200ms | 1 OpenAI API call |
| Embedding (per query) | ~100ms | OpenAI API call |
| Vector Search | ~50ms | PostgreSQL + pgvector (indexed) |
| Reranking | ~200ms | 1 OpenAI API call |
| **Total (3 queries)** | **~800ms** | With all features enabled |

### Optimization Options

| Configuration | Time | Accuracy |
|---------------|------|----------|
| All features | ~800ms | ⭐⭐⭐⭐⭐ |
| No expansion | ~400ms | ⭐⭐⭐⭐ |
| No reranking | ~600ms | ⭐⭐⭐⭐ |
| Basic search | ~150ms | ⭐⭐⭐ |

---

## Database Schema

```sql
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  tenantId UUID NOT NULL REFERENCES tenants(id),
  corpus VARCHAR NOT NULL,  -- 'client_public', 'client_private', 'internal'
  title VARCHAR NOT NULL,
  sourceUri VARCHAR,
  accessLevel VARCHAR DEFAULT 'TENANT',
  metadataJson JSONB DEFAULT '{}',
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_tenant_corpus ON documents(tenantId, corpus);

-- Document chunks with embeddings
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY,
  tenantId UUID NOT NULL REFERENCES tenants(id),
  documentId UUID NOT NULL REFERENCES documents(id),
  chunkText TEXT NOT NULL,
  chunkHash VARCHAR NOT NULL,
  embedding vector(1536),  -- pgvector type
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chunks_tenant_doc ON document_chunks(tenantId, documentId);

-- Vector similarity index for fast search
CREATE INDEX idx_chunks_embedding ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## API Endpoints

### Search Knowledge

```
POST /knowledge/search
Authorization: Bearer <token>

Request:
{
  "query": "How do I reset my password?",
  "corpus": "client_public",
  "topK": 5,
  "enableQueryExpansion": true,
  "rerank": true,
  "similarityThreshold": 0.70
}

Response:
{
  "answerHints": "# Knowledge Base Search Results...",
  "citations": [
    {
      "documentId": "uuid",
      "title": "Password Reset Guide",
      "chunkId": "uuid",
      "snippet": "To reset your password...",
      "similarity": 0.89
    }
  ],
  "searchMetadata": {
    "queriesUsed": 3,
    "resultsFound": 5,
    "averageSimilarity": 0.85,
    "reranked": true,
    "similarityThreshold": 0.70
  }
}
```

### Ingest Document

```
POST /knowledge/ingest
Authorization: Bearer <token>

Request:
{
  "corpus": "client_public",
  "title": "Password Reset Guide",
  "content": "Long document content...",
  "sourceUri": "https://docs.example.com/password-reset"
}

Response:
{
  "documentId": "uuid",
  "title": "Password Reset Guide",
  "chunksCreated": 12
}
```

---

**Last Updated:** December 31, 2025  
**Version:** 2.0 - Enhanced RAG System
