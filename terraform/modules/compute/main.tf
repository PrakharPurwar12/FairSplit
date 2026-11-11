data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_key_pair" "fairsplit" {
  count      = var.create_key_pair && var.public_key != "" ? 1 : 0
  key_name   = var.key_name
  public_key = var.public_key

  tags = merge(var.tags, {
    Name = var.key_name
  })
}

locals {
  resolved_ami_id   = var.ami_id != "" ? var.ami_id : data.aws_ami.ubuntu.id
  resolved_key_name = var.create_key_pair && var.public_key != "" ? aws_key_pair.fairsplit[0].key_name : var.key_name
}

# ==============================================================================
# Ops Node: Puppet Server, Ansible Control Node, Nagios Core
# ==============================================================================
resource "aws_instance" "ops_node" {
  ami                         = local.resolved_ami_id
  instance_type               = var.ops_instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.ops_security_group_id]
  key_name                    = local.resolved_key_name
  associate_public_ip_address = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.ops_volume_size
    delete_on_termination = true

    tags = merge(var.tags, {
      Name = "${var.project_name}-${var.environment}-ops-root-vol"
    })
  }

  user_data = <<-EOF
              #!/bin/bash
              set -e
              hostnamectl set-hostname fairsplit-ops
              echo "127.0.0.1 fairsplit-ops" >> /etc/hosts

              # Configure 2GB swap space for Puppet Server JVM stability
              if [ ! -f /swapfile ]; then
                  fallocate -l 2G /swapfile
                  chmod 600 /swapfile
                  mkswap /swapfile
                  swapon /swapfile
                  echo '/swapfile none swap sw 0 0' >> /etc/fstab
              fi
              EOF

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-ops-node"
    Role = "ops"
  })
}

# ==============================================================================
# App Node: Docker Compose (Nginx, Django/Gunicorn, PostgreSQL)
# ==============================================================================
resource "aws_instance" "app_node" {
  ami                         = local.resolved_ami_id
  instance_type               = var.app_instance_type
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [var.app_security_group_id]
  key_name                    = local.resolved_key_name
  associate_public_ip_address = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.app_volume_size
    delete_on_termination = true

    tags = merge(var.tags, {
      Name = "${var.project_name}-${var.environment}-app-root-vol"
    })
  }

  user_data = <<-EOF
              #!/bin/bash
              set -e
              hostnamectl set-hostname fairsplit-app
              echo "127.0.0.1 fairsplit-app" >> /etc/hosts
              EOF

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-app-node"
    Role = "app"
  })
}

