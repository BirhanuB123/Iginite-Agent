# RAG System Improvements - Knowledge Base Enhancement

## Overview

The RAG (Retrieval Augmented Generation) system has been significantly enhanced to provide **more accurate, relevant, and contextual answers** to user queries. This document outlines the improvements made.

---

## Key Improvements

### 1. **Enhanced Chunking Strategy**

**Before:**
- Fixed 500-character chunks
- Simple sentence splitting
- No overlap between chunks
- Context loss at boundaries

**After:**
- Configurable 800-character chunks (default)
- 200-character overlap between chunks for context preservation
- Intelligent sentence boundary detection
- Handles common abbreviations (Dr., Inc., e.g., i.e.)
- Minimum chunk size filtering (50 chars)

**Impact:** Better semantic coherence in retrieved chunks, less context loss.

---

### 2. **Query Expansion**

**What it does:**
- Automatically generates 2 alternative phrasings of user queries
- Uses GPT-4o-mini to create semantic variations
- Searches with multiple query variations

**Example:**
```
Original Query: "How do I reset my password?"

Expanded Queries:
1. "How do I reset my password?"
2. "What is the process for changing my password?"
3. "Steps to recover account password"
```

**Impact:** Finds relevant documents even if they use different terminology.

---

### 3. **Similarity Threshold Filtering**

**Before:** Returned top K results regardless of relevance

**After:** 
- Default minimum similarity: 0.70 (70%)
- Configurable per-query
- Filters out low-quality matches

**Similarity Score Interpretation:**
- `0.90 - 1.00`: Highly relevant (excellent match)
- `0.80 - 0.89`: Very relevant (strong match)
- `0.70 - 0.79`: Moderately relevant (good match)
- `< 0.70`: Low relevance (filtered out by default)

**Impact:** Only returns genuinely relevant results, reduces noise.

---

### 4. **LLM-Based Reranking**

**What it does:**
- After initial vector search, uses GPT-4o-mini to rerank results
- Assesses semantic relevance to the original query
- Reorders chunks by true relevance, not just vector similarity

**Why it matters:**
- Vector similarity doesn't always equal semantic relevance
- LLM can understand context and nuance better
- Results are ordered by actual usefulness to answer the question

**Impact:** Top results are more likely to contain the actual answer.

---

### 5. **Intelligent Snippet Extraction**

**Before:** First 400 characters of each chunk

**After:**
- Finds query terms in the chunk
- Extracts context around matching terms
- Adds ellipsis for truncated text
- Falls back to beginning if no match found

**Impact:** Citations show the most relevant part of each document.

---

### 6. **Enhanced Context Assembly**

**Features:**
- Deduplication across query variations
- Length limits to avoid token overflow (8000 chars default)
- Structured formatting with source attribution
- Clear separation between chunks

**Format:**
```
[Source: Document Title]
Chunk content here...

---

[Source: Another Document]
More content...
```

**Impact:** LLM receives well-structured, relevant context for better answers.

---

### 7. **Improved Answer Hints**

**Before:** Simple concatenation of chunks

**After:** Structured format with:
- Query summary
- Number of results found
- Source list with similarity scores
- Organized context
- Instructions for the LLM on how to use the context

**Impact:** Better LLM comprehension and more accurate answers.

---

### 8. **Search Metadata**

Every search now returns metadata:
```json
{
  "answerHints": "...",
  "citations": [...],
  "searchMetadata": {
    "queriesUsed": 3,
    "similarityThreshold": 0.70,
    "resultsFound": 5,
    "averageSimilarity": 0.82,
    "reranked": true
  }
}
```

**Use cases:**
- Debugging search quality
- Understanding why certain results were returned
- Monitoring system performance
- Adjusting parameters based on results

---

## API Changes

### Updated Search Endpoint

**Endpoint:** `POST /knowledge/search`

**New Request Body:**
```json
{
  "query": "How do I configure SSO?",
  "corpus": "internal",
  "topK": 5,
  "similarityThreshold": 0.70,
  "enableQueryExpansion": true,
  "rerank": true
}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | *required* | The search query |
| `corpus` | string | *required* | `client_public`, `client_private`, or `internal` |
| `topK` | number | 5 | Number of results (1-50) |
| `similarityThreshold` | number | 0.70 | Minimum similarity (0-1) |
| `enableQueryExpansion` | boolean | true | Generate alternative queries |
| `rerank` | boolean | true | Use LLM-based reranking |

---

## Tool Enhancement

The `search_knowledge` tool used by the AI agent now includes:

- Better description for the LLM
- Support for all new parameters
- Enhanced default behavior (expansion + reranking enabled)

---

## System Prompt Updates

The AI agent's system instructions have been updated to:

1. **Always search before answering** factual questions
2. **Check similarity scores** and inform users about confidence
3. **Admit uncertainty** when results are low quality
4. **Cite sources properly** with document titles and similarity scores
5. **Synthesize information** from multiple sources coherently
6. **Handle low-quality results** by suggesting rephrasing

---

## Performance Considerations

### Trade-offs:

1. **Query Expansion:**
   - **Pro:** Better recall, finds more relevant documents
   - **Con:** 2-3x more OpenAI API calls per search
   - **Cost:** ~$0.0003 extra per search (negligible)

2. **Reranking:**
   - **Pro:** Better precision, top results more relevant
   - **Con:** Additional API call for ranking
   - **Cost:** ~$0.0001 per search (negligible)

3. **Larger Chunks with Overlap:**
   - **Pro:** Better context preservation
   - **Con:** More database storage (~30% increase)
   - **Note:** Better results justify the storage cost

### Recommendations:

- **Enable all features by default** (best accuracy)
- **Disable query expansion** for simple, specific queries (e.g., "What is the company address?")
- **Disable reranking** if speed is critical and similarity scores are consistently high
- **Adjust similarityThreshold** based on corpus quality:
  - Well-curated content: 0.75-0.80
  - Mixed quality: 0.70 (default)
  - Experimental: 0.65

---

## Testing the Improvements

### Test Script

```bash
# Add sample documents (if not already done)
cd scripts
./add-sample-knowledge.sh

# Or on Windows:
add-sample-knowledge.bat
```

### Test Queries

Try these queries to see the improvements:

1. **Synonym handling:**
   - "How do I reset my password?"
   - "How do I change my password?"
   - "Password recovery steps"
   
   *(Should find the same documents due to query expansion)*

2. **Relevance filtering:**
   - "What is the weather today?"
   
   *(Should return no results or very low similarity scores)*

3. **Context preservation:**
   - "What are the steps for onboarding?"
   
   *(Should get complete multi-step instructions from overlapping chunks)*

4. **Multi-document synthesis:**
   - "Tell me about company policies"
   
   *(Should synthesize information from multiple policy documents)*

---

## Monitoring & Optimization

### Key Metrics to Track:

1. **Average Similarity Score:** Should be > 0.75 for good corpus quality
2. **Zero Results Rate:** Should be < 10% of queries
3. **User Satisfaction:** Track follow-up questions (fewer = better answers)
4. **Query Expansion Hit Rate:** % of times expanded queries find better results

### Optimization Tips:

1. **If similarity scores are consistently low:**
   - Review document quality
   - Add more documents to corpus
   - Improve chunking boundaries

2. **If searches are slow:**
   - Disable reranking for non-critical queries
   - Reduce topK to 3
   - Cache common queries

3. **If users rephrase often:**
   - Query expansion is helping
   - Keep it enabled

4. **If storage is a concern:**
   - Reduce chunk overlap to 100 chars
   - Reduce chunk size to 600 chars
   - (Impact on quality: minimal)

---

## Future Enhancements

Potential further improvements:

1. **Hybrid Search:** Combine vector search with keyword/BM25 search
2. **Query Classification:** Route queries to specific corpuses automatically
3. **Conversation Context:** Use chat history to refine searches
4. **Document Summaries:** Pre-generate summaries for faster retrieval
5. **Custom Embeddings:** Fine-tune embeddings on your specific domain
6. **Feedback Loop:** Learn from user interactions to improve ranking
7. **Multi-modal RAG:** Support images, tables, and structured data
8. **Streaming Responses:** Stream search results as they're found

---

## Migration Guide

### For Existing Systems:

1. **No breaking changes** to existing API
2. **Existing documents** work as-is
3. **New documents** will use improved chunking
4. **Recommended:** Re-ingest important documents to benefit from new chunking

### Re-ingestion Script:

```bash
# Coming soon - will re-chunk existing documents with new strategy
npm run migrate:rechunk-documents
```

---

## Configuration

### Environment Variables:

```env
# Existing
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# New (optional)
RAG_CHUNK_SIZE=800
RAG_CHUNK_OVERLAP=200
RAG_MIN_SIMILARITY=0.70
RAG_DEFAULT_TOP_K=5
RAG_ENABLE_QUERY_EXPANSION=true
RAG_ENABLE_RERANKING=true
```

*(Not yet implemented - using constants in code for now)*

---

## Support

For questions or issues with the RAG system:

1. Check similarity scores in search results
2. Review search metadata for debugging
3. Test with different query phrasings
4. Adjust parameters based on use case
5. Contact the development team for optimization help

---

## Summary

The enhanced RAG system provides:

✅ **Better recall** through query expansion  
✅ **Better precision** through reranking  
✅ **Better context** through overlapping chunks  
✅ **Better filtering** through similarity thresholds  
✅ **Better transparency** through metadata and scores  
✅ **Better answers** for end users  

**Result:** More accurate, relevant, and helpful chatbot responses! 🚀
