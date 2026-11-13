#!/bin/bash
##############################################################################
# Nagios Plugin: check_fairsplit.sh
# Description : Check FairSplit API or frontend HTTP endpoints.
# Usage       : check_fairsplit.sh [host] [port] [endpoint] [timeout]
# Defaults    : host=localhost  port=8000  endpoint=/api/health/  timeout=10
# Exit codes  : 0=OK  1=WARNING  2=CRITICAL  3=UNKNOWN
##############################################################################

HOST=${1:-"localhost"}
PORT=${2:-"8000"}
ENDPOINT=${3:-"/api/health/"}
TIMEOUT=${4:-10}

# Validate curl availability
if ! command -v curl &>/dev/null; then
    echo "UNKNOWN: curl command not found in PATH"
    exit 3
fi

# Validate port is numeric
if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
    echo "UNKNOWN: Invalid port '${PORT}'"
    exit 3
fi

URL="http://${HOST}:${PORT}${ENDPOINT}"

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$URL" 2>/dev/null)
CURL_RC=$?

# curl exit code 28 = timeout, 7 = connection refused
if [ $CURL_RC -eq 28 ]; then
    echo "CRITICAL: FairSplit ${ENDPOINT} timed out after ${TIMEOUT}s | response_time=${TIMEOUT}s"
    exit 2
elif [ $CURL_RC -ne 0 ] || [ "$RESPONSE" = "000" ]; then
    echo "CRITICAL: FairSplit ${ENDPOINT} connection failed (curl_rc=${CURL_RC})"
    exit 2
fi

if [ "$RESPONSE" = "200" ]; then
    echo "OK: FairSplit ${ENDPOINT} returned HTTP 200 | response_code=$RESPONSE"
    exit 0
elif [[ "$RESPONSE" =~ ^[23] ]]; then
    # 2xx/3xx are acceptable for a frontend redirect
    echo "OK: FairSplit ${ENDPOINT} returned HTTP $RESPONSE | response_code=$RESPONSE"
    exit 0
elif [[ "$RESPONSE" =~ ^5 ]]; then
    echo "CRITICAL: FairSplit ${ENDPOINT} returned HTTP $RESPONSE (server error) | response_code=$RESPONSE"
    exit 2
else
    echo "WARNING: FairSplit ${ENDPOINT} returned HTTP $RESPONSE | response_code=$RESPONSE"
    exit 1
fi
