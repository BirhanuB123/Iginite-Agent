# Ignite-Agent (NestJS + Prisma + pgvector + OpenAI)

A fully functional multi-tenant AI agent with semantic search, tool calling, and row-level security.

## Features

✅ **Multi-tenant Architecture** - Complete tenant isolation using PostgreSQL RLS  
✅ **Semantic Search** - Vector embeddings via OpenAI + pgvector similarity search  
✅ **Tool Calling** - Extensible tool registry with authorization checks  
✅ **Document Ingestion** - Automatic chunking and embedding generation  
✅ **Audit Logging** - Complete audit trail of all tool executions  
✅ **Policy Enforcement** - Role-based access control for sensitive operations

## Quick start

1) Start Postgres (pgvector):
```bash
docker-compose up -d
```

2) Install dependencies:
```bash
npm install
```

3) Copy env:
```bash
cp env.example .env
# Set OPENAI_API_KEY and DATABASE_URL if needed
```

4) Run migrations + generate Prisma client:
```bash
npx prisma migrate deploy
npx prisma generate
```

5) Start API:
```bash
npm run dev
```

## API Endpoints

### 1. Login (No tenant header required)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@acme.com",
    "password": "password123",
    "tenantId": "00000000-0000-0000-0000-000000000001"
  }'
```

### 2. Chat with Agent
```bash
curl -X POST http://localhost:3000/agent/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -H "X-Roles: CLIENT" \
  -d '{ "message": "What are the onboarding steps?" }'
```

### 3. Ingest Documents
```bash
curl -X POST http://localhost:3000/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -H "X-Roles: ADMIN" \
  -d '{
    "corpus": "internal",
    "title": "Onboarding Guide",
    "content": "Step 1: Complete paperwork. Step 2: Setup accounts. Step 3: Meet the team.",
    "sourceUri": "https://example.com/onboarding"
  }'
```

### 4. Search Knowledge Base
```bash
curl -X POST http://localhost:3000/knowledge/search \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -d '{
    "query": "onboarding process",
    "corpus": "internal",
    "topK": 5
  }'
```

## Architecture

### Authentication Flow

1. **Login** - User provides `email`, `password`, and `tenantId` in the request body
2. **Token Generation** - Server returns a JWT `accessToken` and the `tenantId`
3. **Authenticated Requests** - Client includes:
   - `Authorization: Bearer <token>` header
   - `X-Tenant-Id: <tenant-id>` header
   - `X-Roles: <comma-separated-roles>` header (MVP only, later from JWT)

**Note**: Auth endpoints (`/auth/*`) and health checks (`/health`) are excluded from tenant middleware and don't require the `X-Tenant-Id` header.

### Multi-Tenant Isolation

The API wraps each request in a Prisma interactive transaction and executes:
```sql
SELECT set_config('app.tenant_id', '<tenant-uuid>', true);
```

This ensures that PostgreSQL RLS policies automatically filter all queries to the current tenant.

### Available Tools

- **search_knowledge** - Semantic search across tenant knowledge base with citations
- **create_client_request** - Create work items for triage and assignment

### Security

- Row-Level Security (RLS) enforces tenant isolation at the database level
- PolicyService checks authorization before executing any tool
- All tool executions are logged to the audit_events table

## Next steps

- Add more tools: get_team_overview, list_team_capabilities, etc.
- Replace header-based auth with OIDC/JWT
- Add approval workflows for sensitive operations
- Implement streaming responses
- Add conversation history persistence
