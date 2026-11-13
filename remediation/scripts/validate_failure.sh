#!/bin/bash
# Validate that a container failure is genuine (not a transient blip)
# Usage: validate_failure.sh <container_name> [retries] [delay_seconds]
#
# Returns:
#   0 - Container is running (healthy)
#   1 - Container confirmed not running (genuine failure)

set -uo pipefail

CONTAINER=${1:-"fairsplit_backend"}
RETRIES=${2:-3}
DELAY=${3:-5}

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Verify docker is available
if ! command -v docker &>/dev/null; then
  echo "[$TIMESTAMP] ERROR: docker command not found" >&2
  exit 2
fi

echo "[$TIMESTAMP] Validating container '$CONTAINER' (retries=$RETRIES, delay=${DELAY}s)"

for i in $(seq 1 "$RETRIES"); do
  STATUS=$(docker inspect --format='{{.State.Running}}' "$CONTAINER" 2>/dev/null)
  EXIT_CODE=$?

  if [ $EXIT_CODE -ne 0 ]; then
    echo "[$TIMESTAMP] WARNING: Container '$CONTAINER' does not exist or cannot be inspected (check $i/$RETRIES)"
  elif [ "$STATUS" = "true" ]; then
    echo "[$TIMESTAMP] OK: $CONTAINER is running (check $i/$RETRIES)"
    exit 0
  else
    # Container exists but is not running - check exit code for more context
    EXIT_STATUS=$(docker inspect --format='{{.State.ExitCode}}' "$CONTAINER" 2>/dev/null || echo "unknown")
    RESTART_COUNT=$(docker inspect --format='{{.RestartCount}}' "$CONTAINER" 2>/dev/null || echo "unknown")
    echo "[$TIMESTAMP] FAIL: $CONTAINER is NOT running (check $i/$RETRIES, exit_code=$EXIT_STATUS, restarts=$RESTART_COUNT)"
  fi

  if [ "$i" -lt "$RETRIES" ]; then
    echo "[$TIMESTAMP] Waiting ${DELAY}s before retry..."
    sleep "$DELAY"
  fi
done

echo "[$TIMESTAMP] CONFIRMED FAILURE: $CONTAINER not running after $RETRIES checks"
exit 1
