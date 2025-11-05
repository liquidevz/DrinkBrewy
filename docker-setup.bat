@echo off
setlocal

echo 🍺 DrinkBrewy Docker Setup
echo ==========================

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  .env.local not found. Copying from .env.example...
    copy .env.example .env.local
    echo ✅ Please update .env.local with your actual credentials before running the containers.
    echo.
)

REM Handle commands
if "%1"=="dev" goto dev
if "%1"=="prod" goto prod
if "%1"=="build" goto build
if "%1"=="stop" goto stop
if "%1"=="clean" goto clean
if "%1"=="logs" goto logs
goto usage

:dev
echo 🚀 Starting development environment...
docker-compose -f docker-compose.dev.yml up --build
goto end

:prod
echo 🚀 Starting production environment...
docker-compose up --build -d
echo ✅ DrinkBrewy is running at http://localhost:3000
goto end

:build
echo 🔨 Building production image...
docker-compose build
goto end

:stop
echo 🛑 Stopping containers...
docker-compose down
docker-compose -f docker-compose.dev.yml down
goto end

:clean
echo 🧹 Cleaning up containers and images...
docker-compose down --rmi all --volumes
docker-compose -f docker-compose.dev.yml down --rmi all --volumes
goto end

:logs
echo 📋 Showing logs...
docker-compose logs -f
goto end

:usage
echo Usage: docker-setup.bat [COMMAND]
echo.
echo Commands:
echo   dev        Start development environment with hot reload
echo   prod       Start production environment
echo   build      Build production Docker image
echo   stop       Stop all containers
echo   clean      Remove containers and images
echo   logs       Show container logs
echo.

:end