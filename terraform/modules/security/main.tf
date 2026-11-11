resource "aws_security_group" "ops" {
  name        = "${var.project_name}-${var.environment}-ops-sg"
  description = "Security group for FairSplit Ops Node (Puppet Server, Ansible, Nagios)"
  vpc_id      = var.vpc_id

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-ops-sg"
    Role = "ops-security-group"
  })
}

resource "aws_security_group" "app" {
  name        = "${var.project_name}-${var.environment}-app-sg"
  description = "Security group for FairSplit App Node (Docker Compose, Nginx, Django, PostgreSQL)"
  vpc_id      = var.vpc_id

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-app-sg"
    Role = "app-security-group"
  })
}

# ==============================================================================
# Ops Node Security Group Rules
# ==============================================================================

# SSH (22) restricted to administrator IP
resource "aws_security_group_rule" "ops_ingress_ssh" {
  type              = "ingress"
  security_group_id = aws_security_group.ops.id
  description       = "SSH access to Ops Node restricted to administrator IP"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = [var.admin_ip_cidr]
}

# Nagios Dashboard (80) restricted to administrator IP
resource "aws_security_group_rule" "ops_ingress_nagios" {
  type              = "ingress"
  security_group_id = aws_security_group.ops.id
  description       = "Nagios web dashboard restricted to administrator IP"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = [var.admin_ip_cidr]
}

# Puppet Server (8140) only from App Node
resource "aws_security_group_rule" "ops_ingress_puppet" {
  type                     = "ingress"
  security_group_id        = aws_security_group.ops.id
  description              = "Puppet master catalog compilation from App Node only"
  from_port                = 8140
  to_port                  = 8140
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.app.id
}

# Ops Node Outbound: All allowed
resource "aws_security_group_rule" "ops_egress_all" {
  type              = "egress"
  security_group_id = aws_security_group.ops.id
  description       = "Allow all outbound traffic from Ops Node"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

# ==============================================================================
# App Node Security Group Rules
# ==============================================================================

# Public HTTP (80) access for FairSplit application
resource "aws_security_group_rule" "app_ingress_http" {
  type              = "ingress"
  security_group_id = aws_security_group.app.id
  description       = "Public HTTP access to FairSplit web application via Nginx"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

# SSH (22) from Administrator IP
resource "aws_security_group_rule" "app_ingress_ssh_admin" {
  type              = "ingress"
  security_group_id = aws_security_group.app.id
  description       = "SSH access to App Node restricted to administrator IP"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = [var.admin_ip_cidr]
}

# SSH (22) from Ops Node (for Ansible orchestration)
resource "aws_security_group_rule" "app_ingress_ssh_ops" {
  type                     = "ingress"
  security_group_id        = aws_security_group.app.id
  description              = "SSH access from Ops Node for Ansible deployment and remediation"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ops.id
}

# NRPE (5666) monitoring checks from Ops Node only
resource "aws_security_group_rule" "app_ingress_nrpe" {
  type                     = "ingress"
  security_group_id        = aws_security_group.app.id
  description              = "NRPE monitoring checks from Ops Node Nagios Core"
  from_port                = 5666
  to_port                  = 5666
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ops.id
}

# App Node Outbound: All allowed
resource "aws_security_group_rule" "app_egress_all" {
  type              = "egress"
  security_group_id = aws_security_group.app.id
  description       = "Allow all outbound traffic from App Node"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

