-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Prisma will create tables; we add pgvector column + index + RLS policies after.
-- If using prisma migrate, this migration runs in order with Prisma's schema.

-- Add embedding column to document_chunks
ALTER TABLE "document_chunks"
  ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- Vector index (IVFFLAT). Requires ANALYZE and sufficient rows for best performance.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'document_chunks_embedding_idx'
  ) THEN
    CREATE INDEX document_chunks_embedding_idx
      ON "document_chunks"
      USING ivfflat ("embedding" vector_cosine_ops);
  END IF;
END $$;

-- Enable RLS on tenant-scoped tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_capabilities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "work_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "approvals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "document_chunks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;

-- Policies based on app.tenant_id set per request:
-- SELECT set_config('app.tenant_id', '<uuid>', true);

DROP POLICY IF EXISTS tenant_isolation_users ON "users";
CREATE POLICY tenant_isolation_users ON "users"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);

DROP POLICY IF EXISTS tenant_isolation_teams ON "teams";
CREATE POLICY tenant_isolation_teams ON "teams"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);

DROP POLICY IF EXISTS tenant_isolation_team_caps ON "team_capabilities";
CREATE POLICY tenant_isolation_team_caps ON "team_capabilities"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);

DROP POLICY IF EXISTS tenant_isolation_work_items ON "work_items";
CREATE POLICY tenant_isolation_work_items ON "work_items"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);

DROP POLICY IF EXISTS tenant_isolation_approvals ON "approvals";
CREATE POLICY tenant_isolation_approvals ON "approvals"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);

DROP POLICY IF EXISTS tenant_isolation_documents ON "documents";
CREATE POLICY tenant_isolation_documents ON "documents"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);

DROP POLICY IF EXISTS tenant_isolation_doc_chunks ON "document_chunks";
CREATE POLICY tenant_isolation_doc_chunks ON "document_chunks"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);

DROP POLICY IF EXISTS tenant_isolation_audit ON "audit_events";
CREATE POLICY tenant_isolation_audit ON "audit_events"
  USING ("tenant_id" = current_setting('app.tenant_id')::uuid);
