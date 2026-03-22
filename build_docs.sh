#!/bin/bash

# Script to create sinlge page artifacts and store in /docs folder

if [ ! -d "docs" ]; then
    echo "Error: subfolder 'docs' does not exist"
    exit 1
fi

podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm run build -- --outDir docs"
