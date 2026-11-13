#!/bin/bash
# validate_infrastructure.sh - Validation script for FairSplit AWS infrastructure & Terraform
# Can be run in pre-apply mode (local Terraform syntax/plan checks) or live mode (post-apply network verification)
#
# Usage:
#   bash validate_infrastructure.sh [--live --ops-ip <IP> --app-ip <IP> --key <PEM_KEY>]

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
OPS_IP=""
APP_IP=""
SSH_KEY=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --live) LIVE_MODE=true; shift ;;
    --ops-ip) OPS_IP="$2"; shift 2 ;;
    --app-ip) APP_IP="$2"; shift 2 ;;
    --key) SSH_KEY="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TERRAFORM_DIR="${REPO_DIR}/terraform"

echo -e "\n${BLUE}============================================================${NC}"
echo -e "${BLUE}  FairSplit Infrastructure Validation                      ${NC}"
echo -e "${BLUE}============================================================${NC}\n"

# 1. Local Terraform checks
echo -e "${BLUE}--- 1. Terraform Static & Configuration Checks ---${NC}"

check "Terraform binary available" "command -v terraform"

if command -v terraform &>/dev/null; then
  check "Terraform configuration formatting" "terraform -chdir='${TERRAFORM_DIR}' fmt -check -recursive"
  check "Terraform provider initialization / validation" "terraform -chdir='${TERRAFORM_DIR}' validate"
fi

check "Terraform root main.tf exists" "test -f '${TERRAFORM_DIR}/main.tf'"
check "Terraform variables.tf exists" "test -f '${TERRAFORM_DIR}/variables.tf'"
check "Terraform outputs.tf exists" "test -f '${TERRAFORM_DIR}/outputs.tf'"
check "Terraform .gitignore excludes sensitive files" "grep -q '\.tfvars' '${TERRAFORM_DIR}/.gitignore'"

# 2. AWS CLI environment
echo -e "\n${BLUE}--- 2. AWS Environment & Credentials ---${NC}"
if command -v aws &>/dev/null; then
  check "AWS CLI installed" "command -v aws"
  check "AWS caller identity active" "aws sts get-caller-identity"
else
  echo -e "${WARN} AWS CLI not installed locally; skipping AWS identity checks."
fi

# 3. Live node network checks (if live mode requested)
if [ "$LIVE_MODE" = true ]; then
  echo -e "\n${BLUE}--- 3. Live Infrastructure & Port Reachability Checks ---${NC}"
  
  if [ -n "$OPS_IP" ]; then
    check "Ops Node SSH port 22 reachable" "nc -z -w 5 '${OPS_IP}' 22"
    check "Ops Node HTTP port 80 reachable (Nagios)" "nc -z -w 5 '${OPS_IP}' 80"
  else
    echo -e "${WARN} --ops-ip not specified, skipping Ops Node port checks."
  fi

  if [ -n "$APP_IP" ]; then
    check "App Node SSH port 22 reachable" "nc -z -w 5 '${APP_IP}' 22"
    check "App Node HTTP port 80 reachable (FairSplit)" "nc -z -w 5 '${APP_IP}' 80"
    
    # Verify confidential ports are NOT open publicly
    TOTAL=$((TOTAL + 1))
    echo -n -e "${INFO} Checking: App Node PostgreSQL port 5432 is blocked publicly... "
    if ! nc -z -w 3 "${APP_IP}" 5432 >/dev/null 2>&1; then
      echo -e "${PASS}"
      PASSED=$((PASSED + 1))
    else
      echo -e "${FAIL} (Security risk: port 5432 is publicly open!)"
      FAILED=$((FAILED + 1))
    fi

    TOTAL=$((TOTAL + 1))
    echo -n -e "${INFO} Checking: App Node Gunicorn port 8000 is blocked publicly... "
    if ! nc -z -w 3 "${APP_IP}" 8000 >/dev/null 2>&1; then
      echo -e "${PASS}"
      PASSED=$((PASSED + 1))
    else
      echo -e "${FAIL} (Security risk: port 8000 is publicly open!)"
      FAILED=$((FAILED + 1))
    fi
  else
    echo -e "${WARN} --app-ip not specified, skipping App Node port checks."
  fi
fi

echo -e "\n${BLUE}============================================================${NC}"
echo -e "Total Checks: ${TOTAL} | Passed: ${GREEN}${PASSED}${NC} | Failed: ${RED}${FAILED}${NC}"
echo -e "${BLUE}============================================================${NC}\n"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
exit 0
