#!/bin/bash

set -e

# Build the Docker image
docker build -t shemaps-frontend-builder .

# Run a container from the image and get the container ID
CONTAINER_ID=$(docker create shemaps-frontend-builder)

# Copy the APK file from the container to the host machine
docker cp $CONTAINER_ID:/app/android/app/build/outputs/apk/debug/app-debug.apk .

# Remove the container
docker rm $CONTAINER_ID

echo "APK file copied to: ./app-debug.apk"
