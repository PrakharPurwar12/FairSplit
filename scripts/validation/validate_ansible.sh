#!/bin/bash
# validate_ansible.sh - Validation script for Ansible playbooks, roles, and inventory
#
# Usage:
#   bash validate_ansible.sh [--live]

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
while [[ $# -gt 0 ]]; do
  case $1 in
    --live) LIVE_MODE=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ANSIBLE_DIR="${REPO_DIR}/ansible"

echo -e "\n${BLUE}============================================================${NC}"
echo -e "${BLUE}  FairSplit Ansible Validation                             ${NC}"
echo -e "${BLUE}============================================================${NC}\n"

# 1. Static Configuration Checks
echo -e "${BLUE}--- 1. Ansible Static Files & Directory Structure ---${NC}"

check "ansible.cfg exists" "test -s '${ANSIBLE_DIR}/ansible.cfg'"
check "group_vars/all.yml exists" "test -s '${ANSIBLE_DIR}/group_vars/all.yml'"
check "group_vars/app.yml exists" "test -s '${ANSIBLE_DIR}/group_vars/app.yml'"
check "inventory/hosts.ini exists" "test -s '${ANSIBLE_DIR}/inventory/hosts.ini'"

check "Playbook deploy.yml exists" "test -s '${ANSIBLE_DIR}/playbooks/deploy.yml'"
check "Playbook remediate.yml exists" "test -s '${ANSIBLE_DIR}/playbooks/remediate.yml'"
check "Playbook backup.yml exists" "test -s '${ANSIBLE_DIR}/playbooks/backup.yml'"
check "Playbook restore.yml exists" "test -s '${ANSIBLE_DIR}/playbooks/restore.yml'"
check "Playbook rollback.yml exists" "test -s '${ANSIBLE_DIR}/playbooks/rollback.yml'"

check "Role 'deploy' tasks exist" "test -s '${ANSIBLE_DIR}/roles/deploy/tasks/main.yml'"
check "Role 'remediation' tasks exist" "test -s '${ANSIBLE_DIR}/roles/remediation/tasks/main.yml'"
check "Role 'backup' tasks exist" "test -s '${ANSIBLE_DIR}/roles/backup/tasks/main.yml'"
check "Role 'restore' tasks exist" "test -s '${ANSIBLE_DIR}/roles/restore/tasks/main.yml'"

# 2. Syntax Validation (if ansible-playbook CLI available)
if command -v ansible-playbook &>/dev/null; then
  echo -e "\n${BLUE}--- 2. Ansible Playbook Syntax Checks ---${NC}"
  for pb in deploy remediate backup restore rollback; do
    check "Syntax check: ${pb}.yml" "ansible-playbook --syntax-check -i '${ANSIBLE_DIR}/inventory/hosts.ini' '${ANSIBLE_DIR}/playbooks/${pb}.yml'"
  done
else
  echo -e "${WARN} ansible-playbook not installed in current environment; skipping CLI syntax check."
fi

# 3. Live Connectivity (if requested)
if [ "$LIVE_MODE" = true ]; then
  echo -e "\n${BLUE}--- 3. Live Ansible Connectivity (Ping Module) ---${NC}"
  if command -v ansible &>/dev/null; then
    check "Ansible ping to managed nodes" "ansible -m ping -i '${ANSIBLE_DIR}/inventory/hosts.ini' all"
  else
    echo -e "${FAIL} ansible binary missing for live test."
    FAILED=$((FAILED + 1))
  fi
fi

echo -e "\n${BLUE}============================================================${NC}"
echo -e "Total Checks: ${TOTAL} | Passed: ${GREEN}${PASSED}${NC} | Failed: ${RED}${FAILED}${NC}"
echo -e "${BLUE}============================================================${NC}\n"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
exit 0
