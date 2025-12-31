# RAG System - Quick Reference Guide

## 🎯 What Changed?

Your RAG (Retrieval Augmented Generation) system now provides **significantly more accurate and relevant answers** through:

1. ✅ **Query Expansion** - Finds documents even with different wording
2. ✅ **LLM Reranking** - Top results are truly the most relevant
3. ✅ **Similarity Filtering** - Only returns quality matches (≥70% similarity)
4. ✅ **Better Chunking** - 800-char chunks with 200-char overlap
5. ✅ **Smart Snippets** - Shows the most relevant part of each document
6. ✅ **Search Metadata** - Transparency into search quality

---

## 🚀 Quick Start

### For Users (Web Interface)

Just ask questions naturally - the system now:
- Understands synonyms and variations
- Finds the most relevant documents
- Provides confidence scores
- Admits when it doesn't know

### For Developers (API)

**Endpoint:** `POST /knowledge/search`

**Basic Request:**
```json
{
  "query": "How do I reset my password?",
  "corpus": "client_public",
  "topK": 5
}
```

**Advanced Request (with options):**
```json
{
  "query": "How do I configure SSO?",
  "corpus": "internal",
  "topK": 5,
  "enableQueryExpansion": true,
  "rerank": true,
  "similarityThreshold": 0.75
}
```

**Response:**
```json
{
  "answerHints": "# Knowledge Base Search Results\n\n...",
  "citations": [
    {
      "documentId": "uuid",
      "title": "SSO Configuration Guide",
      "chunkId": "uuid",
      "snippet": "To configure SSO...",
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

---

## 📊 Understanding Similarity Scores

| Score | Badge | Meaning | Action |
|-------|-------|---------|--------|
| 0.90-1.00 | 🟢 | Excellent match | High confidence answer |
| 0.80-0.89 | 🟢 | Very relevant | Good confidence |
| 0.70-0.79 | 🟡 | Moderately relevant | Use with context |
| 0.60-0.69 | 🟠 | Low relevance | May need rephrasing |
| <0.60 | 🔴 | Not relevant | Filtered out by default |

---

## ⚙️ Configuration Options

### When to Enable Features:

| Feature | Enable When | Disable When |
|---------|-------------|--------------|
| **Query Expansion** | • Varied terminology<br>• Broad questions<br>• Exploring topics | • Exact term searches<br>• Very specific queries<br>• Speed critical |
| **Reranking** | • Mixed quality results<br>• Complex queries<br>• Best accuracy needed | • High similarity scores<br>• Speed critical<br>• Simple queries |

### Similarity Threshold Guidelines:

- **0.80+**: High-quality, well-curated corpus
- **0.70-0.79**: General use (default)
- **0.60-0.69**: Exploratory searches, broader results
- **<0.60**: Not recommended (too many false positives)

---

## 🧪 Testing

### Run Test Suite:

```bash
cd scripts
node test-rag-improvements.js
```

Or on Windows:
```cmd
cd scripts
test-rag-improvements.bat
```

### Manual Testing:

1. Ask the same question with different wording
2. Check similarity scores in results
3. Compare with/without query expansion
4. Verify citations are relevant

---

## 🐛 Troubleshooting

### Problem: No results found

**Possible causes:**
- Information not in knowledge base
- Similarity threshold too high
- Query too specific

**Solutions:**
- Rephrase query
- Lower similarity threshold to 0.65
- Add more documents to corpus

### Problem: Low similarity scores

**Possible causes:**
- Poor document quality
- Mismatch between query and content
- Wrong corpus selected

**Solutions:**
- Improve document content
- Use query expansion
- Check corpus selection
- Re-ingest with better chunking

### Problem: Slow searches

**Possible causes:**
- Query expansion (2-3x API calls)
- Reranking (additional API call)
- Large result set

**Solutions:**
- Disable query expansion
- Disable reranking
- Reduce topK to 3
- Cache common queries

---

## 📈 Monitoring

### Key Metrics:

```javascript
// Check search quality
if (result.searchMetadata.averageSimilarity >= 0.80) {
  console.log('✅ High quality results');
} else if (result.searchMetadata.averageSimilarity >= 0.70) {
  console.log('⚠️ Moderate quality - consider improving documents');
} else {
  console.log('❌ Low quality - review corpus or query');
}
```

### Health Checks:

1. **Average similarity** should be > 0.75
2. **Zero results rate** should be < 10%
3. **Query expansion hit rate** (expanded queries find better results)

---

## 🔧 Advanced Usage

### Custom Search Function:

```javascript
async function intelligentSearch(query, options = {}) {
  // Determine if query is specific or broad
  const isSpecific = query.length < 30 && !query.includes('?');
  
  const searchOptions = {
    corpus: options.corpus || 'client_public',
    topK: options.topK || 5,
    enableQueryExpansion: !isSpecific,  // Disable for specific queries
    rerank: true,  // Always rerank for best results
    similarityThreshold: isSpecific ? 0.80 : 0.70,  // Higher threshold for specific
  };
  
  const result = await fetch('/knowledge/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ query, ...searchOptions }),
  }).then(r => r.json());
  
  // Quality check
  if (result.citations.length === 0) {
    return { success: false, message: 'No relevant documents found' };
  }
  
  if (result.searchMetadata.averageSimilarity < 0.70) {
    return { 
      success: false, 
      message: 'Low quality results - try rephrasing your question',
      results: result 
    };
  }
  
  return { success: true, results: result };
}
```

---

## 📚 Best Practices

### For Document Ingestion:

1. **Clean your content** - Remove formatting artifacts, headers/footers
2. **Use descriptive titles** - Helps with source attribution
3. **Keep documents focused** - Better than mixing unrelated topics
4. **Include context** - Don't assume prior knowledge
5. **Update regularly** - Keep information current

### For Search Queries:

1. **Be specific** when you know what you want
2. **Be broad** when exploring topics
3. **Use natural language** - System handles variations
4. **Check similarity scores** - They indicate confidence
5. **Provide feedback** - Helps improve the system

### For Integration:

1. **Show similarity scores** to users (transparency)
2. **Suggest rephrasing** for low-quality results
3. **Cache common queries** for performance
4. **Monitor average similarity** for corpus health
5. **Log zero-result queries** to identify gaps

---

## 🎓 Examples

### Example 1: High-Quality Results

```javascript
// Query: "How do I reset my password?"
{
  "citations": [
    { "title": "Password Reset Guide", "similarity": 0.92 },  // 🟢 Excellent
    { "title": "Account Security FAQ", "similarity": 0.85 },  // 🟢 Very relevant
    { "title": "User Guide", "similarity": 0.78 }             // 🟡 Relevant
  ],
  "searchMetadata": {
    "averageSimilarity": 0.85,  // High quality!
    "queriesUsed": 3  // Query expansion helped
  }
}
```

**Action:** Provide confident answer with citations

### Example 2: Moderate Quality

```javascript
// Query: "What's the project deadline?"
{
  "citations": [
    { "title": "Project Overview", "similarity": 0.74 },  // 🟡 Moderate
    { "title": "Timeline Guide", "similarity": 0.71 }     // 🟡 Moderate
  ],
  "searchMetadata": {
    "averageSimilarity": 0.73  // Moderate quality
  }
}
```

**Action:** Provide answer but suggest confirming with team

### Example 3: Low Quality / No Results

```javascript
// Query: "What's the weather today?"
{
  "citations": [],
  "searchMetadata": {
    "resultsFound": 0  // No relevant documents
  }
}
```

**Action:** "I couldn't find information about that in the knowledge base. Try rephrasing, or I can create a request for help."

---

## 🔗 Related Documentation

- [Full RAG Improvements Guide](./RAG_IMPROVEMENTS.md) - Detailed technical documentation
- [API Documentation](./API.md) - Complete API reference
- [Knowledge Base Management](./KNOWLEDGE_BASE.md) - How to manage documents

---

## 💡 Tips & Tricks

1. **Start broad, then narrow:** Initial search with expansion, follow-up without
2. **Use metadata for debugging:** Check `queriesUsed` and `averageSimilarity`
3. **Monitor real queries:** Learn what users actually ask
4. **A/B test settings:** Compare expansion on/off for your use case
5. **Re-ingest important docs:** Use new chunking for better results

---

## 📞 Support

- **Low similarity scores?** Review document quality or add more content
- **No results?** Check if information exists in the selected corpus
- **Slow searches?** Adjust feature flags or implement caching
- **Questions?** Contact the development team

---

**Last Updated:** December 31, 2025  
**Version:** 2.0 (Enhanced RAG)
