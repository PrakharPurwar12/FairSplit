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
  iam_instance_profile        = aws_iam_instance_profile.ops_instance_profile.name
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

              # Ensure AWS Systems Manager (SSM) Agent is installed and running
              if ! systemctl is-active --quiet snap.amazon-ssm-agent.amazon-ssm-agent.service && ! systemctl is-active --quiet amazon-ssm-agent; then
                  if command -v snap >/dev/null 2>&1; then
                      snap install amazon-ssm-agent --classic || true
                      systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service || true
                      systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service || true
                  fi
                  if ! systemctl is-active --quiet snap.amazon-ssm-agent.amazon-ssm-agent.service && ! systemctl is-active --quiet amazon-ssm-agent; then
                      IMDS_TOKEN="$(curl -s -f -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60" 2>/dev/null || true)"
                      if [ -n "$IMDS_TOKEN" ]; then
                          REGION="$(curl -s -f -H "X-aws-ec2-metadata-token: $IMDS_TOKEN" http://169.254.169.254/latest/meta-data/placement/region 2>/dev/null || echo 'ap-south-1')"
                      else
                          REGION="$(curl -s -f http://169.254.169.254/latest/meta-data/placement/region 2>/dev/null || echo 'ap-south-1')"
                      fi
                      mkdir -p /tmp/ssm_install
                      if curl -s -f -L "https://amazon-ssm-$REGION.s3.$REGION.amazonaws.com/latest/debian_amd64/amazon-ssm-agent.deb" -o /tmp/ssm_install/amazon-ssm-agent.deb; then
                          dpkg -i /tmp/ssm_install/amazon-ssm-agent.deb || apt-get install -f -y || true
                          systemctl enable amazon-ssm-agent || true
                          systemctl start amazon-ssm-agent || true
                      fi
                      rm -rf /tmp/ssm_install
                  fi
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

