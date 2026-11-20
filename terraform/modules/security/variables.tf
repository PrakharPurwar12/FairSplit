variable "vpc_id" {
  description = "VPC ID where security groups will be created"
  type        = string
}

variable "project_name" {
  description = "Project name prefix"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "admin_ip_cidr" {
  description = "Admin IP CIDR block allowed for SSH (port 22) and Nagios dashboard (port 80). Must NOT be 0.0.0.0/0."
  type        = string

  validation {
    condition     = var.admin_ip_cidr != "0.0.0.0/0"
    error_message = "admin_ip_cidr must not be 0.0.0.0/0 to prevent public inbound exposure on administrative ports."
  }

  validation {
    condition     = can(cidrnetmask(var.admin_ip_cidr))
    error_message = "admin_ip_cidr must be a valid IPv4 CIDR block (e.g. 203.0.113.50/32)."
  }
}

variable "tags" {
  description = "Common resource tags"
  type        = map(string)
  default     = {}
}

