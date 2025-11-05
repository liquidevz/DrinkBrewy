#!/bin/bash

# DrinkBrewy Docker Setup Script

echo "🍺 DrinkBrewy Docker Setup"
echo "=========================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Copying from .env.example..."
    cp .env.example .env.local
    echo "✅ Please update .env.local with your actual credentials before running the containers."
    echo ""
fi

# Function to show usage
show_usage() {
    echo "Usage: ./docker-setup.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev        Start development environment with hot reload"
    echo "  prod       Start production environment"
    echo "  build      Build production Docker image"
    echo "  stop       Stop all containers"
    echo "  clean      Remove containers and images"
    echo "  logs       Show container logs"
    echo ""
}

# Handle commands
case "$1" in
    "dev")
        echo "🚀 Starting development environment..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    "prod")
        echo "🚀 Starting production environment..."
        docker-compose up --build -d
        echo "✅ DrinkBrewy is running at http://localhost:3000"
        ;;
    "build")
        echo "🔨 Building production image..."
        docker-compose build
        ;;
    "stop")
        echo "🛑 Stopping containers..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        ;;
    "clean")
        echo "🧹 Cleaning up containers and images..."
        docker-compose down --rmi all --volumes
        docker-compose -f docker-compose.dev.yml down --rmi all --volumes
        ;;
    "logs")
        echo "📋 Showing logs..."
        docker-compose logs -f
        ;;
    *)
        show_usage
        ;;
esac