#!/bin/bash
# Nagios Event Handler - Triggers Ansible remediation for FairSplit services
# Called by Nagios with: $SERVICESTATE$ $SERVICESTATETYPE$ $SERVICEATTEMPT$ $SERVICEDESC$
#
# Only trigger remediation for HARD failures (not SOFT)
# Avoid re-triggering on RECOVERY events
#
# Usage:
#   nagios_event_handler.sh <STATE> <STATE_TYPE> <ATTEMPT> <SERVICE_DESC>

set -uo pipefail

STATE=$1          # OK, WARNING, UNKNOWN, CRITICAL
STATE_TYPE=$2     # SOFT, HARD
ATTEMPT=$3        # attempt number
SERVICE_DESC=$4   # service description from Nagios

LOGFILE="/opt/fairsplit/remediation.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
ANSIBLE_DIR="/opt/fairsplit/ansible"  # symlink or copy of ansible playbooks
LOCK_DIR="/tmp/fairsplit-remediation"
VALIDATE_SCRIPT="/opt/fairsplit/remediation/scripts/validate_failure.sh"
RECOVERY_LOG="/opt/fairsplit/remediation/scripts/recovery_log.sh"

# Ensure log directory exists
mkdir -p "$(dirname "$LOGFILE")"

# Only act on HARD CRITICAL or HARD WARNING states
if [ "$STATE_TYPE" != "HARD" ]; then
  echo "[$TIMESTAMP] SKIP: $SERVICE_DESC is $STATE (SOFT state, attempt $ATTEMPT)" >> "$LOGFILE"
  exit 0
fi

if [ "$STATE" = "OK" ] || [ "$STATE" = "RECOVERY" ]; then
  echo "[$TIMESTAMP] RECOVERY: $SERVICE_DESC recovered, no remediation needed" >> "$LOGFILE"
  [ -x "$RECOVERY_LOG" ] && "$RECOVERY_LOG" "recovery" "$SERVICE_DESC" "success" "auto-recovered" || true
  exit 0
fi

# Map service description to container name
case "$SERVICE_DESC" in
  *"Backend"*|*"backend"*)
    CONTAINER="fairsplit_backend"
    ;;
  *"Postgres"*|*"postgres"*|*"Database"*)
    CONTAINER="fairsplit_postgres"
    ;;
  *"Frontend"*|*"frontend"*|*"Nginx"*)
    CONTAINER="fairsplit_frontend"
    ;;
  *)
    echo "[$TIMESTAMP] UNKNOWN: Cannot map '$SERVICE_DESC' to container" >> "$LOGFILE"
    exit 1
    ;;
esac

echo "[$TIMESTAMP] REMEDIATION TRIGGERED: $SERVICE_DESC -> $CONTAINER ($STATE HARD)" >> "$LOGFILE"

# Prevent duplicate remediation runs for the same container (simple lock)
LOCK_FILE="$LOCK_DIR/${CONTAINER}.lock"
mkdir -p "$LOCK_DIR"
if [ -f "$LOCK_FILE" ]; then
  LOCK_AGE=$(( $(date +%s) - $(date -r "$LOCK_FILE" +%s 2>/dev/null || echo 0) ))
  if [ "$LOCK_AGE" -lt 300 ]; then
    echo "[$TIMESTAMP] SKIP: Remediation already in progress for $CONTAINER (lock age: ${LOCK_AGE}s)" >> "$LOGFILE"
    exit 0
  fi
fi
touch "$LOCK_FILE"

# Validate that the failure is genuine before triggering Ansible
if [ -x "$VALIDATE_SCRIPT" ]; then
  if "$VALIDATE_SCRIPT" "$CONTAINER" 3 5 >> "$LOGFILE" 2>&1; then
    echo "[$TIMESTAMP] VALIDATE: $CONTAINER is actually running - skipping remediation" >> "$LOGFILE"
    rm -f "$LOCK_FILE"
    exit 0
  fi
  echo "[$TIMESTAMP] VALIDATE: $CONTAINER confirmed failing - proceeding with remediation" >> "$LOGFILE"
fi

# Log the remediation attempt
[ -x "$RECOVERY_LOG" ] && "$RECOVERY_LOG" "restart" "$CONTAINER" "triggered" "ansible-playbook dispatched" || true

# Trigger Ansible remediation playbook from the Ops Node
# The ansible inventory must have the app node configured
ansible-playbook \
  -i /opt/fairsplit/ansible/inventory/hosts.ini \
  /opt/fairsplit/ansible/playbooks/remediate.yml \
  -e "service_name=$CONTAINER" \
  >> "$LOGFILE" 2>&1 &

ANSIBLE_PID=$!
echo "[$TIMESTAMP] Ansible remediation dispatched for $CONTAINER (PID: $ANSIBLE_PID)" >> "$LOGFILE"

# Clean up lock after background process completes (async cleanup)
( sleep 300 && rm -f "$LOCK_FILE" ) &

exit 0
