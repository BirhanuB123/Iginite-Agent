-- Restore pgvector extension and embedding column
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column back
ALTER TABLE "document_chunks"
  ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- Recreate vector index for cosine similarity search
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON "document_chunks"
  USING ivfflat ("embedding" vector_cosine_ops)
  WITH (lists = 100);

