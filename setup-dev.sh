#!/bin/bash

# Development setup script for Ignite-Agent
echo "🔧 Setting up Ignite-Agent for development"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Copying from env.example..."
  cp env.example .env
  echo "✅ Created .env file. Please edit it and add your OPENAI_API_KEY"
  echo ""
fi

# Check if OpenAI API key is set
if ! grep -q "sk-" .env; then
  echo "⚠️  OPENAI_API_KEY not set in .env file"
  echo "Please add your OpenAI API key to the .env file and run this script again"
  exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
docker-compose up -d

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 5

echo ""
echo "🔄 Running database migrations..."
npx prisma migrate deploy
npx prisma generate

echo ""
echo "🌱 Seeding database with test data..."
npx ts-node prisma/seed.ts 2>/dev/null || echo "⚠️  Seed script not found or failed (this is optional)"

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm run dev"
echo ""
echo "To test the agent:"
echo "  chmod +x test-agent.sh"
echo "  ./test-agent.sh"
echo ""
echo "API will be available at: http://localhost:3000"

