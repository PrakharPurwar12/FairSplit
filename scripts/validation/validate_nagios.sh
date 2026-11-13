#!/bin/bash
# validate_nagios.sh - Validation script for Nagios Core configuration, objects, plugins, and remediation
#
# Usage:
#   bash validate_nagios.sh [--live --app-ip <APP_PRIVATE_IP>]

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
PASS="${GREEN}[PASS]${NC}"
FAIL="${RED}[FAIL]${NC}"
INFO="${BLUE}[INFO]${NC}"
WARN="${YELLOW}[WARN]${NC}"

TOTAL=0
PASSED=0
FAILED=0

check() {
  local desc="$1"
  local cmd="$2"
  TOTAL=$((TOTAL + 1))
  echo -n -e "${INFO} Checking: ${desc}... "
  if eval "$cmd" >/dev/null 2>&1; then
    echo -e "${PASS}"
    PASSED=$((PASSED + 1))
  else
    echo -e "${FAIL}"
    FAILED=$((FAILED + 1))
  fi
}

LIVE_MODE=false
APP_IP=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --live) LIVE_MODE=true; shift ;;
    --app-ip) APP_IP="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
NAGIOS_DIR="${REPO_DIR}/nagios"
REMEDIATION_DIR="${REPO_DIR}/remediation"

echo -e "\n${BLUE}============================================================${NC}"
echo -e "${BLUE}  FairSplit Nagios & Remediation Validation                ${NC}"
echo -e "${BLUE}============================================================${NC}\n"

# 1. Static Configuration Checks
echo -e "${BLUE}--- 1. Nagios Configuration & Object Definitions ---${NC}"

check "nagios.cfg exists" "test -s '${NAGIOS_DIR}/nagios.cfg'"
check "cgi.cfg exists" "test -s '${NAGIOS_DIR}/cgi.cfg'"
check "objects/hosts.cfg exists" "test -s '${NAGIOS_DIR}/objects/hosts.cfg'"
check "objects/services.cfg exists" "test -s '${NAGIOS_DIR}/objects/services.cfg'"
check "objects/commands.cfg exists" "test -s '${NAGIOS_DIR}/objects/commands.cfg'"

echo -e "\n${BLUE}--- 2. Custom Monitoring Plugins ---${NC}"
check "check_disk.sh plugin exists" "test -s '${NAGIOS_DIR}/plugins/check_disk.sh'"
check "check_docker_container.sh plugin exists" "test -s '${NAGIOS_DIR}/plugins/check_docker_container.sh'"
check "check_fairsplit.sh plugin exists" "test -s '${NAGIOS_DIR}/plugins/check_fairsplit.sh'"

echo -e "\n${BLUE}--- 3. Self-Healing & Remediation Components ---${NC}"
check "nagios_event_handler.sh exists" "test -s '${REMEDIATION_DIR}/event_handlers/nagios_event_handler.sh'"
check "recovery_log.sh exists" "test -s '${REMEDIATION_DIR}/scripts/recovery_log.sh'"
check "validate_failure.sh exists" "test -s '${REMEDIATION_DIR}/scripts/validate_failure.sh'"

# 2. Nagios Config Verification (if nagios binary available)
if command -v nagios4 &>/dev/null; then
  echo -e "\n${BLUE}--- 4. Nagios Configuration Syntax Validation ---${NC}"
  check "nagios4 config validation check (-v)" "nagios4 -v /etc/nagios4/nagios.cfg"
elif command -v nagios &>/dev/null; then
  echo -e "\n${BLUE}--- 4. Nagios Configuration Syntax Validation ---${NC}"
  check "nagios config validation check (-v)" "nagios -v /etc/nagios/nagios.cfg"
else
  echo -e "${WARN} Nagios binary not installed in local environment; skipping -v config verification."
fi

# 3. Live Checks (if requested)
if [ "$LIVE_MODE" = true ]; then
  echo -e "\n${BLUE}--- 5. Live Nagios Daemon & NRPE Connectivity ---${NC}"
  if systemctl is-active --quiet nagios4 2>/dev/null || systemctl is-active --quiet nagios 2>/dev/null; then
    check "Nagios service is active" "true"
  else
    check "Nagios service is active" "false"
  fi

  if [ -n "$APP_IP" ] && command -v check_nrpe &>/dev/null; then
    check "NRPE check to App Node (${APP_IP})" "check_nrpe -H '${APP_IP}'"
  fi
fi

echo -e "\n${BLUE}============================================================${NC}"
echo -e "Total Checks: ${TOTAL} | Passed: ${GREEN}${PASSED}${NC} | Failed: ${RED}${FAILED}${NC}"
echo -e "${BLUE}============================================================${NC}\n"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
exit 0

