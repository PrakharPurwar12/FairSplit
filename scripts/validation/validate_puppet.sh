#!/bin/bash
# validate_puppet.sh - Validation script for Puppet configuration management
# Checks Puppet manifests, modules, Hiera data, and live agent/server status
#
# Usage:
#   bash validate_puppet.sh [--live]

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
PUPPET_DIR="${REPO_DIR}/puppet"

echo -e "\n${BLUE}============================================================${NC}"
echo -e "${BLUE}  FairSplit Puppet Validation                              ${NC}"
echo -e "${BLUE}============================================================${NC}\n"

# 1. Static Configuration & File Checks
echo -e "${BLUE}--- 1. Puppet Static Structure & Manifest Checks ---${NC}"

check "Puppet environment.conf exists" "test -s '${PUPPET_DIR}/environment.conf'"
check "Puppet hiera.yaml exists" "test -s '${PUPPET_DIR}/hiera.yaml'"
check "Puppet Puppetfile exists" "test -s '${PUPPET_DIR}/Puppetfile'"
check "Puppet common.yaml data exists" "test -s '${PUPPET_DIR}/data/common.yaml'"
check "Puppet site.pp manifest exists" "test -s '${PUPPET_DIR}/manifests/site.pp'"

check "Module 'common' init.pp exists" "test -s '${PUPPET_DIR}/modules/common/manifests/init.pp'"
check "Module 'security' init.pp exists" "test -s '${PUPPET_DIR}/modules/security/manifests/init.pp'"
check "Module 'docker' init.pp exists" "test -s '${PUPPET_DIR}/modules/docker/manifests/init.pp'"
check "Module 'nagios_server' init.pp exists" "test -s '${PUPPET_DIR}/modules/nagios_server/manifests/init.pp'"
check "Module 'nrpe' init.pp exists" "test -s '${PUPPET_DIR}/modules/nrpe/manifests/init.pp'"

# Puppet syntax parser check (if puppet CLI available)
if command -v puppet &>/dev/null; then
  echo -e "\n${BLUE}--- 2. Puppet Manifest Syntax Validation ---${NC}"
  check "site.pp syntax validation" "puppet parser validate '${PUPPET_DIR}/manifests/site.pp'"
  for m in common security docker nagios_server nrpe; do
    check "Module ${m} init.pp syntax" "puppet parser validate '${PUPPET_DIR}/modules/${m}/manifests/init.pp'"
  done
else
  echo -e "${WARN} Puppet CLI not installed in local environment; skipping syntax parser check."
fi

# 2. Live Puppet Service Checks
if [ "$LIVE_MODE" = true ]; then
  echo -e "\n${BLUE}--- 3. Live Puppet Services & Catalog Verification ---${NC}"
  
  # Ops Node checks
  if command -v puppetserver &>/dev/null; then
    check "puppetserver service is running" "systemctl is-active --quiet puppetserver"
    check "Puppet CA certificate inventory" "puppetserver ca list --all"
  fi

  # Agent checks
  if command -v puppet &>/dev/null; then
    check "puppet agent service is running" "systemctl is-active --quiet puppet"
    check "Puppet agent dry-run (catalog test)" "puppet agent -t --noop"
  fi
fi

echo -e "\n${BLUE}============================================================${NC}"
echo -e "Total Checks: ${TOTAL} | Passed: ${GREEN}${PASSED}${NC} | Failed: ${RED}${FAILED}${NC}"
echo -e "${BLUE}============================================================${NC}\n"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
exit 0
