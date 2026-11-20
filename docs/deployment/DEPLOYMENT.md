# FairSplit-Ops: End-to-End Deployment Guide

This guide walks through provisioning and deploying the FairSplit-Ops DevOps infrastructure on AWS.

---

## 1. Prerequisites

Before starting deployment, ensure you have:
1. **AWS CLI** installed and configured with valid credentials (`aws sts get-caller-identity`).
2. **EC2 Key Pair Selection & Verification**:
   - **Option A (Dedicated Project Key - Recommended)**: Create and verify the dedicated key pair `fairsplit-dev-key` in region `ap-south-1`:
     ```bash
     # 1. Create dedicated key pair in Mumbai
     aws ec2 create-key-pair \
       --key-name fairsplit-dev-key \
       --region ap-south-1 \
       --query 'KeyMaterial' \
       --output text > ~/.ssh/fairsplit-dev-key.pem
     
     chmod 400 ~/.ssh/fairsplit-dev-key.pem

     # 2. Verify key pair exists in AWS before using
     aws ec2 describe-key-pairs --key-names fairsplit-dev-key --region ap-south-1
     ```
     > **IMPORTANT**: Use `fairsplit-dev-key` **only after its creation and verification** in AWS. Specifying a key pair that does not exist will cause instance creation to fail with `InvalidKeyPair.NotFound`.
   - **Option B (Existing Verified Fallback Key)**: If not creating a new key, reuse the verified existing key pair `terra-server-key` (already present in the AWS account), with private key at `~/.ssh/terra-server-key.pem` (`chmod 400`).
3. **Administrator Public IP**: Your current public workstation IP address in CIDR format (`curl -s https://api.ipify.org` → `<IP>/32`). Used solely for temporary fallback SSH and Nagios UI access. Inbound SSH from `0.0.0.0/0` is strictly rejected by Terraform validation.
4. **Terraform** v1.5+ installed.
5. **AWS Systems Manager (SSM) Session Manager Prerequisites**:
   - **Session Manager Plugin**: Install the AWS Session Manager plugin on the administrator machine (`session-manager-plugin`).
   - **Administrator IAM Permissions**: Inspect that the administrator IAM user (`arn:aws:iam::818566829648:user/terra-admin`) has permission for SSM session actions:
     ```bash
     # Check attached user policies on terra-admin
     aws iam list-attached-user-policies --user-name terra-admin

     # Check inline user policies on terra-admin
     aws iam list-user-policies --user-name terra-admin

     # Check IAM groups and group-inherited policies
     aws iam list-groups-for-user --user-name terra-admin

     # Perform non-destructive simulation of required SSM actions for terra-admin
     aws iam simulate-principal-policy \
       --policy-source-arn arn:aws:iam::818566829648:user/terra-admin \
       --action-names ssm:StartSession ssm:TerminateSession ssm:DescribeSessions ssm:ResumeSession ssm:GetConnectionStatus
     ```
     Required IAM permissions for `terra-admin`:
     - `ssm:StartSession`
     - `ssm:TerminateSession`
     - `ssm:ResumeSession`
     - `ssm:DescribeSessions`
     - `ssm:GetConnectionStatus`
     - `ec2:DescribeInstances`
     *(Note: If `terra-admin` has the AWS managed `AdministratorAccess` policy, these permissions are already present).*

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

# Dedicated project key (only after creation and verification):
key_name         = "fairsplit-dev-key"
ssh_key_path     = "~/.ssh/fairsplit-dev-key.pem"

# OR existing fallback key:
# key_name       = "terra-server-key"
# ssh_key_path   = "~/.ssh/terra-server-key.pem"

admin_ip_cidr    = "YOUR_PUBLIC_IP/32" # e.g. "103.21.124.45/32"
```

### Step 1.2: Validate and Plan
```bash
terraform fmt -check -recursive
terraform init
terraform validate
terraform plan -out=tfplan
```

#### Actual Resource Count Derived from Plan:
The execution plan must add exactly **17 resources** (0 to change, 0 to destroy):

| Resource ID | Type | Description |
| :--- | :--- | :--- |
| `module.compute.aws_iam_role.ops_ssm_role` | IAM Role | EC2-trusted role with `AmazonSSMManagedInstanceCore` |
| `module.compute.aws_iam_role_policy_attachment.ops_ssm_managed_policy` | IAM Policy Attachment | Attaches SSM managed policy to Ops role |
| `module.compute.aws_iam_instance_profile.ops_instance_profile` | IAM Instance Profile | Instance profile attached to Ops EC2 instance |
| `module.compute.aws_instance.ops_node` | EC2 Instance | Ops Node (t3.small, 15GB gp3, Swap, SSM Profile) |
| `module.compute.aws_instance.app_node` | EC2 Instance | App Node (t3.small, 15GB gp3, Docker) |
| `module.security.aws_security_group.ops_sg` | Security Group | `fairsplit-dev-ops-sg` |
| `module.security.aws_security_group.app_sg` | Security Group | `fairsplit-dev-app-sg` |
| `module.security.aws_security_group_rule.ops_ingress_ssh` | SG Rule | SSH (22) from admin IP to Ops Node (fallback) |
| `module.security.aws_security_group_rule.ops_ingress_nagios` | SG Rule | HTTP (80) Nagios UI from admin IP |
| `module.security.aws_security_group_rule.ops_ingress_puppet` | SG Rule | TCP (8140) Puppet from App SG only |
| `module.security.aws_security_group_rule.ops_egress_all` | SG Rule | Outbound all traffic from Ops Node (includes HTTPS 443 to SSM) |
| `module.security.aws_security_group_rule.app_ingress_http` | SG Rule | HTTP (80) FairSplit web from 0.0.0.0/0 |
| `module.security.aws_security_group_rule.app_ingress_ssh_admin` | SG Rule | SSH (22) from admin IP to App Node |
| `module.security.aws_security_group_rule.app_ingress_ssh_ops` | SG Rule | SSH (22) from Ops SG for Ansible |
| `module.security.aws_security_group_rule.app_ingress_nrpe` | SG Rule | TCP (5666) NRPE monitoring from Ops SG |
| `module.security.aws_security_group_rule.app_egress_all` | SG Rule | Outbound all traffic from App Node |
| `local_file.ansible_inventory` | Local File | Generates `ansible/inventory/hosts.ini` |

**Total:** `Plan: 17 to add, 0 to change, 0 to destroy.`

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

## 3. Phase 2: Ops Node Bootstrap & Key Generation

### Connecting to Ops Node

You can connect to the Ops Node securely using AWS Systems Manager Session Manager (recommended; works from any network without exposing port 22 publicly) or via temporary fallback SSH:

#### Method A: AWS Systems Manager Session Manager (Primary / Recommended)
Start an interactive shell session directly through Systems Manager:
```bash
aws ssm start-session --target <ops_instance_id> --region ap-south-1
```
Once connected (as `ssm-user`), switch to the `ubuntu` administrative user:
```bash
sudo su - ubuntu
```

#### Method B: SSH-over-SSM via ProxyCommand
Connect via standard SSH routed through the SSM data plane (requires no public inbound port 22 open on any firewall):
```bash
# Using fairsplit-dev-key (or terra-server-key):
ssh -i ~/.ssh/fairsplit-dev-key.pem \
  -o ProxyCommand="aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters 'portNumber=%p' --region ap-south-1" \
  ubuntu@<ops_instance_id>
```

#### Method C: Direct SSH (Temporary Fallback)
If SSM is not yet active during initial boot, connect directly via public IP (restricted to `admin_ip_cidr`):
```bash
# Using fairsplit-dev-key (if created and verified):
ssh -i ~/.ssh/fairsplit-dev-key.pem ubuntu@<ops_public_ip>

# OR using terra-server-key:
# ssh -i ~/.ssh/terra-server-key.pem ubuntu@<ops_public_ip>
```

Clone the repository and run the Ops bootstrap script:
```bash
git clone https://github.com/PrakharPurwar12/FairSplit.git /opt/fairsplit/repo
cd /opt/fairsplit/repo

# Run bootstrap script (sets up Puppet 8 Server pinned to Java 17, Ansible, Nagios Core, Apache, and generates ~/.ssh/id_ed25519)
bash scripts/bootstrap/bootstrap_ops.sh --nagios-password "YourSecureNagiosPassword"
```

Capture the generated Ops deployment public key from your workstation:
```powershell
# Run on Windows workstation (the private key NEVER leaves your machine)
$OPS_PUBKEY = (ssh -i ~/.ssh/fairsplit-dev-key.pem ubuntu@<ops_public_ip> 'cat ~/.ssh/id_ed25519.pub').Trim()
```

Verify services on Ops Node:
```bash
sudo systemctl status puppetserver
sudo systemctl status nagios4
sudo systemctl status apache2
```

---

## 4. Phase 3: App Node Bootstrap, Key Authorization & Host-Key Pinning

### Step 4.1: App Node Bootstrap
SSH into the App Node in a separate terminal:
```bash
# Using fairsplit-dev-key (if created and verified):
ssh -i ~/.ssh/fairsplit-dev-key.pem ubuntu@<app_public_ip>

# OR using terra-server-key:
# ssh -i ~/.ssh/terra-server-key.pem ubuntu@<app_public_ip>
```

Clone the repository and run the App bootstrap script, passing the Ops public key:
```bash
git clone https://github.com/PrakharPurwar12/FairSplit.git /opt/fairsplit/repo
cd /opt/fairsplit/repo

# Run bootstrap script with Ops public key injection (sets up Puppet Agent, Docker CE, NRPE, authorized_keys)
bash scripts/bootstrap/bootstrap_app.sh --ops-ip <ops_private_ip> --ops-pubkey "$OPS_PUBKEY"
```

### Step 4.2: Authenticated SSH Host-Key Pinning
On the **Ops Node**, verify and pin the App Node's host-key fingerprint using AWS EC2 console logs:
```bash
bash scripts/security/verify_and_pin_ssh_host_key.sh --instance-id <app_instance_id> --host-ip <app_private_ip>
```
This cryptographically verifies the candidate key against the hypervisor serial console buffer and pins it to `~/.ssh/known_hosts`, allowing Ansible to execute with `StrictHostKeyChecking=yes`.

### Step 4.3: Sign Puppet Certificate
Back on the **Ops Node**, list and sign the certificate request:
```bash
sudo /opt/puppetlabs/bin/puppetserver ca list
sudo /opt/puppetlabs/bin/puppetserver ca sign --certname fairsplit-app
```

### Step 4.4: Verify Puppet Run on App Node
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

# Inter-node automation runs entirely over private VPC networking using ~/.ssh/id_ed25519
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

