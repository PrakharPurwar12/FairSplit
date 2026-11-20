#!/bin/bash
# Nagios Event Handler - Triggers Ansible remediation for FairSplit services
# Called by Nagios with: $SERVICESTATE$ $SERVICESTATETYPE$ $SERVICEATTEMPT$ "$SERVICEDESC$"
#
# Security & Privilege Confinement:
# 1. Invoked via scoped sudoers: nagios ALL=(ubuntu) NOPASSWD: /opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh
# 2. Rejects invalid argument counts (strictly requires 4 positional arguments).
# 3. Environment sanitization: enforces clean PATH and unsets dynamic loader variables.
# 4. Strict whitelist mapping: binds service descriptions to static, hardcoded container and service names.
# 5. Lock-file protection: prevents concurrent remediation race conditions.
# 6. Failure validation before dispatch: verifies failure is genuine before executing Ansible.
#
# Usage:
#   nagios_event_handler.sh <STATE> <STATE_TYPE> <ATTEMPT> <SERVICE_DESC>

set -euo pipefail

# ─────────────────────────────────────────────────
# 1. Environment Sanitization
# ─────────────────────────────────────────────────
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
unset LD_PRELOAD LD_LIBRARY_PATH

# ─────────────────────────────────────────────────
# 2. Strict Positional Argument Validation
# ─────────────────────────────────────────────────
if [ "$#" -ne 4 ]; then
  echo "ERROR: nagios_event_handler.sh requires exactly 4 arguments: <STATE> <STATE_TYPE> <ATTEMPT> <SERVICE_DESC>" >&2
  echo "Received $# arguments: $*" >&2
  exit 1
fi

STATE="$1"          # OK, WARNING, UNKNOWN, CRITICAL
STATE_TYPE="$2"     # SOFT, HARD
ATTEMPT="$3"        # 1, 2, 3, etc.
SERVICE_DESC="$4"   # Service description string from Nagios

LOGFILE="/opt/fairsplit/remediation.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
ANSIBLE_DIR="/opt/fairsplit/ansible"
LOCK_DIR="/tmp/fairsplit-remediation"
VALIDATE_SCRIPT="/opt/fairsplit/remediation/scripts/validate_failure.sh"
RECOVERY_LOG="/opt/fairsplit/remediation/scripts/recovery_log.sh"

mkdir -p "$(dirname "$LOGFILE")"

# ─────────────────────────────────────────────────
# 3. State Gate: Only Remediate on HARD Failures
# ─────────────────────────────────────────────────
if [ "$STATE_TYPE" != "HARD" ]; then
  echo "[$TIMESTAMP] SKIP: $SERVICE_DESC is $STATE (SOFT state, attempt $ATTEMPT)" >> "$LOGFILE"
  exit 0
fi

if [ "$STATE" = "OK" ] || [ "$STATE" = "RECOVERY" ]; then
  echo "[$TIMESTAMP] RECOVERY: $SERVICE_DESC recovered, no remediation needed" >> "$LOGFILE"
  if [ -x "$RECOVERY_LOG" ]; then
    "$RECOVERY_LOG" "recovery" "$SERVICE_DESC" "success" "auto-recovered" || true
  fi
  exit 0
fi

# ─────────────────────────────────────────────────
# 4. Strict Service-to-Container Whitelist Mapping
# ─────────────────────────────────────────────────
# Maps exact approved Nagios service identifiers to Docker Compose service name and container name.
# Rejects any unlisted string to prevent arbitrary service execution.
case "$SERVICE_DESC" in
  "Docker Container fairsplit_backend"|"FairSplit API Health"|"fairsplit_backend"|"backend")
    SERVICE="backend"
    CONTAINER="fairsplit_backend"
    ;;
  "Docker Container fairsplit_postgres"|"fairsplit_postgres"|"postgres")
    SERVICE="postgres"
    CONTAINER="fairsplit_postgres"
    ;;
  "Docker Container fairsplit_frontend"|"FairSplit Frontend"|"fairsplit_frontend"|"frontend")
    SERVICE="frontend"
    CONTAINER="fairsplit_frontend"
    ;;
  *)
    echo "[$TIMESTAMP] UNKNOWN: Service '$SERVICE_DESC' not in remediation whitelist" >> "$LOGFILE"
    exit 1
    ;;
esac

echo "[$TIMESTAMP] REMEDIATION TRIGGERED: $SERVICE_DESC -> service=$SERVICE container=$CONTAINER ($STATE HARD)" >> "$LOGFILE"

# ─────────────────────────────────────────────────
# 5. Lock-File Protection (Prevents Concurrent Runs)
# ─────────────────────────────────────────────────
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

# ─────────────────────────────────────────────────
# 6. Failure Validation Before Ansible Dispatch
# ─────────────────────────────────────────────────
if [ -x "$VALIDATE_SCRIPT" ]; then
  if "$VALIDATE_SCRIPT" "$CONTAINER" 3 5 >> "$LOGFILE" 2>&1; then
    echo "[$TIMESTAMP] VALIDATE: $CONTAINER is running/healthy - skipping remediation" >> "$LOGFILE"
    rm -f "$LOCK_FILE"
    exit 0
  fi
  echo "[$TIMESTAMP] VALIDATE: $CONTAINER confirmed failing - proceeding with remediation" >> "$LOGFILE"
fi

# ─────────────────────────────────────────────────
# 7. Structured Recovery Log
# ─────────────────────────────────────────────────
if [ -x "$RECOVERY_LOG" ]; then
  "$RECOVERY_LOG" "restart" "$CONTAINER" "triggered" "ansible-playbook dispatched for service=$SERVICE" || true
fi

# ─────────────────────────────────────────────────
# 8. Asynchronous Ansible Playbook Dispatch
# ─────────────────────────────────────────────────
ansible-playbook \
  -i /opt/fairsplit/ansible/inventory/hosts.ini \
  /opt/fairsplit/ansible/playbooks/remediate.yml \
  -e "service_name=$SERVICE" \
  >> "$LOGFILE" 2>&1 &

ANSIBLE_PID=$!
echo "[$TIMESTAMP] Ansible remediation dispatched for service=$SERVICE container=$CONTAINER (PID: $ANSIBLE_PID)" >> "$LOGFILE"

# Clean up lock file asynchronously after reasonable completion window
( sleep 300 && rm -f "$LOCK_FILE" ) >/dev/null 2>&1 &

exit 0
