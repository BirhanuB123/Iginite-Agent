#!/bin/bash

echo "🚀 Starting Ignite-Agent Backend"
echo "================================"
echo ""

# Kill any processes on port 3000
echo "🧹 Cleaning up port 3000..."
netstat -ano | grep ':3000' | awk '{print $5}' | sort -u | while read pid; do
  if [ ! -z "$pid" ]; then
    taskkill //PID $pid //F 2>/dev/null || true
  fi
done

sleep 2

# Check if database is running
echo "🗄️  Checking database..."
docker ps | grep postgres > /dev/null
if [ $? -ne 0 ]; then
  echo "Starting database..."
  docker-compose up -d
  sleep 3
fi

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Seed database
echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️  Seed failed or already seeded"

echo ""
echo "✅ Backend is ready to start!"
echo ""
echo "Starting server..."
npm run dev



