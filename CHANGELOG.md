# Changelog

## [Unreleased] - 2024-12-24

### Added
- ✅ Full semantic search with OpenAI embeddings + pgvector
- ✅ Document ingestion endpoint with automatic chunking
- ✅ Knowledge base search endpoint
- ✅ Comprehensive test scripts (test-agent.sh)
- ✅ Development setup script (setup-dev.sh)
- ✅ Environment configuration example (env.example)
- ✅ Enhanced README with full API documentation

### Changed
- 🔧 Migrated from OpenAI Responses API to standard Chat Completions API
- 🔧 Fixed model name from invalid `gpt-4.1-mini` to correct `gpt-4o-mini`
- 🔧 Restored embedding column in database schema
- 🔧 Enhanced system instructions for better agent behavior
- 🔧 Improved error handling in tool execution

### Fixed
- 🐛 Fixed missing embedding column that was accidentally removed in migration
- 🐛 Added proper pgvector index for cosine similarity search
- 🐛 Fixed tool execution flow with proper error handling

### Technical Details

#### Knowledge Service Improvements
- Implemented `generateEmbedding()` using OpenAI text-embedding-3-small
- Implemented `search()` with pgvector cosine similarity
- Added `ingestDocument()` with automatic text chunking
- Added smart text chunking with configurable chunk size

#### Orchestrator Improvements
- Migrated to `chat.completions.create` API
- Added proper conversation history management
- Improved tool call error handling
- Added iteration tracking
- Enhanced audit logging for tool failures

#### Database
- Restored `vector(1536)` column for embeddings
- Added IVFFlat index for fast similarity search
- Marked embedding column as `Unsupported()` in Prisma schema

#### Testing
- Added comprehensive bash test script
- Tests document ingestion, search, chat, and tenant isolation
- Added seed data for second tenant to verify RLS

## Architecture

The agent is now fully functional with:
1. **Multi-tenant isolation** via PostgreSQL RLS
2. **Semantic search** via OpenAI embeddings + pgvector
3. **Tool calling** with authorization checks
4. **Audit logging** for compliance
5. **Document ingestion** with automatic embedding generation

