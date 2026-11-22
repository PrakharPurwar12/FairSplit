#!/bin/bash
# Check PostgreSQL status via the FairSplit real health endpoint
set -uo pipefail

HOST="${1:-"172.31.14.13"}"
PORT="${2:-"80"}"
ENDPOINT="${3:-"/api/health/"}"
TIMEOUT="${4:-10}"

URL="http://${HOST}:${PORT}${ENDPOINT}"

RESPONSE=$(curl -s -m "$TIMEOUT" "$URL" 2>/dev/null || true)
DATABASE=$(echo "$RESPONSE" | grep -o '"database"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4 || echo "disconnected")

if [ "$DATABASE" = "connected" ]; then
    echo "OK: PostgreSQL database is connected via API health check | db_connected=1"
    exit 0
else
    echo "CRITICAL: PostgreSQL database is disconnected (status: '${DATABASE}') | db_connected=0"
    exit 2
fi
