#!/bin/bash
# bootstrap_ops.sh - One-time setup script for the FairSplit Ops Node
# Run as: ubuntu user (NOT root) on a fresh Ubuntu 24.04 t3.small instance
#
# This script sets up:
#   - Puppet 8 Server (puppetserver)
#   - Ansible control node
#   - Nagios 4 monitoring with NRPE plugin
#   - Apache2 (Nagios web UI)
#   - FairSplit directory structure
#
# Usage: bash bootstrap_ops.sh [--nagios-password <password>]

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
# Parse args
# ─────────────────────────────────────────────────
NAGIOS_PASSWORD="${NAGIOS_PASSWORD:-fairsplit-nagios}"
while [[ $# -gt 0 ]]; do
  case $1 in
    --nagios-password) NAGIOS_PASSWORD="$2"; shift 2 ;;
    *) error "Unknown argument: $1" ;;
  esac
done

# ─────────────────────────────────────────────────
# 1. Pre-flight checks
# ─────────────────────────────────────────────────
info "=== FairSplit Ops Node Bootstrap ==="
info "Checking pre-conditions..."

CURRENT_USER=$(whoami)
if [ "$CURRENT_USER" != "ubuntu" ]; then
  error "This script must be run as the 'ubuntu' user, not '$CURRENT_USER'."
fi
success "Running as ubuntu user"

# Check Ubuntu version
if ! grep -q "Ubuntu 24.04" /etc/os-release 2>/dev/null; then
  warn "Expected Ubuntu 24.04. Detected: $(grep PRETTY_NAME /etc/os-release | cut -d= -f2 | tr -d '\"')"
  warn "Proceeding anyway - some steps may differ."
fi

# Check internet connectivity
if ! curl -sf --max-time 10 https://apt.puppet.com > /dev/null; then
  error "No internet connectivity. Cannot reach apt.puppet.com. Aborting."
fi

# ─────────────────────────────────────────────────
# 2. System update
# ─────────────────────────────────────────────────
info "Updating apt cache..."
sudo apt-get update -y
sudo apt-get install -y curl wget gnupg2 lsb-release apt-transport-https ca-certificates
success "System packages updated"

# ─────────────────────────────────────────────────
# 3. Install Puppet 8 Server
# ─────────────────────────────────────────────────
info "Adding Puppet 8 apt repository..."
UBUNTU_CODENAME=$(lsb_release -cs)
PUPPET_DEB="puppet8-release-${UBUNTU_CODENAME}.deb"
PUPPET_DEB_URL="https://apt.puppet.com/${PUPPET_DEB}"

if ! dpkg -l puppetserver &>/dev/null; then
  wget -q -O "/tmp/${PUPPET_DEB}" "${PUPPET_DEB_URL}" || \
    error "Failed to download Puppet apt release package from ${PUPPET_DEB_URL}"
  sudo dpkg -i "/tmp/${PUPPET_DEB}"
  sudo apt-get update -y
  info "Installing puppetserver..."
  sudo apt-get install -y puppetserver
  success "Puppet Server installed"
else
  success "Puppet Server already installed - skipping"
fi

# ─────────────────────────────────────────────────
# 4. Configure Puppet Server JVM heap (512m for t3.small)
# ─────────────────────────────────────────────────
info "Configuring Puppet Server JVM heap (Xms512m Xmx512m)..."
PUPPET_JAVA_ARGS_FILE="/etc/default/puppetserver"
if [ -f "$PUPPET_JAVA_ARGS_FILE" ]; then
  sudo sed -i 's/JAVA_ARGS=.*/JAVA_ARGS="-Xms512m -Xmx512m"/' "$PUPPET_JAVA_ARGS_FILE"
else
  echo 'JAVA_ARGS="-Xms512m -Xmx512m"' | sudo tee "$PUPPET_JAVA_ARGS_FILE" > /dev/null
fi
success "JVM heap set to 512m"

# ─────────────────────────────────────────────────
# 5. Configure puppet.conf
# ─────────────────────────────────────────────────
info "Configuring /etc/puppetlabs/puppet/puppet.conf..."
PUPPET_CONF="/etc/puppetlabs/puppet/puppet.conf"
sudo mkdir -p /etc/puppetlabs/puppet

# Get the internal hostname / private IP for dns_alt_names
PRIVATE_IP=$(curl -sf --max-time 5 http://169.254.169.254/latest/meta-data/local-ipv4 2>/dev/null || hostname -I | awk '{print $1}')

sudo tee "$PUPPET_CONF" > /dev/null <<EOF
[main]
server = fairsplit-ops
environment = production
runinterval = 30m

[server]
dns_alt_names = fairsplit-ops,puppet,${PRIVATE_IP}
vardir = /opt/puppetlabs/server/data/puppetserver
logdir = /var/log/puppetlabs/puppetserver
rundir = /var/run/puppetlabs/puppetserver
pidfile = /var/run/puppetlabs/puppetserver/puppetserver.pid
codedir = /etc/puppetlabs/code
EOF
success "puppet.conf configured"

# ─────────────────────────────────────────────────
# 6. Start and enable Puppet Server
# ─────────────────────────────────────────────────
info "Starting and enabling puppetserver service..."
sudo systemctl enable puppetserver
sudo systemctl start puppetserver
sleep 5
if sudo systemctl is-active --quiet puppetserver; then
  success "puppetserver is running"
else
  warn "puppetserver failed to start - check: journalctl -u puppetserver"
fi

# ─────────────────────────────────────────────────
# 7. Install Ansible
# ─────────────────────────────────────────────────
info "Installing Ansible..."
if ! command -v ansible &>/dev/null; then
  sudo apt-get install -y software-properties-common
  sudo add-apt-repository --yes --update ppa:ansible/ansible || true
  sudo apt-get install -y ansible
  success "Ansible installed: $(ansible --version | head -1)"
else
  success "Ansible already installed: $(ansible --version | head -1)"
fi

# ─────────────────────────────────────────────────
# 8. Set up /opt/fairsplit directory structure
# ─────────────────────────────────────────────────
info "Creating /opt/fairsplit directory structure..."
sudo mkdir -p /opt/fairsplit/logs
sudo mkdir -p /opt/fairsplit/backups
sudo mkdir -p /opt/fairsplit/remediation/scripts
sudo mkdir -p /opt/fairsplit/remediation/event_handlers
sudo chown -R ubuntu:ubuntu /opt/fairsplit
success "Directory structure created"

# Set up Ansible symlink to repo
REPO_DIR="${FAIRSPLIT_REPO_DIR:-/opt/fairsplit/repo}"
if [ -d "$REPO_DIR/ansible" ] && [ ! -L /opt/fairsplit/ansible ]; then
  ln -s "$REPO_DIR/ansible" /opt/fairsplit/ansible
  success "Ansible symlink created: /opt/fairsplit/ansible -> $REPO_DIR/ansible"
elif [ -L /opt/fairsplit/ansible ]; then
  success "Ansible symlink already exists"
else
  warn "Repo not found at $REPO_DIR. Set FAIRSPLIT_REPO_DIR to point to repo root."
  warn "Manually run: ln -s <repo>/ansible /opt/fairsplit/ansible"
fi

# Set up remediation scripts symlink
if [ -d "$REPO_DIR/remediation" ] && [ ! -L /opt/fairsplit/remediation/scripts ]; then
  cp -r "$REPO_DIR/remediation/." /opt/fairsplit/remediation/
  chmod +x /opt/fairsplit/remediation/scripts/*.sh
  chmod +x /opt/fairsplit/remediation/event_handlers/*.sh
  sudo mkdir -p /etc/nagios4/scripts
  sudo ln -sf /opt/fairsplit/remediation/event_handlers/nagios_event_handler.sh /etc/nagios4/scripts/remediate.sh
  success "Remediation scripts installed"
fi

# ─────────────────────────────────────────────────
# 9. Install Nagios 4
# ─────────────────────────────────────────────────
info "Installing Nagios 4 and plugins..."
# Pre-answer debconf for nagios3 (suppress prompts)
echo "postfix postfix/mailname string fairsplit-ops" | sudo debconf-set-selections
echo "postfix postfix/main_mailer_type string 'No configuration'" | sudo debconf-set-selections

sudo DEBIAN_FRONTEND=noninteractive apt-get install -y \
  nagios4 \
  nagios-nrpe-plugin \
  nagios-plugins-extra \
  nagios-plugins-contrib
success "Nagios 4 installed"

# ─────────────────────────────────────────────────
# 10. Install Apache2 for Nagios web UI
# ─────────────────────────────────────────────────
info "Installing and configuring Apache2..."
sudo apt-get install -y apache2 libapache2-mod-php php
sudo a2enmod cgi rewrite
sudo systemctl enable apache2
sudo systemctl start apache2
success "Apache2 installed and started"

# ─────────────────────────────────────────────────
# 11. Configure Nagios
# ─────────────────────────────────────────────────
info "Configuring Nagios..."

# Set nagiosadmin password
if command -v htpasswd &>/dev/null; then
  sudo htpasswd -cb /etc/nagios4/htpasswd.users nagiosadmin "$NAGIOS_PASSWORD"
  success "nagiosadmin password set via htpasswd"
else
  sudo apt-get install -y apache2-utils
  sudo htpasswd -cb /etc/nagios4/htpasswd.users nagiosadmin "$NAGIOS_PASSWORD"
  success "nagiosadmin password set via htpasswd"
fi

# Install custom nagios config from repo if present
if [ -d "$REPO_DIR/nagios" ]; then
  sudo cp -r "$REPO_DIR/nagios/conf.d/." /etc/nagios4/conf.d/ 2>/dev/null || true
  success "Custom Nagios configs installed from repo"
fi

# Enable Nagios Apache config (nagios4 package usually drops one)
if [ -f /etc/apache2/conf-available/nagios4.conf ]; then
  sudo a2enconf nagios4
fi

# Validate nagios config
info "Validating Nagios configuration..."
if sudo /usr/sbin/nagios4 -v /etc/nagios4/nagios.cfg &>/dev/null; then
  success "Nagios config is valid"
else
  warn "Nagios config has warnings - run: sudo /usr/sbin/nagios4 -v /etc/nagios4/nagios.cfg"
fi

# Start and enable nagios4
sudo systemctl enable nagios4
sudo systemctl start nagios4 || sudo systemctl restart nagios4
if sudo systemctl is-active --quiet nagios4; then
  success "nagios4 is running"
else
  warn "nagios4 failed to start - check: journalctl -u nagios4"
fi

# Restart apache to pick up nagios config
sudo systemctl restart apache2

# ─────────────────────────────────────────────────
# 12. Create log rotation for remediation logs
# ─────────────────────────────────────────────────
info "Configuring log rotation for remediation logs..."
sudo tee /etc/logrotate.d/fairsplit-remediation > /dev/null <<'EOF'
/opt/fairsplit/remediation.log
/opt/fairsplit/escalation.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
EOF
success "Log rotation configured"

# ─────────────────────────────────────────────────
# 13. Summary and next steps
# ─────────────────────────────────────────────────
PUBLIC_IP=$(curl -sf --max-time 5 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "<public-ip>")

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  FairSplit Ops Node Bootstrap Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Services status:"
for svc in puppetserver nagios4 apache2; do
  if sudo systemctl is-active --quiet "$svc"; then
    echo -e "  ${GREEN}✓${NC} $svc"
  else
    echo -e "  ${RED}✗${NC} $svc (check: journalctl -u $svc)"
  fi
done
echo ""
echo "Next steps:"
echo "  1. Sign App Node certificate:"
echo "       sudo puppetserver ca sign --certname fairsplit-app"
echo "  2. Access Nagios web UI:"
echo "       http://${PUBLIC_IP}/nagios4  (user: nagiosadmin, password: <set above>)"
echo "  3. Set up Ansible inventory:"
echo "       /opt/fairsplit/ansible/inventory/hosts.ini"
echo "  4. Configure Nagios hosts/services for App Node"
echo "  5. Run validate scripts from: scripts/validation/"
echo ""
echo "  FAIRSPLIT_REPO_DIR=${FAIRSPLIT_REPO_DIR:-NOT SET} - set this to point at repo root"
echo ""
