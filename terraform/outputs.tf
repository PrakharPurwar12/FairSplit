output "vpc_id" {
  description = "The ID of the default VPC being reused"
  value       = module.network.vpc_id
}

output "subnet_id" {
  description = "The ID of the public subnet where nodes are deployed"
  value       = module.network.subnet_id
}

output "ops_instance_id" {
  description = "The EC2 instance ID of the Ops Node"
  value       = module.compute.ops_instance_id
}

output "ops_public_ip" {
  description = "Public IP address of the Ops Node"
  value       = module.compute.ops_public_ip
}

output "ops_private_ip" {
  description = "Private IP address of the Ops Node (used for internal Puppet/NRPE traffic)"
  value       = module.compute.ops_private_ip
}

output "app_instance_id" {
  description = "The EC2 instance ID of the App Node"
  value       = module.compute.app_instance_id
}

output "app_public_ip" {
  description = "Public IP address of the App Node"
  value       = module.compute.app_public_ip
}

output "app_private_ip" {
  description = "Private IP address of the App Node (used for internal Puppet/NRPE traffic)"
  value       = module.compute.app_private_ip
}

output "nagios_url" {
  description = "Nagios Core Web UI endpoint on the Ops Node"
  value       = "http://${module.compute.ops_public_ip}/nagios"
}

output "fairsplit_app_url" {
  description = "FairSplit web application endpoint on the App Node"
  value       = "http://${module.compute.app_public_ip}"
}

output "ssh_ops_command" {
  description = "Convenience SSH command to connect to the Ops Node"
  value       = "ssh -i ${var.ssh_key_path} ubuntu@${module.compute.ops_public_ip}"
}

output "ssh_app_command" {
  description = "Convenience SSH command to connect to the App Node"
  value       = "ssh -i ${var.ssh_key_path} ubuntu@${module.compute.app_public_ip}"
}

