# 🚀 Quick Start Guide

This guide will help you get Ignite-Agent up and running in minutes.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- OpenAI API key

## Setup (Automated)

```bash
# Make the setup script executable
chmod +x setup-dev.sh

# Run the setup script
./setup-dev.sh
```

The script will:
1. Create `.env` from `env.example`
2. Install npm dependencies
3. Start PostgreSQL with pgvector
4. Run database migrations
5. Generate Prisma client
6. Seed test data

## Setup (Manual)

If you prefer manual setup:

```bash
# 1. Copy environment file
cp env.example .env

# 2. Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-...

# 3. Install dependencies
npm install

# 4. Start database
docker-compose up -d

# 5. Run migrations
npx prisma migrate deploy
npx prisma generate

# 6. Seed database (optional)
npx prisma db seed
```

## Start the Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Test the Agent

Run the automated test suite:

```bash
chmod +x test-agent.sh
./test-agent.sh
```

Or test manually:

### 1. Ingest a Document

```bash
curl -X POST http://localhost:3000/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -H "X-Roles: ADMIN" \
  -d '{
    "corpus": "internal",
    "title": "Company Handbook",
    "content": "Our company values teamwork, innovation, and customer success. We offer flexible work hours and remote work options.",
    "sourceUri": "https://internal.example.com/handbook"
  }'
```

### 2. Chat with the Agent

```bash
curl -X POST http://localhost:3000/agent/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -H "X-Roles: CLIENT" \
  -d '{
    "message": "What are our company values?"
  }'
```

### 3. Create a Work Item

```bash
curl -X POST http://localhost:3000/agent/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -H "X-Roles: CLIENT" \
  -d '{
    "message": "I need help with my laptop. Can you create a support ticket?"
  }'
```

## Verify Everything Works

You should see:
1. ✅ Document successfully ingested with embeddings generated
2. ✅ Agent responds with relevant information from the knowledge base
3. ✅ Agent creates work items when requested

## Troubleshooting

### Database connection fails
- Ensure Docker is running: `docker ps`
- Check container status: `docker-compose ps`
- Restart containers: `docker-compose restart`

### OpenAI API errors
- Verify your API key in `.env`
- Check your OpenAI account has credits
- Ensure you're using a valid model (gpt-4o-mini)

### Embeddings not working
- Run migration: `npx prisma migrate deploy`
- Check if pgvector extension is enabled:
  ```bash
  docker exec -it $(docker ps -q -f name=postgres) psql -U postgres -d ignite_agent -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
  ```

### Port already in use
- Change PORT in `.env`
- Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)

## Next Steps

- Read the full [README.md](README.md) for architecture details
- Check [CHANGELOG.md](CHANGELOG.md) for recent updates
- Explore the codebase:
  - `src/modules/agent/` - Agent orchestration
  - `src/modules/knowledge/` - Semantic search
  - `src/modules/tools/` - Tool registry and handlers
  - `src/common/` - Shared infrastructure

## Development Tips

### Watch Database Queries
```bash
npx prisma studio
```

### View Logs
The agent logs all tool executions to the `audit_events` table.

### Add New Tools
1. Create a handler in `src/modules/tools/handlers/`
2. Register it in `src/modules/tools/tools.module.ts`
3. The agent will automatically discover and use it!

### Test Tenant Isolation
The test script includes tenant isolation tests. Each tenant's data is completely isolated via PostgreSQL RLS.

## Support

For issues or questions:
- Check existing code comments
- Review the architecture in README.md
- Check the CHANGELOG.md for recent changes

