data "aws_vpc" "default" {
  default = var.vpc_id == "" ? true : null
  id      = var.vpc_id != "" ? var.vpc_id : null
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_subnet" "selected" {
  id = var.subnet_id != "" ? var.subnet_id : tolist(data.aws_subnets.default.ids)[0]
}

