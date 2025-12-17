#!/bin/bash

echo "🚀 Starting Online Judge Backend on Linux..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker service."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start all Docker containers
echo "🐳 Starting PostgreSQL, Redis, and Judge0..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres -d online_judge > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready"
        break
    fi
    echo "   Attempt $i/30 - waiting..."
    sleep 2
done

# Wait for Judge0 to be ready
echo "⏳ Waiting for Judge0 to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:2358/languages > /dev/null 2>&1; then
        echo "✅ Judge0 is ready"
        break
    fi
    echo "   Attempt $i/30 - waiting..."
    sleep 3
done

# Run database migrations
echo "🗄️ Running database migrations..."
npm run db:push

# Test Judge0 integration
echo "🧪 Testing Judge0 integration..."
node test-judge0-real.js

# Start the application
echo "⚡ Starting NestJS application..."
echo "🌐 API will be available at: http://localhost:3000/api"
echo ""
echo "📊 Service URLs:"
echo "   - API: http://localhost:3000/api"
echo "   - Judge0: http://localhost:2358"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo ""
npm run start:dev
