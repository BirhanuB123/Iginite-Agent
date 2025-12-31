# 📚 Knowledge Base Setup Guide

## Understanding "Technical Limitations"

When you see the chatbot respond with "technical limitation," it means:

**The knowledge base is empty!** 

The AI agent tried to search for information using the `search_knowledge` tool, but couldn't find any documents because none have been ingested yet.

## Why This Happens

The default seed script (`prisma/seed.ts`) only creates:
- ✅ Tenants
- ✅ Users  
- ✅ Teams
- ❌ **No knowledge base documents**

So when you ask questions like "How do I build a policy framework?", the agent has no information to retrieve.

## Solution: Add Sample Documents

### Quick Method (Recommended)

Run the knowledge base seeder script:

```bash
# Make sure your backend is running first
npm run dev

# In another terminal, run the seeder
node scripts/seed-knowledge.js
```

This will add 4 sample documents:
1. **Policy Framework Development Guide** - How to build policies
2. **Human Resources Policies** - Leave, performance, remote work
3. **Information Security Policies** - Access control, data handling, incidents
4. **Employee Onboarding Guide** - First 30 days checklist

### Manual Method

If you prefer to add documents manually via API:

```bash
# 1. Login to get your token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@acme.com",
    "password": "password123",
    "tenantId": "00000000-0000-0000-0000-000000000001"
  }'

# 2. Copy the accessToken from response

# 3. Ingest a document
curl -X POST http://localhost:3000/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "corpus": "internal",
    "title": "My Policy Guide",
    "content": "Your detailed policy content here...",
    "sourceUri": "https://example.com/policies"
  }'
```

## Testing the Knowledge Base

After adding documents, try these questions in the chat:

1. **"What are the onboarding steps?"**
   - Should return the employee onboarding guide

2. **"How do I build a policy framework?"**
   - Should return the policy framework development steps

3. **"What is our leave policy?"**
   - Should return HR policies about leave

4. **"Tell me about security policies"**
   - Should return information security guidelines

## Understanding Knowledge Base Architecture

### How It Works

1. **Document Ingestion**: 
   - Document is split into chunks (~500 characters)
   - Each chunk is converted to a vector embedding (OpenAI)
   - Stored in PostgreSQL with pgvector extension

2. **Semantic Search**:
   - User query is converted to vector embedding
   - Cosine similarity search finds relevant chunks
   - Top K results are returned with citations

3. **AI Response**:
   - Agent receives relevant chunks as context
   - Generates response based on retrieved information
   - Includes citations from source documents

### Corpus Types

Documents are organized by corpus:

- **`internal`** - Internal company policies and guides
- **`client_public`** - Public documentation for clients
- **`client_private`** - Private/confidential client docs

### Document Chunks

- Large documents are automatically chunked
- Chunk size: ~500 characters with overlap
- Each chunk gets its own vector embedding
- Similarity threshold ensures relevance

## Adding Your Own Documents

### From Files

Create a script to read and ingest your files:

```javascript
const fs = require('fs');

async function ingestFile(token, filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const title = filePath.split('/').pop();
  
  await fetch('http://localhost:3000/knowledge/ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-Id': '00000000-0000-0000-0000-000000000001',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      corpus: 'internal',
      title: title,
      content: content,
      sourceUri: `file://${filePath}`
    })
  });
}
```

### From Database

Pull existing documentation from your systems and ingest via API.

### From Web Scraping

Scrape your company wiki/intranet and ingest the content.

## Monitoring Knowledge Base

### Check Document Count

```sql
-- Connect to database
docker exec -it <container> psql -U adwa -d adwa_agent

-- Count documents
SELECT corpus, COUNT(*) FROM documents 
WHERE "tenantId" = '00000000-0000-0000-0000-000000000001'
GROUP BY corpus;

-- Count chunks
SELECT COUNT(*) FROM document_chunks 
WHERE "tenantId" = '00000000-0000-0000-0000-000000000001';
```

### Test Search Quality

Use the search endpoint directly:

```bash
curl -X POST http://localhost:3000/knowledge/search \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000001" \
  -d '{
    "query": "leave policy",
    "corpus": "internal",
    "topK": 5
  }'
```

## Troubleshooting

### "Technical limitation" still appears

1. **Verify documents were ingested:**
   ```bash
   node scripts/seed-knowledge.js
   ```

2. **Check database:**
   ```bash
   npx prisma studio
   # Navigate to documents and document_chunks tables
   ```

3. **Verify embeddings:**
   Make sure the `embedding` column is populated (not null)

### Empty search results

1. **Corpus mismatch:** Agent searches `internal` by default
2. **Query too specific:** Try broader questions
3. **No embeddings:** Run migration to add pgvector

### Agent doesn't use knowledge base

1. **Tool not registered:** Check `src/modules/tools/tools.module.ts`
2. **Policy blocked:** Check audit_events table for `TOOL_DENIED` events
3. **OpenAI API error:** Check backend logs for embedding errors

## Best Practices

### Document Quality

✅ **Good:**
- Clear, structured content
- Organized by topic
- 500-5000 words per document
- Include context and examples

❌ **Avoid:**
- Very short snippets (< 100 words)
- Unstructured data dumps
- Duplicate content
- Outdated information

### Corpus Organization

- Use `internal` for employee policies and guides
- Use `client_public` for documentation customers can access
- Use `client_private` for sensitive client-specific info

### Maintenance

- Review and update documents quarterly
- Remove outdated policies
- Monitor search quality and adjust content
- Analyze which topics get the most questions

## Next Steps

1. ✅ Run `node scripts/seed-knowledge.js`
2. ✅ Test chat at http://localhost:3001/chat
3. ✅ Add your own company documents
4. ✅ Monitor agent responses and improve content

---

**Need help?** Check the main [README.md](./README.md) for more information about Adwa-Agent.
