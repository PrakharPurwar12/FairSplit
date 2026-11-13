#!/bin/bash
##############################################################################
# Nagios Plugin: check_docker_container.sh
# Description : Check if a Docker container is running and healthy.
# Usage       : check_docker_container.sh <container_name>
# Exit codes  : 0=OK  1=WARNING  2=CRITICAL  3=UNKNOWN
##############################################################################

CONTAINER=${1:-""}

if [ -z "$CONTAINER" ]; then
    echo "UNKNOWN: No container name specified"
    exit 3
fi

# Verify docker is available
if ! command -v docker &>/dev/null; then
    echo "UNKNOWN: docker command not found in PATH"
    exit 3
fi

# Capture both status and health in a single inspect call to avoid TOCTOU
INSPECT_OUT=$(docker inspect --format='{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' "$CONTAINER" 2>/dev/null)
INSPECT_RC=$?

if [ $INSPECT_RC -ne 0 ] || [ -z "$INSPECT_OUT" ]; then
    echo "CRITICAL: Container '$CONTAINER' not found or docker inspect failed"
    exit 2
fi

STATUS=$(echo "$INSPECT_OUT" | awk '{print $1}')
HEALTH=$(echo "$INSPECT_OUT" | awk '{print $2}')

if [ "$STATUS" != "running" ]; then
    echo "CRITICAL: Container $CONTAINER is not running (status: ${STATUS:-not_found})"
    exit 2
fi

if [ "$HEALTH" = "unhealthy" ]; then
    echo "CRITICAL: Container $CONTAINER is running but unhealthy"
    exit 2
elif [ "$HEALTH" = "starting" ]; then
    echo "WARNING: Container $CONTAINER health check is starting"
    exit 1
else
    echo "OK: Container $CONTAINER is running ($HEALTH) | container_running=1"
    exit 0
fi
