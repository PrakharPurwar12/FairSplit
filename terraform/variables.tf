variable "aws_region" {
  description = "AWS region for FairSplit-Ops infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name prefix for resource naming and tagging"
  type        = string
  default     = "fairsplit"
}

variable "environment" {
  description = "Target deployment environment (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "admin_ip_cidr" {
  description = "CIDR block of administrator IP allowed for SSH (port 22) and Nagios UI (port 80). Example: '203.0.113.50/32'"
  type        = string
  default     = "0.0.0.0/0"
}

variable "vpc_id" {
  description = "Existing VPC ID to reuse. If omitted, the default VPC will be automatically discovered and reused."
  type        = string
  default     = ""
}

variable "subnet_id" {
  description = "Existing public subnet ID to deploy nodes into. If omitted, the first available public subnet in the default VPC will be used."
  type        = string
  default     = ""
}

variable "key_name" {
  description = "Name of the EC2 Key Pair used for SSH access to both nodes"
  type        = string
  default     = "terra-server-key"
}

variable "public_key" {
  description = "Optional public key material. If provided with create_key_pair=true, an aws_key_pair resource is created."
  type        = string
  default     = ""
}

variable "create_key_pair" {
  description = "Whether to create a new aws_key_pair resource using public_key"
  type        = bool
  default     = false
}

variable "ami_id" {
  description = "Custom AMI ID for Ubuntu nodes. If left empty, the latest Canonical Ubuntu 24.04 LTS gp3 AMI will be automatically resolved."
  type        = string
  default     = ""
}

variable "ops_instance_type" {
  description = "EC2 instance type for Ops Node (Puppet Server, Ansible, Nagios). Minimum recommended is t3.small (2 vCPU, 2 GB RAM)."
  type        = string
  default     = "t3.small"
}

variable "app_instance_type" {
  description = "EC2 instance type for App Node (Docker Compose, FairSplit stack). Minimum recommended is t3.small (2 vCPU, 2 GB RAM)."
  type        = string
  default     = "t3.small"
}

variable "ops_volume_size" {
  description = "Root gp3 volume size in GB for Ops Node"
  type        = number
  default     = 15
}

variable "app_volume_size" {
  description = "Root gp3 volume size in GB for App Node"
  type        = number
  default     = 15
}

variable "ssh_key_path" {
  description = "Local path to the SSH private key used by Ansible inventory for authentication"
  type        = string
  default     = "~/.ssh/terra-server-key.pem"
}

