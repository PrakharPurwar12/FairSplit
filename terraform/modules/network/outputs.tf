output "vpc_id" {
  description = "The ID of the default VPC being reused"
  value       = data.aws_vpc.default.id
}

output "subnet_id" {
  description = "The ID of the selected public subnet"
  value       = data.aws_subnet.selected.id
}

output "availability_zone" {
  description = "The availability zone of the selected public subnet"
  value       = data.aws_subnet.selected.availability_zone
}

