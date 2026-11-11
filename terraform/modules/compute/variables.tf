variable "project_name" {
  description = "Project name prefix"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID where instances will be launched"
  type        = string
}

variable "ops_security_group_id" {
  description = "Security group ID for Ops Node"
  type        = string
}

variable "app_security_group_id" {
  description = "Security group ID for App Node"
  type        = string
}

variable "ami_id" {
  description = "Custom AMI ID. If empty, the latest Canonical Ubuntu 24.04 LTS gp3 AMI is resolved."
  type        = string
  default     = ""
}

variable "ops_instance_type" {
  description = "EC2 instance type for Ops Node"
  type        = string
  default     = "t3.small"
}

variable "app_instance_type" {
  description = "EC2 instance type for App Node"
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

variable "key_name" {
  description = "Name of the EC2 key pair to associate with instances"
  type        = string
}

variable "public_key" {
  description = "Optional public key material for creating a new key pair"
  type        = string
  default     = ""
}

variable "create_key_pair" {
  description = "Whether to create a new aws_key_pair resource using public_key"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}

