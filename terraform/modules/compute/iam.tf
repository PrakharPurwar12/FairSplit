# ==============================================================================
# AWS Systems Manager (SSM) Session Manager IAM Configuration for Ops Node
# ==============================================================================

# EC2 Assume Role Trust Policy Document
data "aws_iam_policy_document" "ops_ec2_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

# EC2-trusted IAM Role for Ops Node
resource "aws_iam_role" "ops_ssm_role" {
  name               = "${var.project_name}-${var.environment}-ops-ssm-role"
  description        = "EC2 service role for FairSplit Ops node SSM Session Manager access"
  assume_role_policy = data.aws_iam_policy_document.ops_ec2_assume_role.json

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-ops-ssm-role"
    Role = "ops-ssm"
  })
}

# Attach AWS managed policy AmazonSSMManagedInstanceCore (least privilege for SSM Session Manager)
resource "aws_iam_role_policy_attachment" "ops_ssm_managed_policy" {
  role       = aws_iam_role.ops_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# IAM Instance Profile for Ops Node
resource "aws_iam_instance_profile" "ops_instance_profile" {
  name = "${var.project_name}-${var.environment}-ops-ssm-profile"
  role = aws_iam_role.ops_ssm_role.name

  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-ops-ssm-profile"
  })
}
