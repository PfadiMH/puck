#!/bin/bash
# preview-init.sh
# Initialization script for preview deployments
# Waits for MongoDB and MinIO to be ready, creates resources, then starts Puck

set -e

echo "=== Preview Environment Initialization ==="

# Wait for MongoDB to be ready
echo "Waiting for MongoDB..."
MAX_RETRIES=30
RETRY_COUNT=0
until mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "ERROR: MongoDB failed to start after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "  Waiting for MongoDB... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done
echo "MongoDB is ready!"

# Create the database and initial collection (only on first run)
echo "Setting up database..."
mongosh --quiet <<EOF
use puck-preview
if (db.init.countDocuments({}) === 0) {
    db.init.insertOne({ initialized: true, timestamp: new Date() })
    print('Database puck-preview initialized')
} else {
    print('Database puck-preview already initialized')
}
EOF

# Wait for MinIO to be ready
echo "Waiting for MinIO..."
RETRY_COUNT=0
until curl -sf http://localhost:9000/minio/health/live > /dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "ERROR: MinIO failed to start after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "  Waiting for MinIO... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done
echo "MinIO is ready!"

# Configure MinIO client (use environment variables with defaults)
echo "Configuring MinIO..."
MINIO_USER="${MINIO_ROOT_USER:-minioadmin}"
MINIO_PASS="${MINIO_ROOT_PASSWORD:-minioadmin}"
mc alias set local http://localhost:9000 "$MINIO_USER" "$MINIO_PASS" --quiet

# Create the bucket if it doesn't exist
if ! mc ls local/puck-preview > /dev/null 2>&1; then
    echo "Creating bucket 'puck-preview'..."
    mc mb local/puck-preview --quiet
    mc anonymous set download local/puck-preview --quiet
    echo "Bucket created successfully!"
else
    echo "Bucket 'puck-preview' already exists"
fi

echo "=== Initialization Complete ==="
echo "Starting Puck application..."
echo "Services:"
echo "  - MongoDB: localhost:27017"
echo "  - MinIO: localhost:9000 (API) / localhost:9001 (Console)"
echo "  - Puck: localhost:3000"

# Start Puck (this replaces the script process)
cd /app
exec /root/.bun/bin/bun run start
