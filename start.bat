@echo off
echo.
echo ========================================
echo   🚀 Starting Shodh-a-Code Platform
echo ========================================
echo.

REM Build judge images first
echo 📦 Building judge Docker images...
call build-judge-images.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to build judge images
    pause
    exit /b 1
)

echo.
echo 🐳 Starting services with Docker Compose...
docker-compose up --build -d
if %errorlevel% neq 0 (
    echo ERROR: Failed to start services
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   ✅ Platform is ready!
echo ========================================
echo.
echo 📍 Access the application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8080/api
echo    PostgreSQL: localhost:5432
echo    Redis: localhost:6379
echo.
echo 🎯 Pre-seeded Contest ID: spring-code-sprint-2025
echo.
echo 📊 View logs:
echo    docker-compose logs -f backend
echo    docker-compose logs -f frontend
echo.
echo 🛑 Stop services:
echo    docker-compose down
echo.
echo ========================================
pause
