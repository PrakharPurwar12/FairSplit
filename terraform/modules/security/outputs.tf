output "ops_security_group_id" {
  description = "Security group ID for Ops Node"
  value       = aws_security_group.ops.id
}

output "app_security_group_id" {
  description = "Security group ID for App Node"
  value       = aws_security_group.app.id
}

