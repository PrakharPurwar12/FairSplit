#!/bin/bash
# bootstrap_app.sh - One-time setup script for the FairSplit App Node
# Run as: ubuntu user (with sudo) on a fresh Ubuntu 24.04 t3.small instance
#
# This script sets up:
#   - System packages & prerequisites
#   - Host resolution for fairsplit-ops
#   - Puppet 8 Agent (configured to connect to fairsplit-ops)
#   - Docker CE & Docker Compose plugin
#   - Nagios NRPE server & plugins
#   - Application and backup directories (/opt/fairsplit/{app,backups})
#
# Usage:
#   bash bootstrap_app.sh --ops-ip <OPS_PRIVATE_IP>

set -euo pipefail

# ─────────────────────────────────────────────────
# Color helpers
# ─────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC} $*"; }
success() { echo -e "${GREEN}[OK]${NC}   $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; exit 1; }

# ─────────────────────────────────────────────────
# Parse arguments
# ─────────────────────────────────────────────────
OPS_IP=""
CERTNAME="fairsplit-app"

while [[ $# -gt 0 ]]; do
  case $1 in
    --ops-ip)
      OPS_IP="$2"
      shift 2
      ;;
    --certname)
      CERTNAME="$2"
      shift 2
      ;;
    *)
      error "Unknown parameter: $1. Usage: bash bootstrap_app.sh --ops-ip <OPS_PRIVATE_IP> [--certname <name>]"
      ;;
  esac
done

# ─────────────────────────────────────────────────
# 1. Pre-flight checks
# ─────────────────────────────────────────────────
info "=== FairSplit App Node Bootstrap ==="
info "Checking pre-conditions..."

CURRENT_USER=$(whoami)
if [ "$CURRENT_USER" != "ubuntu" ]; then
  error "This script must be run as the 'ubuntu' user, not '$CURRENT_USER'."
fi
success "Running as ubuntu user"

if ! grep -q "Ubuntu" /etc/os-release 2>/dev/null; then
  warn "Expected Ubuntu Linux. Detected: $(grep PRETTY_NAME /etc/os-release 2>/dev/null | cut -d= -f2 | tr -d '\"')"
fi

# ─────────────────────────────────────────────────
# 2. Host resolution for fairsplit-ops
# ─────────────────────────────────────────────────
if [ -n "$OPS_IP" ]; then
  info "Configuring /etc/hosts entry for fairsplit-ops (${OPS_IP})..."
  if grep -q "fairsplit-ops" /etc/hosts; then
    sudo sed -i "s/.*fairsplit-ops.*/${OPS_IP} fairsplit-ops/" /etc/hosts
  else
    echo "${OPS_IP} fairsplit-ops" | sudo tee -a /etc/hosts >/dev/null
  fi
  success "Added ${OPS_IP} fairsplit-ops to /etc/hosts"
else
  warn "No --ops-ip specified. Ensure 'fairsplit-ops' resolves correctly via DNS or /etc/hosts."
fi

# ─────────────────────────────────────────────────
# 3. System packages & dependencies
# ─────────────────────────────────────────────────
info "Updating apt cache and installing base packages..."
sudo apt-get update -y
sudo apt-get install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  net-tools \
  htop \
  jq \
  unzip \
  ufw
success "Base packages installed"

# ─────────────────────────────────────────────────
# 4. Install Puppet 8 Agent
# ─────────────────────────────────────────────────
info "Installing Puppet 8 Agent..."
CODENAME=$(lsb_release -cs 2>/dev/null || echo "noble")

if [ ! -f /etc/apt/sources.list.d/puppet8.list ] && [ ! -f /etc/apt/sources.list.d/puppet.list ]; then
  wget -q "https://apt.puppet.com/puppet8-release-${CODENAME}.deb" -O /tmp/puppet8-release.deb || \
    wget -q "https://apt.puppet.com/puppet8-release-jammy.deb" -O /tmp/puppet8-release.deb
  sudo dpkg -i /tmp/puppet8-release.deb
  rm -f /tmp/puppet8-release.deb
  sudo apt-get update -y
fi

sudo apt-get install -y puppet-agent

# Ensure puppet is in PATH
if ! grep -q "/opt/puppetlabs/bin" /home/ubuntu/.bashrc; then
  echo 'export PATH=$PATH:/opt/puppetlabs/bin' >> /home/ubuntu/.bashrc
fi
export PATH=$PATH:/opt/puppetlabs/bin

# Configure Puppet Agent
info "Configuring /etc/puppetlabs/puppet/puppet.conf..."
sudo tee /etc/puppetlabs/puppet/puppet.conf > /dev/null <<EOF
[main]
certname = ${CERTNAME}
server = fairsplit-ops
environment = production
runinterval = 30m
EOF

sudo systemctl enable puppet
sudo systemctl start puppet
success "Puppet Agent installed and started"

# ─────────────────────────────────────────────────
# 5. Install Docker CE and Compose plugin
# ─────────────────────────────────────────────────
info "Installing Docker CE and Docker Compose plugin..."
if ! command -v docker &>/dev/null; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

sudo usermod -aG docker ubuntu
sudo systemctl enable docker
sudo systemctl start docker
success "Docker and Docker Compose installed and started"

# ─────────────────────────────────────────────────
# 6. Install and configure Nagios NRPE server & plugins
# ─────────────────────────────────────────────────
info "Installing Nagios NRPE server and plugins..."
sudo apt-get install -y \
  nagios-nrpe-server \
  nagios-plugins-basic \
  nagios-plugins-standard

sudo mkdir -p /usr/lib/nagios/plugins
sudo chmod 755 /usr/lib/nagios/plugins

# Configure NRPE allowed_hosts
NRPE_CFG="/etc/nagios/nrpe.cfg"
if [ -f "$NRPE_CFG" ]; then
  ALLOWED_HOSTS="127.0.0.1,::1"
  if [ -n "$OPS_IP" ]; then
    ALLOWED_HOSTS="${ALLOWED_HOSTS},${OPS_IP},fairsplit-ops"
  fi
  sudo sed -i "s/^allowed_hosts=.*/allowed_hosts=${ALLOWED_HOSTS}/" "$NRPE_CFG"
  sudo sed -i "s/^dont_blame_nrpe=.*/dont_blame_nrpe=0/" "$NRPE_CFG"
fi

sudo systemctl enable nagios-nrpe-server
sudo systemctl restart nagios-nrpe-server
success "NRPE server configured and restarted"

# ─────────────────────────────────────────────────
# 7. Create application directories & permissions
# ─────────────────────────────────────────────────
info "Creating application directory tree under /opt/fairsplit..."
sudo mkdir -p /opt/fairsplit/app
sudo mkdir -p /opt/fairsplit/backups
sudo mkdir -p /opt/fairsplit/logs
sudo chown -R ubuntu:ubuntu /opt/fairsplit
sudo chmod 750 /opt/fairsplit/backups
success "Directories created with appropriate ownership"

# ─────────────────────────────────────────────────
# 8. Summary and Next Steps
# ─────────────────────────────────────────────────
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  FairSplit App Node Bootstrap Complete!                  ${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Services status:"
for svc in puppet docker nagios-nrpe-server; do
  if sudo systemctl is-active --quiet "$svc"; then
    echo -e "  ${GREEN}✓${NC} $svc"
  else
    echo -e "  ${RED}✗${NC} $svc (check: journalctl -u $svc)"
  fi
done
echo ""
echo "Next steps:"
echo "  1. On Ops Node: Sign App Node Puppet certificate:"
echo "       sudo puppetserver ca sign --certname ${CERTNAME}"
echo "  2. On App Node: Verify Puppet catalog run:"
echo "       sudo /opt/puppetlabs/bin/puppet agent -t"
echo "  3. On Ops Node: Deploy FairSplit via Ansible:"
echo "       ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml"
echo ""
