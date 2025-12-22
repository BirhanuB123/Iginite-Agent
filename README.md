# Ignite-Agent (NestJS + Prisma + pgvector + OpenAI)

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
cp .env.example .env
# set OPENAI_API_KEY, and set DATABASE_URL if needed
```

4) Run migrations + generate Prisma client:
```bash
npx prisma migrate dev --name init
```

5) Start API:
```bash
npm run dev
```

## Test the Agent endpoint

This MVP resolves tenant via header `X-Tenant-Id` (UUID).

```bash
curl -X POST http://localhost:3000/agent/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -H "X-Roles: CLIENT" \
  -d '{ "message": "Search internal knowledge for onboarding steps." }'
```

## Notes on Tenant RLS

- The API wraps each request in a Prisma interactive transaction.
- It executes:
  `SELECT set_config('app.tenant_id', '<tenant-uuid>', true);`
  so Postgres RLS policies apply to all subsequent queries in that transaction.

## Next steps

- Add real embeddings + pgvector similarity search in KnowledgeService.
- Add Teams tools: get_team_overview, list_team_capabilities, etc.
- Replace header-based auth with OIDC/JWT.
- Add approval gates for sensitive tools.
