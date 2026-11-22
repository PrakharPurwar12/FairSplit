#!/bin/bash
# Nagios Event Handler - Triggers Ansible remediation for FairSplit services
# Called by Nagios with: $SERVICESTATE$ $SERVICESTATETYPE$ $SERVICEATTEMPT$ "$SERVICEDESC$"
#
# Security & Privilege Confinement:
# 1. Invoked via scoped sudoers: nagios ALL=(ubuntu) NOPASSWD: /opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh
# 2. Strict positional argument validation (4 arguments).
# 3. Clean environment (strict PATH, unset loader variables).
# 4. Strict whitelist mapping (only frontend and backend allowed to restart).
# 5. Database safety: PostgreSQL automatic restarts are explicitly prohibited.
# 6. Lock-file protection: prevents concurrent remediation races.
# 7. Post-remediation verification and structured logging.

set -euo pipefail

# ─────────────────────────────────────────────────
# 1. Environment Sanitization
# ─────────────────────────────────────────────────
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
unset LD_PRELOAD LD_LIBRARY_PATH

# ─────────────────────────────────────────────────
# 2. Positional Argument Validation
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
RECOVERY_LOG="/opt/fairsplit/remediation/scripts/recovery_log.sh"

mkdir -p "$(dirname "$LOGFILE")"

# ─────────────────────────────────────────────────
# 3. State Gate: Only Remediate on HARD CRITICAL Failures
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

if [ "$STATE" != "CRITICAL" ]; then
  echo "[$TIMESTAMP] SKIP: $SERVICE_DESC is $STATE (only CRITICAL triggers remediation)" >> "$LOGFILE"
  exit 0
fi

# ─────────────────────────────────────────────────
# 4. Strict Service Whitelist & Database Protection
# ─────────────────────────────────────────────────
case "$SERVICE_DESC" in
  "Docker Container fairsplit_backend"|"FairSplit API Health"|"fairsplit_backend"|"backend")
    SERVICE="backend"
    CONTAINER="fairsplit_backend"
    ;;
  "Docker Container fairsplit_frontend"|"FairSplit Frontend"|"fairsplit_frontend"|"frontend")
    SERVICE="frontend"
    CONTAINER="fairsplit_frontend"
    ;;
  "Docker Container fairsplit_postgres"|"PostgreSQL Database"|"fairsplit_postgres"|"postgres")
    echo "[$TIMESTAMP] ALERT: Automatic remediation of PostgreSQL is prohibited to protect database integrity. Manual intervention required." >> "$LOGFILE"
    if [ -x "$RECOVERY_LOG" ]; then
      "$RECOVERY_LOG" "escalate" "fairsplit_postgres" "manual_intervention_required" "Automatic DB restart disallowed" || true
    fi
    exit 0
    ;;
  *)
    echo "[$TIMESTAMP] UNKNOWN: Service '$SERVICE_DESC' not in remediation whitelist" >> "$LOGFILE"
    exit 1
    ;;
esac

echo "[$TIMESTAMP] REMEDIATION TRIGGERED: $SERVICE_DESC -> service=$SERVICE container=$CONTAINER ($STATE $STATE_TYPE attempt $ATTEMPT)" >> "$LOGFILE"

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
# 6. Structured Recovery Log
# ─────────────────────────────────────────────────
if [ -x "$RECOVERY_LOG" ]; then
  "$RECOVERY_LOG" "restart" "$CONTAINER" "triggered" "ansible-playbook dispatched for service=$SERVICE" || true
fi

# ─────────────────────────────────────────────────
# 7. Execute Ansible Remediation Playbook
# ─────────────────────────────────────────────────
echo "[$TIMESTAMP] Executing ansible remediation for service=$SERVICE container=$CONTAINER..." >> "$LOGFILE"

set +e
ansible-playbook \
  -i /opt/fairsplit/ansible/inventory/hosts.ini \
  /opt/fairsplit/ansible/playbooks/remediate.yml \
  -e "service_name=$SERVICE" \
  >> "$LOGFILE" 2>&1
ANSIBLE_RC=$?
set -e

END_TS=$(date '+%Y-%m-%d %H:%M:%S')
if [ $ANSIBLE_RC -eq 0 ]; then
  echo "[$END_TS] REMEDIATION SUCCESS: Ansible completed remediation for $CONTAINER (RC=0)" >> "$LOGFILE"
  if [ -x "$RECOVERY_LOG" ]; then
    "$RECOVERY_LOG" "restart" "$CONTAINER" "success" "Service restored and verified" || true
  fi
else
  echo "[$END_TS] REMEDIATION FAILED: Ansible playbook failed for $CONTAINER (RC=$ANSIBLE_RC)" >> "$LOGFILE"
  if [ -x "$RECOVERY_LOG" ]; then
    "$RECOVERY_LOG" "escalate" "$CONTAINER" "failure" "Ansible failed with RC=$ANSIBLE_RC" || true
  fi
fi

# Clean up lock file
rm -f "$LOCK_FILE"

exit $ANSIBLE_RC
