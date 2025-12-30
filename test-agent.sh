#!/bin/bash

# Test script for Ignite-Agent
# This script tests the full agent functionality including document ingestion and chat

API_URL="http://localhost:3000"
TENANT_ID="00000000-0000-0000-0000-000000000001"
TENANT_ID_2="00000000-0000-0000-0000-000000000002"

echo "🚀 Testing Ignite-Agent"
echo "======================="
echo ""

# Test 1: Ingest a document
echo "📚 Test 1: Ingesting test document..."
INGEST_RESPONSE=$(curl -s -X POST ${API_URL}/knowledge/ingest \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -H "X-Roles: ADMIN" \
  -d '{
    "corpus": "internal",
    "title": "Employee Onboarding Guide",
    "content": "Welcome to the company! Our onboarding process consists of several important steps. First, you need to complete all required paperwork including tax forms and direct deposit information. Second, you will need to set up your workstation and accounts. This includes your email, Slack, and access to our internal systems. Third, schedule meetings with your team lead and key stakeholders. Fourth, review our company handbook and policies. The onboarding process typically takes 2-3 days to complete.",
    "sourceUri": "https://internal.example.com/onboarding"
  }')

echo "Response: $INGEST_RESPONSE"
echo ""

# Test 2: Search knowledge base directly
echo "🔍 Test 2: Searching knowledge base..."
SEARCH_RESPONSE=$(curl -s -X POST ${API_URL}/knowledge/search \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -d '{
    "query": "onboarding steps",
    "corpus": "internal",
    "topK": 3
  }')

echo "Response: $SEARCH_RESPONSE"
echo ""

# Test 3: Chat with agent about onboarding
echo "💬 Test 3: Chatting with agent about onboarding..."
CHAT_RESPONSE=$(curl -s -X POST ${API_URL}/agent/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -H "X-Roles: CLIENT" \
  -d '{
    "message": "What are the steps for employee onboarding?"
  }')

echo "Response: $CHAT_RESPONSE"
echo ""

# Test 4: Chat with agent to create a work item
echo "📝 Test 4: Creating work item through agent..."
CREATE_RESPONSE=$(curl -s -X POST ${API_URL}/agent/chat \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -H "X-Roles: CLIENT" \
  -d '{
    "message": "I need help setting up my laptop. Can you create a request for IT support?"
  }')

echo "Response: $CREATE_RESPONSE"
echo ""

# Test 5: Test tenant isolation - different tenant should not see first tenant's data
echo "🔒 Test 5: Testing tenant isolation..."
ISOLATION_RESPONSE=$(curl -s -X POST ${API_URL}/knowledge/search \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID_2}" \
  -d '{
    "query": "onboarding steps",
    "corpus": "internal",
    "topK": 3
  }')

echo "Response (should be empty): $ISOLATION_RESPONSE"
echo ""

echo "✅ Test suite completed!"
echo ""
echo "To test manually:"
echo "  curl -X POST ${API_URL}/agent/chat \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -H 'X-Tenant-Id: ${TENANT_ID}' \\"
echo "    -H 'X-Roles: CLIENT' \\"
echo "    -d '{\"message\": \"What is our onboarding process?\"}'"

