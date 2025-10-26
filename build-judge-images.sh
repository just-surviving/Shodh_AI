#!/bin/bash

echo "Building Docker judge images..."

# Build Java judge image
docker build -f docker/java.Dockerfile -t shodh-judge-java:latest docker/
echo "✓ Java judge image built"

# Build Python judge image
docker build -f docker/python.Dockerfile -t shodh-judge-python:latest docker/
echo "✓ Python judge image built"

# Build C++ judge image
docker build -f docker/cpp.Dockerfile -t shodh-judge-cpp:latest docker/
echo "✓ C++ judge image built"

echo "All judge images built successfully!"
