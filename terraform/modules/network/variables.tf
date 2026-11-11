variable "vpc_id" {
  description = "Existing VPC ID to reuse. If omitted, default VPC is queried."
  type        = string
  default     = ""
}

variable "subnet_id" {
  description = "Existing subnet ID to deploy nodes into. If omitted, the first default VPC subnet is used."
  type        = string
  default     = ""
}

