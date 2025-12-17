#!/bin/bash

echo "🚀 Starting Online Judge Backend with Real Judge0..."

# Check if Judge0 is running
echo "🔍 Checking Judge0 connectivity..."
curl -s http://localhost:2358/languages > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Judge0 is not running on localhost:2358"
    echo "   Make sure your VirtualBox VM with Judge0 is running"
    echo "   and port 2358 is forwarded correctly"
    exit 1
fi
echo "✅ Judge0 is running and accessible"

# Start Docker containers
echo "🐳 Starting PostgreSQL and Redis..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:push

# Test Judge0 integration
echo "🧪 Testing Judge0 integration..."
node test-judge0-real.js

# Start the application
echo "⚡ Starting NestJS application..."
echo "🌐 API will be available at: http://localhost:3000/api"
npm run start:dev
