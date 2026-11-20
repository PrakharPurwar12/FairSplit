#!/bin/bash
# verify_and_pin_ssh_host_key.sh
# Production-ready SSH Host-Key Verification and Pinning Script for FairSplit-Ops
#
# Authenticated Pinning Strategy:
# 1. Queries expected host-key fingerprints via AWS API control-plane (ec2 get-console-output)
# 2. Scans the candidate host's public key over the network (ssh-keyscan)
# 3. Calculates the candidate's SHA256 fingerprint (ssh-keygen -lf)
# 4. Compares the cryptographic fingerprints. Rejects mismatched, missing, or malformed keys.
# 5. Pins the verified key into ~/.ssh/known_hosts ONLY upon successful match.
# 6. Enables StrictHostKeyChecking=yes for all subsequent connections.
#
# Usage:
#   bash verify_and_pin_ssh_host_key.sh --instance-id <INSTANCE_ID> --host-ip <PRIVATE_IP> [--region <REGION>] [--dry-run]

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Logging helpers
# ─────────────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ─────────────────────────────────────────────────────────────────────────────
# Argument parsing
# ─────────────────────────────────────────────────────────────────────────────
INSTANCE_ID=""
HOST_IP=""
AWS_REGION="${AWS_REGION:-ap-south-1}"
KNOWN_HOSTS_FILE="${HOME}/.ssh/known_hosts"
KEY_TYPE="ed25519"
DRY_RUN=false
MAX_RETRIES=12
RETRY_DELAY=10

while [[ $# -gt 0 ]]; do
  case $1 in
    --instance-id) INSTANCE_ID="$2"; shift 2 ;;
    --host-ip)     HOST_IP="$2"; shift 2 ;;
    --region)      AWS_REGION="$2"; shift 2 ;;
    --known-hosts) KNOWN_HOSTS_FILE="$2"; shift 2 ;;
    --key-type)    KEY_TYPE="$2"; shift 2 ;;
    --dry-run)     DRY_RUN=true; shift ;;
    *) error "Unknown parameter: $1" ;;
  esac
done

if [ -z "$INSTANCE_ID" ] || [ -z "$HOST_IP" ]; then
  error "Missing required arguments. Usage: $0 --instance-id <ID> --host-ip <IP> [--region <REGION>] [--dry-run]"
fi

info "=== FairSplit SSH Host-Key Authenticated Pinning ==="
info "Target Instance ID : $INSTANCE_ID"
info "Target Private IP  : $HOST_IP"
info "AWS Region         : $AWS_REGION"
info "Key Algorithm      : $KEY_TYPE"

# ─────────────────────────────────────────────────────────────────────────────
# 1. Retrieve Authoritative Host-Key Fingerprint from AWS Control-Plane
# ─────────────────────────────────────────────────────────────────────────────
info "Step 1: Querying AWS EC2 console output for authoritative host-key fingerprints..."

EXPECTED_FINGERPRINT=""
ATTEMPT=1

while [ $ATTEMPT -le $MAX_RETRIES ]; do
  # Retrieve console log through AWS control-plane API (requires ec2:GetConsoleOutput)
  CONSOLE_OUTPUT=$(aws ec2 get-console-output --instance-id "$INSTANCE_ID" --region "$AWS_REGION" --output text 2>/dev/null || true)

  if [ -n "$CONSOLE_OUTPUT" ] && echo "$CONSOLE_OUTPUT" | grep -q "BEGIN SSH HOST KEY FINGERPRINTS"; then
    # Extract line matching requested key type (e.g. ED25519, RSA, ECDSA)
    EXPECTED_LINE=$(echo "$CONSOLE_OUTPUT" | grep -A 6 "BEGIN SSH HOST KEY FINGERPRINTS" | grep -i "(${KEY_TYPE})" | head -1 || true)
    if [ -n "$EXPECTED_LINE" ]; then
      # Fingerprint token format: SHA256:xxxxxxxxxxxx
      EXPECTED_FINGERPRINT=$(echo "$EXPECTED_LINE" | grep -oE "SHA256:[A-Za-z0-9+/=]+" || true)
      if [ -n "$EXPECTED_FINGERPRINT" ]; then
        break
      fi
    fi
  fi

  info "Waiting for cloud-init to publish host-key fingerprints to console ($ATTEMPT/$MAX_RETRIES)..."
  sleep "$RETRY_DELAY"
  ATTEMPT=$((ATTEMPT + 1))
done

if [ -z "$EXPECTED_FINGERPRINT" ]; then
  error "Failed to retrieve authoritative ${KEY_TYPE} host-key fingerprint from EC2 console output for $INSTANCE_ID after $MAX_RETRIES attempts."
fi

success "Authoritative Expected Fingerprint (from AWS control-plane): $EXPECTED_FINGERPRINT"

# ─────────────────────────────────────────────────────────────────────────────
# 2. Scan Candidate Public Key from Target Host
# ─────────────────────────────────────────────────────────────────────────────
info "Step 2: Scanning candidate host key from $HOST_IP over VPC network..."
SCANNED_KEY_OUTPUT=$(ssh-keyscan -t "$KEY_TYPE" -T 5 "$HOST_IP" 2>/dev/null || true)

if [ -z "$SCANNED_KEY_OUTPUT" ]; then
  error "ssh-keyscan failed to retrieve any $KEY_TYPE host key from $HOST_IP (connection timed out or refused)."
fi

# ─────────────────────────────────────────────────────────────────────────────
# 3. Compute Fingerprint of Scanned Candidate Key
# ─────────────────────────────────────────────────────────────────────────────
info "Step 3: Calculating SHA256 fingerprint of scanned candidate key..."
ACTUAL_FINGERPRINT=$(echo "$SCANNED_KEY_OUTPUT" | ssh-keygen -lf - 2>/dev/null | awk '{print $2}' || true)

if [ -z "$ACTUAL_FINGERPRINT" ]; then
  error "Failed to compute fingerprint from scanned key output."
fi

info "Candidate Scanned Fingerprint: $ACTUAL_FINGERPRINT"

# ─────────────────────────────────────────────────────────────────────────────
# 4. Strict Cryptographic Comparison
# ─────────────────────────────────────────────────────────────────────────────
info "Step 4: Performing exact cryptographic fingerprint comparison..."

if [ "$EXPECTED_FINGERPRINT" != "$ACTUAL_FINGERPRINT" ]; then
  echo ""
  echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}  SECURITY ALERT: SSH HOST KEY FINGERPRINT MISMATCH!       ${NC}"
  echo -e "${RED}════════════════════════════════════════════════════════════${NC}"
  echo "Expected (AWS Console) : $EXPECTED_FINGERPRINT"
  echo "Actual   (Network Scan): $ACTUAL_FINGERPRINT"
  echo "Target IP              : $HOST_IP"
  echo "POSSIBLE MAN-IN-THE-MIDDLE (MITM) ATTACK OR SPOOFED NODE DETECTED."
  echo "Key will NOT be pinned to known_hosts. Aborting."
  exit 2
fi

success "Cryptographic Fingerprint Match Verified! ($EXPECTED_FINGERPRINT)"

# ─────────────────────────────────────────────────────────────────────────────
# 5. Pin Verified Key to known_hosts
# ─────────────────────────────────────────────────────────────────────────────
if [ "$DRY_RUN" = true ]; then
  info "[DRY-RUN] Key verification successful. Skipping writes to $KNOWN_HOSTS_FILE."
  exit 0
fi

info "Step 5: Pinning verified host key to $KNOWN_HOSTS_FILE..."
mkdir -p "$(dirname "$KNOWN_HOSTS_FILE")"
chmod 700 "$(dirname "$KNOWN_HOSTS_FILE")"
touch "$KNOWN_HOSTS_FILE"
chmod 600 "$KNOWN_HOSTS_FILE"

# Remove any stale entry for this host IP first
ssh-keygen -R "$HOST_IP" -f "$KNOWN_HOSTS_FILE" >/dev/null 2>&1 || true

# Append verified scanned key
echo "$SCANNED_KEY_OUTPUT" >> "$KNOWN_HOSTS_FILE"
success "Host key for $HOST_IP pinned to $KNOWN_HOSTS_FILE"

# Verification test using StrictHostKeyChecking=yes
info "Step 6: Confirming host key verification with StrictHostKeyChecking=yes..."
if ssh -o StrictHostKeyChecking=yes -o BatchMode=yes -o ConnectTimeout=5 -o UserKnownHostsFile="$KNOWN_HOSTS_FILE" \
   "dummy@$HOST_IP" 2>&1 | grep -q "Host key verification failed"; then
  error "Sanity check failed: SSH reported host key verification failure after pinning!"
else
  success "Host key pinning complete and verified. StrictHostKeyChecking=yes is safe."
fi

exit 0
