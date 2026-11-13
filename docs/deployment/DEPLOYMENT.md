# FairSplit-Ops: End-to-End Deployment Guide

This guide walks through provisioning and deploying the FairSplit-Ops DevOps infrastructure on AWS.

---

## 1. Prerequisites

Before starting deployment, ensure you have:
1. **AWS CLI** installed and configured (`aws sts get-caller-identity`).
2. An existing AWS Key Pair in region `ap-south-1` (default: `terra-server-key`).
   - Private key stored locally at `~/.ssh/terra-server-key.pem` with `chmod 400` permissions.
3. Your current public workstation IP address in CIDR format (`curl -s https://api.ipify.org` → `<IP>/32`).
4. **Terraform** v1.5+ installed.

---

## 2. Phase 1: Terraform Infrastructure Provisioning

### Step 1.1: Configure Variables
Navigate to the `terraform/` directory:
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
aws_region       = "ap-south-1"
environment      = "dev"
key_name         = "terra-server-key"
ssh_key_path     = "~/.ssh/terra-server-key.pem"
admin_ip_cidr    = "YOUR_PUBLIC_IP/32" # e.g. "103.21.124.45/32"
```

### Step 1.2: Validate and Plan
```bash
terraform fmt -check -recursive
terraform init
terraform validate
terraform plan -out=tfplan
```
Verify that the plan adds exactly **14 resources** (2 instances, 2 security groups, 9 security group rules, 1 local file) with **0 to change and 0 to destroy**.

### Step 1.3: Apply Infrastructure
> **Cost Warning:** Running 2x `t3.small` instances continuously incurs ~$40.07/month. For intermittent dev/testing (e.g. 50 hours), the cost is under $5.00/month. Remember to stop instances when not in use.

Apply the plan:
```bash
terraform apply tfplan
```

### Step 1.4: Capture Outputs
Terraform will output the public and private IP addresses and generate `ansible/inventory/hosts.ini`:
```bash
terraform output
```
Note the values:
- `ops_public_ip` & `ops_private_ip`
- `app_public_ip` & `app_private_ip`

---

## 3. Phase 2: Ops Node Bootstrap

SSH into the Ops Node:
```bash
ssh -i ~/.ssh/terra-server-key.pem ubuntu@<ops_public_ip>
```

Clone the repository and run the Ops bootstrap script:
```bash
git clone https://github.com/PrakharPurwar12/FairSplit.git /opt/fairsplit/repo
cd /opt/fairsplit/repo

# Run bootstrap script (sets up Puppet 8 Server, Ansible, Nagios Core, Apache)
bash scripts/bootstrap/bootstrap_ops.sh --nagios-password "YourSecureNagiosPassword"
```

Verify services on Ops Node:
```bash
sudo systemctl status puppetserver
sudo systemctl status nagios4
sudo systemctl status apache2
```

---

## 4. Phase 3: App Node Bootstrap & Puppet CA Signing

### Step 4.1: App Node Bootstrap
SSH into the App Node in a separate terminal:
```bash
ssh -i ~/.ssh/terra-server-key.pem ubuntu@<app_public_ip>
```

Clone the repository and run the App bootstrap script:
```bash
git clone https://github.com/PrakharPurwar12/FairSplit.git /opt/fairsplit/repo
cd /opt/fairsplit/repo

# Run bootstrap script (sets up Puppet Agent, Docker CE, NRPE)
bash scripts/bootstrap/bootstrap_app.sh --ops-ip <ops_private_ip>
```

### Step 4.2: Sign Puppet Certificate
Back on the **Ops Node**, list and sign the certificate request:
```bash
sudo /opt/puppetlabs/bin/puppetserver ca list
sudo /opt/puppetlabs/bin/puppetserver ca sign --certname fairsplit-app
```

### Step 4.3: Verify Puppet Run on App Node
On the **App Node**, test catalog retrieval:
```bash
sudo /opt/puppetlabs/bin/puppet agent -t
```
Expected output: Catalog applied with 0 errors.

---

## 5. Phase 4: Application Deployment via Ansible

From the **Ops Node**, run the deployment playbook:
```bash
cd /opt/fairsplit/repo/ansible

# Copy SSH private key to Ops Node for internal orchestration
# (Alternatively configure SSH agent forwarding)

# Run deployment playbook
ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml
```

The playbook will:
1. Ensure application directory structure under `/opt/fairsplit/app`.
2. Configure `.env` file for the Docker Compose stack.
3. Pull and build the FairSplit Docker containers (Nginx, Django, PostgreSQL).
4. Run Django database migrations (`python manage.py migrate`).
5. Execute application health check against `http://<app_private_ip>/api/health/`.

---

## 6. Phase 5: Verification & Post-Deployment Health Checks

### Check FairSplit Application
Open in your browser:
```
http://<app_public_ip>
```

### Check Nagios Monitoring Dashboard
Open in your browser (credentials: `nagiosadmin` / your configured password):
```
http://<ops_public_ip>/nagios4
```

Verify that all hosts (`fairsplit-ops`, `fairsplit-app`) and services (Ping, SSH, Disk, Docker containers, FairSplit API) show status **OK (Green)**.

### Run Automated Validation Test Suites
On the Ops Node:
```bash
cd /opt/fairsplit/repo
bash scripts/validation/validate_infrastructure.sh --live --ops-ip <ops_public_ip> --app-ip <app_public_ip>
bash scripts/validation/validate_puppet.sh --live
bash scripts/validation/validate_ansible.sh --live
bash scripts/validation/validate_nagios.sh --live --app-ip <app_private_ip>
```
All validation scripts should output all `[PASS]` results with exit code `0`.
