#!/bin/bash
# Validate that a container failure is genuine before executing remediation.
#
# Execution Context Awareness:
# - If running locally on App Node: executes local 'docker inspect'.
# - If running on Ops Node: queries App Node via check_nrpe.
# - If neither tool is directly accessible: relies on Nagios HARD failure signal and proceeds.
#
# Usage:
#   validate_failure.sh <container_name> [retries] [delay_seconds] [remote_app_host]
#
# Exit codes:
#   0 - Container is running (healthy)
#   1 - Container confirmed failing / not running

set -euo pipefail

CONTAINER="${1:-"fairsplit_backend"}"
RETRIES="${2:-2}"
DELAY="${3:-3}"
APP_HOST="${4:-"172.31.14.13"}"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# If APP_HOST is not passed or empty, attempt discovery from inventory file
if [ -z "$APP_HOST" ] && [ -f /opt/fairsplit/ansible/inventory/hosts.ini ]; then
  APP_HOST=$(grep -E '^[[:space:]]*(fairsplit-app|app-node)' /opt/fairsplit/ansible/inventory/hosts.ini 2>/dev/null | \
    sed -n 's/.*ansible_host=\([0-9.]*\).*/\1/p' | head -1 || true)
fi

echo "[$TIMESTAMP] Validating failure status for '$CONTAINER' (retries=$RETRIES, delay=${DELAY}s)"

# ─────────────────────────────────────────────────────────────────────────────
# Path A: Local Docker Execution (When running directly on App Node)
# ─────────────────────────────────────────────────────────────────────────────
if command -v docker &>/dev/null && docker ps &>/dev/null; then
  for i in $(seq 1 "$RETRIES"); do
    STATUS=$(docker inspect --format='{{.State.Running}}' "$CONTAINER" 2>/dev/null || echo "false")
    HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$CONTAINER" 2>/dev/null || echo "unknown")

    if [ "$STATUS" = "true" ] && [ "$HEALTH" != "unhealthy" ]; then
      echo "[$TIMESTAMP] OK: Container $CONTAINER is running and healthy locally (check $i/$RETRIES)"
      exit 0
    else
      echo "[$TIMESTAMP] FAIL: Container $CONTAINER status=$STATUS health=$HEALTH (check $i/$RETRIES)"
    fi

    if [ "$i" -lt "$RETRIES" ]; then
      sleep "$DELAY"
    fi
  done

  echo "[$TIMESTAMP] CONFIRMED FAILURE: $CONTAINER confirmed not running/healthy after $RETRIES checks"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────
# Path B: Remote NRPE Check from Ops Node
# ─────────────────────────────────────────────────────────────────────────────
case "$CONTAINER" in
  fairsplit_frontend|frontend) NRPE_CMD="check_docker_frontend" ;;
  fairsplit_backend|backend)   NRPE_CMD="check_docker_backend" ;;
  fairsplit_postgres|postgres) NRPE_CMD="check_docker_postgres" ;;
  *) NRPE_CMD="check_docker_${CONTAINER}" ;;
esac

NRPE_BIN="/usr/lib/nagios/plugins/check_nrpe"
if [ -n "$APP_HOST" ] && [ -x "$NRPE_BIN" ]; then
  for i in $(seq 1 "$RETRIES"); do
    set +e
    NRPE_OUT=$("$NRPE_BIN" -H "$APP_HOST" -c "$NRPE_CMD" 2>&1)
    NRPE_RC=$?
    set -e

    if [ "$NRPE_RC" -eq 0 ] && echo "$NRPE_OUT" | grep -q "OK:"; then
      echo "[$TIMESTAMP] OK: NRPE check reports $CONTAINER is healthy on $APP_HOST (check $i/$RETRIES)"
      exit 0
    else
      echo "[$TIMESTAMP] FAIL: NRPE check reports failure for $CONTAINER on $APP_HOST (RC=$NRPE_RC: $NRPE_OUT)"
    fi

    if [ "$i" -lt "$RETRIES" ]; then
      sleep "$DELAY"
    fi
  done

  echo "[$TIMESTAMP] CONFIRMED FAILURE: $CONTAINER failed NRPE checks on $APP_HOST"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────
# Path C: Fallback to Nagios Hard State Alert
# ─────────────────────────────────────────────────────────────────────────────
echo "[$TIMESTAMP] Local Docker and check_nrpe not directly executable in current context."
echo "[$TIMESTAMP] Proceeding with remediation based on Nagios HARD failure trigger."
exit 1
