#!/bin/bash

# Test script for login endpoint
API_URL="http://localhost:3000"

echo "🔐 Testing Login Endpoint"
echo "========================="
echo ""

# Test 1: Login endpoint should work without X-Tenant-Id header
echo "📝 Test 1: Login with email/password/tenantId in body..."
LOGIN_RESPONSE=$(curl -s -X POST ${API_URL}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@acme.com",
    "password": "password123",
    "tenantId": "00000000-0000-0000-0000-000000000001"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Check if we got a token
if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
  echo "✅ Login successful!"
  
  # Extract token (basic extraction, works for simple JSON)
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
  echo "Token: ${TOKEN:0:50}..."
else
  echo "❌ Login failed!"
  echo "Expected response with 'accessToken' field"
fi

echo ""

# Test 2: Health endpoint should also work without tenant
echo "🏥 Test 2: Health check (should work without tenant)..."
HEALTH_RESPONSE=$(curl -s ${API_URL}/health)
echo "Response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
  echo "✅ Health check successful!"
else
  echo "❌ Health check failed!"
fi

echo ""
echo "✅ Test complete!"

