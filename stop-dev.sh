#!/bin/bash

# DrinkBrewy Development Stop Script

echo "🛑 Stopping DrinkBrewy Development Servers..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop backend
if [ -f .dev-backend.pid ]; then
    BACKEND_PID=$(cat .dev-backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        kill $BACKEND_PID
        echo -e "${GREEN}✓ Backend server stopped (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${RED}Backend server not running${NC}"
    fi
    rm .dev-backend.pid
else
    echo -e "${RED}No backend PID file found${NC}"
fi

# Stop frontend
if [ -f .dev-frontend.pid ]; then
    FRONTEND_PID=$(cat .dev-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✓ Frontend server stopped (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${RED}Frontend server not running${NC}"
    fi
    rm .dev-frontend.pid
else
    echo -e "${RED}No frontend PID file found${NC}"
fi

echo ""
echo -e "${GREEN}Development servers stopped!${NC}"
