-- This is an empty migration.-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column AFTER table exists
ALTER TABLE "document_chunks"
  ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- Vector index
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON "document_chunks"
  USING ivfflat ("embedding" vector_cosine_ops);

-- Enable RLS
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_capabilities" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "work_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "approvals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "document_chunks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_events" ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policies
CREATE POLICY tenant_isolation_users
  ON "users"
  USING ("tenantId" = current_setting('app.tenantId')::uuid);

CREATE POLICY tenant_isolation_teams
  ON "teams"
  USING ("tenantId" = current_setting('app.tenantId')::uuid);

CREATE POLICY tenant_isolation_team_caps
  ON "team_capabilities"
  USING ("tenantId" = current_setting('app.tenantId')::uuid);

CREATE POLICY tenant_isolation_work_items
  ON "work_items"
  USING ("tenantId" = current_setting('app.tenantId')::uuid);

CREATE POLICY tenant_isolation_documents
  ON "documents"
  USING ("tenantId" = current_setting('app.tenantId')::uuid);

CREATE POLICY tenant_isolation_doc_chunks
  ON "document_chunks"
  USING ("tenantId" = current_setting('app.tenantId')::uuid);

CREATE POLICY tenant_isolation_audit
  ON "audit_events"
  USING ("tenantId" = current_setting('app.tenantId')::uuid);
