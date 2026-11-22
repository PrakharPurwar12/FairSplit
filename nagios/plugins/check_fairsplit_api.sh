#!/bin/bash
# Check FairSplit Django API health endpoint
# Returns OK if HTTP 200, status == "healthy", database == "connected"
set -uo pipefail

HOST="${1:-"172.31.14.13"}"
PORT="${2:-"80"}"
ENDPOINT="${3:-"/api/health/"}"
TIMEOUT="${4:-10}"

URL="http://${HOST}:${PORT}${ENDPOINT}"

RESPONSE=$(curl -s -m "$TIMEOUT" "$URL" 2>/dev/null || true)
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m "$TIMEOUT" "$URL" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" != "200" ]; then
    echo "CRITICAL: FairSplit API returned HTTP ${HTTP_CODE} at ${URL} | status=0 database=0"
    exit 2
fi

STATUS=$(echo "$RESPONSE" | grep -o '"status"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4 || echo "unknown")
DATABASE=$(echo "$RESPONSE" | grep -o '"database"[[:space:]]*:[[:space:]]*"[^"]*"' | cut -d'"' -f4 || echo "unknown")

if [ "$STATUS" = "healthy" ] && [ "$DATABASE" = "connected" ]; then
    echo "OK: FairSplit API is healthy and database is connected | status=1 database=1"
    exit 0
elif [ "$STATUS" = "healthy" ]; then
    echo "CRITICAL: FairSplit API is healthy but database is '${DATABASE}' | status=1 database=0"
    exit 2
else
    echo "CRITICAL: FairSplit API status is '${STATUS}', database is '${DATABASE}' | status=0 database=0"
    exit 2
fi
