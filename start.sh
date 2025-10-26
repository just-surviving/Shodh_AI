#!/bin/bash

echo "🚀 Starting Shodh-a-Code Platform..."
echo ""

# Build judge images first
echo "📦 Building judge Docker images..."
./build-judge-images.sh

echo ""
echo "🐳 Starting services with Docker Compose..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 15

echo ""
echo "✅ Platform is ready!"
echo ""
echo "📍 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080/api"
echo "   PostgreSQL: localhost:5432"
echo "   Redis: localhost:6379"
echo ""
echo "🎯 Pre-seeded Contest ID: spring-code-sprint-2025"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f backend"
echo "   docker-compose logs -f frontend"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
