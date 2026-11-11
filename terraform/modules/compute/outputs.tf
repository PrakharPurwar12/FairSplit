output "ops_instance_id" {
  description = "The EC2 instance ID of the Ops Node"
  value       = aws_instance.ops_node.id
}

output "ops_public_ip" {
  description = "Public IP address of the Ops Node"
  value       = aws_instance.ops_node.public_ip
}

output "ops_private_ip" {
  description = "Private IP address of the Ops Node"
  value       = aws_instance.ops_node.private_ip
}

output "app_instance_id" {
  description = "The EC2 instance ID of the App Node"
  value       = aws_instance.app_node.id
}

output "app_public_ip" {
  description = "Public IP address of the App Node"
  value       = aws_instance.app_node.public_ip
}

output "app_private_ip" {
  description = "Private IP address of the App Node"
  value       = aws_instance.app_node.private_ip
}

