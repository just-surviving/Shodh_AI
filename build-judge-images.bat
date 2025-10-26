@echo off
echo Building Docker judge images...
echo.

REM Build Java judge image
docker build -f docker/java.Dockerfile -t shodh-judge-java:latest docker/
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Java judge image
    exit /b 1
)
echo [32m✓ Java judge image built[0m
echo.

REM Build Python judge image
docker build -f docker/python.Dockerfile -t shodh-judge-python:latest docker/
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Python judge image
    exit /b 1
)
echo [32m✓ Python judge image built[0m
echo.

REM Build C++ judge image
docker build -f docker/cpp.Dockerfile -t shodh-judge-cpp:latest docker/
if %errorlevel% neq 0 (
    echo ERROR: Failed to build C++ judge image
    exit /b 1
)
echo [32m✓ C++ judge image built[0m
echo.

echo [32mAll judge images built successfully![0m
