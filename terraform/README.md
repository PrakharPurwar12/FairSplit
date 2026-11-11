# Terraform Infrastructure Layer

Terraform Infrastructure as Code (IaC) definitions for FairSplit-Ops.

## Architecture

This layer provisions the approved two-node architecture in AWS region `ap-south-1` (Mumbai):
- **Networking**: Automatically discovers and reuses the existing Default VPC (`vpc-012757c89854197cd`) and public subnets via read-only Terraform data sources, preventing duplicate VPC/NAT charges.
- **Ops Node (`t3.small`)**: Hosts Puppet Server (8140), Ansible Control Node, Nagios Core (80), and automated remediation orchestration.
- **App Node (`t3.small`)**: Hosts the FairSplit container stack (Nginx on port 80, Django/Gunicorn, and PostgreSQL via Docker Compose), monitored remotely via NRPE (5666).
- **Security Groups**:
  - `fairsplit-ops-sg`: Restricted SSH (22) and Nagios UI (80) from admin IP, Puppet catalog access (8140) from App Node.
  - `fairsplit-app-sg`: Public HTTP (80) for web traffic, restricted SSH (22) from admin IP and Ops Node (Ansible), NRPE (5666) from Ops Node only. PostgreSQL (5432) and Gunicorn (8000) are strictly not exposed externally.
- **Ansible Inventory**: Dynamically rendered to `ansible/inventory/hosts.ini` via `templates/inventory.tpl`.

## Directory Structure

```text
terraform/
├── main.tf                    # Root orchestration and module composition
├── variables.tf               # Input variables with validation and defaults
├── outputs.tf                 # Operational outputs (IPs, URLs, SSH commands)
├── providers.tf               # AWS and local provider definitions
├── versions.tf                # Required Terraform and provider versions
├── terraform.tfvars.example   # Sample configuration variables
├── templates/
│   └── inventory.tpl          # Ansible dynamic inventory template
└── modules/
    ├── network/               # Read-only default VPC and subnet discovery
    ├── security/              # Ops and App security groups with explicit rules
    └── compute/               # EC2 instances, gp3 storage, and host initialization
```

## Usage (AWS CloudShell or Local)

1. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```
2. Update `admin_ip_cidr` in `terraform.tfvars` with your public IP address (e.g., `203.0.113.25/32`).
3. Initialize Terraform:
   ```bash
   terraform init
   ```
4. Validate the configuration:
   ```bash
   terraform validate
   ```
5. Review the plan:
   ```bash
   terraform plan
   ```
