
const API_BASE = process.env.API_BASE || 'http://localhost:3000';

// Test queries with expected behaviors
const testQueries = [
  {
    name: 'Query Expansion Test',
    query: 'How do I reset my password?',
    corpus: 'client_public',
    expectedBehavior: 'Should find password-related documents even if they use terms like "change", "recover", or "update password"',
  },
  {
    name: 'Relevance Filtering Test',
    query: 'What is the weather today?',
    corpus: 'client_public',
    expectedBehavior: 'Should return no results or very low similarity scores (< 0.70) as this is likely not in the knowledge base',
  },
  {
    name: 'Multi-Step Context Test',
    query: 'What are the onboarding steps?',
    corpus: 'internal',
    expectedBehavior: 'Should return complete multi-step instructions with context preserved across chunks',
  },
  {
    name: 'Technical Query Test',
    query: 'How do I configure SSO?',
    corpus: 'internal',
    expectedBehavior: 'Should return technical documentation with high relevance',
  },
  {
    name: 'Policy Query Test',
    query: 'What is the company vacation policy?',
    corpus: 'client_private',
    expectedBehavior: 'Should synthesize information from policy documents',
  },
];

async function login() {
  console.log('🔐 Logging in...\n');
  
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@acmecorp.com',
      password: 'admin123',
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}

async function testSearch(token, testCase, options = {}) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📝 TEST: ${testCase.name}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Query: "${testCase.query}"`);
  console.log(`Corpus: ${testCase.corpus}`);
  console.log(`Expected: ${testCase.expectedBehavior}`);
  console.log(`\nOptions:`, JSON.stringify(options, null, 2));
  console.log(`\n${'─'.repeat(80)}\n`);

  const startTime = Date.now();

  try {
    const response = await fetch(`${API_BASE}/knowledge/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: testCase.query,
        corpus: testCase.corpus,
        topK: 5,
        ...options,
      }),
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (!response.ok) {
      console.error(`❌ Search failed: ${response.statusText}`);
      const errorData = await response.json().catch(() => ({}));
      console.error('Error details:', errorData);
      return null;
    }

    const result = await response.json();

    // Display results
    console.log(`✅ Search completed in ${duration}ms\n`);

    if (result.searchMetadata) {
      console.log(`📊 Metadata:`);
      console.log(`   - Queries used: ${result.searchMetadata.queriesUsed}`);
      console.log(`   - Results found: ${result.searchMetadata.resultsFound}`);
      console.log(`   - Avg similarity: ${result.searchMetadata.averageSimilarity?.toFixed(3) || 'N/A'}`);
      console.log(`   - Reranked: ${result.searchMetadata.reranked}`);
      console.log(`   - Similarity threshold: ${result.searchMetadata.similarityThreshold}`);
      console.log();
    }

    if (result.citations && result.citations.length > 0) {
      console.log(`📚 Citations (${result.citations.length}):`);
      result.citations.forEach((citation, idx) => {
        const similarityBadge = 
          citation.similarity >= 0.85 ? '🟢' :
          citation.similarity >= 0.75 ? '🟡' :
          citation.similarity >= 0.70 ? '🟠' : '🔴';
        
        console.log(`   ${idx + 1}. ${similarityBadge} ${citation.title}`);
        console.log(`      Similarity: ${citation.similarity.toFixed(3)}`);
        console.log(`      Snippet: ${citation.snippet.substring(0, 150)}...`);
        console.log();
      });
    } else {
      console.log(`❌ No citations found`);
    }

    // Quality assessment
    if (result.citations && result.citations.length > 0) {
      const avgSimilarity = result.citations.reduce((sum, c) => sum + c.similarity, 0) / result.citations.length;
      const highQuality = result.citations.filter(c => c.similarity >= 0.85).length;
      const mediumQuality = result.citations.filter(c => c.similarity >= 0.75 && c.similarity < 0.85).length;
      const lowQuality = result.citations.filter(c => c.similarity < 0.75).length;

      console.log(`📈 Quality Assessment:`);
      console.log(`   - Average similarity: ${avgSimilarity.toFixed(3)}`);
      console.log(`   - High quality (≥0.85): ${highQuality}`);
      console.log(`   - Medium quality (0.75-0.84): ${mediumQuality}`);
      console.log(`   - Low quality (<0.75): ${lowQuality}`);
      
      if (avgSimilarity >= 0.85) {
        console.log(`   - Overall: 🟢 Excellent`);
      } else if (avgSimilarity >= 0.75) {
        console.log(`   - Overall: 🟡 Good`);
      } else if (avgSimilarity >= 0.70) {
        console.log(`   - Overall: 🟠 Moderate`);
      } else {
        console.log(`   - Overall: 🔴 Poor`);
      }
    }

    return result;
  } catch (error) {
    console.error(`❌ Error during search:`, error.message);
    return null;
  }
}

async function compareSearchModes(token, testCase) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🔬 COMPARISON TEST: ${testCase.name}`);
  console.log(`${'═'.repeat(80)}\n`);

  // Test 1: All features enabled (default)
  console.log(`\n📍 Mode 1: All Features Enabled`);
  const result1 = await testSearch(token, testCase, {
    enableQueryExpansion: true,
    rerank: true,
    similarityThreshold: 0.70,
  });

  // Test 2: No query expansion
  console.log(`\n📍 Mode 2: No Query Expansion`);
  const result2 = await testSearch(token, testCase, {
    enableQueryExpansion: false,
    rerank: true,
    similarityThreshold: 0.70,
  });

  // Test 3: No reranking
  console.log(`\n📍 Mode 3: No Reranking`);
  const result3 = await testSearch(token, testCase, {
    enableQueryExpansion: true,
    rerank: false,
    similarityThreshold: 0.70,
  });

  // Test 4: Minimal features
  console.log(`\n📍 Mode 4: Minimal Features (Basic Search)`);
  const result4 = await testSearch(token, testCase, {
    enableQueryExpansion: false,
    rerank: false,
    similarityThreshold: 0.70,
  });

  // Compare results
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`📊 COMPARISON SUMMARY`);
  console.log(`${'─'.repeat(80)}\n`);

  const results = [
    { name: 'All Features', data: result1 },
    { name: 'No Expansion', data: result2 },
    { name: 'No Reranking', data: result3 },
    { name: 'Basic Search', data: result4 },
  ];

  results.forEach(({ name, data }) => {
    if (data && data.citations) {
      const avgSim = data.citations.length > 0
        ? (data.citations.reduce((sum, c) => sum + c.similarity, 0) / data.citations.length).toFixed(3)
        : 'N/A';
      console.log(`${name.padEnd(20)}: ${data.citations.length} results, avg similarity: ${avgSim}`);
    } else {
      console.log(`${name.padEnd(20)}: No results`);
    }
  });

  console.log(`\n💡 Recommendation:`);
  console.log(`   Use "All Features" mode for best accuracy and relevance.`);
  console.log(`   Disable features only if speed is critical and corpus quality is high.\n`);
}

async function main() {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🚀 RAG IMPROVEMENTS TEST SUITE`);
  console.log(`${'═'.repeat(80)}\n`);
  console.log(`Testing enhanced knowledge base search with:`);
  console.log(`  ✓ Query expansion`);
  console.log(`  ✓ LLM-based reranking`);
  console.log(`  ✓ Similarity threshold filtering`);
  console.log(`  ✓ Enhanced chunking with overlap`);
  console.log(`  ✓ Intelligent snippet extraction\n`);

  try {
    // Login
    const token = await login();
    console.log(`✅ Login successful\n`);

    // Run basic tests
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`PART 1: BASIC FUNCTIONALITY TESTS`);
    console.log(`${'═'.repeat(80)}`);

    for (const testCase of testQueries) {
      await testSearch(token, testCase, {
        enableQueryExpansion: true,
        rerank: true,
      });
      
      // Wait a bit between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Run comparison test on first query
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`PART 2: FEATURE COMPARISON TEST`);
    console.log(`${'═'.repeat(80)}`);

    await compareSearchModes(token, testQueries[0]);

    // Final summary
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`✅ TEST SUITE COMPLETED`);
    console.log(`${'═'.repeat(80)}\n`);
    console.log(`📋 Summary:`);
    console.log(`   - All ${testQueries.length} test queries executed`);
    console.log(`   - Feature comparison completed`);
    console.log(`   - Review the results above to assess RAG improvements\n`);
    console.log(`💡 Tips:`);
    console.log(`   - High similarity (≥0.85) = Excellent relevance`);
    console.log(`   - Medium similarity (0.75-0.84) = Good relevance`);
    console.log(`   - Low similarity (<0.75) = May need better documents or rephrasing`);
    console.log(`   - No results = Query not covered in knowledge base\n`);

  } catch (error) {
    console.error(`\n❌ Test suite failed:`, error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testSearch, compareSearchModes };
