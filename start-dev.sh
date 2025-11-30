#!/bin/bash

# DrinkBrewy Development Startup Script
# This script starts both backend and frontend servers

echo "🍹 Starting DrinkBrewy Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}Checking MongoDB...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${RED}MongoDB is not running!${NC}"
    echo "Please start MongoDB first:"
    echo "  sudo systemctl start mongod"
    echo "Or if using Docker:"
    echo "  docker run -d -p 27017:27017 --name mongodb mongo:latest"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB is running${NC}"
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    echo ""
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    echo ""
fi

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}Backend .env file not found!${NC}"
    echo "Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
    echo -e "${RED}⚠️  Please edit backend/.env with your actual credentials${NC}"
    echo ""
fi

# Start backend server in background
echo -e "${BLUE}Starting Backend Server (Port 5000)...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend server started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait a moment for backend to start
sleep 3

# Start frontend server in background
echo -e "${BLUE}Starting Frontend Server (Port 3000)...${NC}"
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend server started (PID: $FRONTEND_PID)${NC}"
echo ""

# Save PIDs to file for easy stopping
echo $BACKEND_PID > .dev-backend.pid
echo $FRONTEND_PID > .dev-frontend.pid

echo "═══════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 DrinkBrewy Development Environment Started!${NC}"
echo "═══════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend:${NC}  http://localhost:3000"
echo -e "${BLUE}Admin:${NC}    http://localhost:3000/admin"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "To stop servers, run: ./stop-dev.sh"
echo "Or manually kill processes:"
echo "  Backend PID:  $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
