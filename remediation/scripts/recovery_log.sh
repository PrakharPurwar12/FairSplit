#!/bin/bash
# Log recovery event with structured format for FairSplit remediation system
# Usage: recovery_log.sh <action> <service> <status> [details]
#
# action  : start | stop | restart | escalate | recovery
# service : container/service name (e.g. fairsplit_backend)
# status  : success | failure | triggered | pending
# details : (optional) free-form additional context

set -uo pipefail

ACTION=${1:-"unknown"}
SERVICE=${2:-"unknown"}
STATUS=${3:-"unknown"}
DETAILS=${4:-""}

LOGFILE="/opt/fairsplit/remediation.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
HOSTNAME=$(hostname -f 2>/dev/null || hostname)
CALLER_PID=$$

# Ensure log directory exists
mkdir -p "$(dirname "$LOGFILE")"

# Build structured log line
LOG_ENTRY="[$TIMESTAMP] [RECOVERY] action=$ACTION service=$SERVICE status=$STATUS host=$HOSTNAME pid=$CALLER_PID"
if [ -n "$DETAILS" ]; then
  LOG_ENTRY="$LOG_ENTRY details=\"$DETAILS\""
fi

echo "$LOG_ENTRY" >> "$LOGFILE"

# Also log to systemd journal for integration with log aggregators
if command -v logger &>/dev/null; then
  logger -t fairsplit-remediation "action=$ACTION service=$SERVICE status=$STATUS"
fi

# Emit to stdout so callers can capture it if needed
echo "$LOG_ENTRY"

# If status is 'failure' or 'escalate', also write to a separate escalation log
if [ "$STATUS" = "failure" ] || [ "$ACTION" = "escalate" ]; then
  ESCALATION_LOG="/opt/fairsplit/escalation.log"
  echo "$LOG_ENTRY" >> "$ESCALATION_LOG"
fi

exit 0
