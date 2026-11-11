module "network" {
  source = "./modules/network"

  vpc_id    = var.vpc_id
  subnet_id = var.subnet_id
}

module "security" {
  source = "./modules/security"

  vpc_id        = module.network.vpc_id
  project_name  = var.project_name
  environment   = var.environment
  admin_ip_cidr = var.admin_ip_cidr

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

module "compute" {
  source = "./modules/compute"

  project_name          = var.project_name
  environment           = var.environment
  subnet_id             = module.network.subnet_id
  ops_security_group_id = module.security.ops_security_group_id
  app_security_group_id = module.security.app_security_group_id
  ami_id                = var.ami_id
  ops_instance_type     = var.ops_instance_type
  app_instance_type     = var.app_instance_type
  ops_volume_size       = var.ops_volume_size
  app_volume_size       = var.app_volume_size
  key_name              = var.key_name
  public_key            = var.public_key
  create_key_pair       = var.create_key_pair

  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/templates/inventory.tpl", {
    ops_public_ip  = module.compute.ops_public_ip
    ops_private_ip = module.compute.ops_private_ip
    app_public_ip  = module.compute.app_public_ip
    app_private_ip = module.compute.app_private_ip
    ssh_key_path   = var.ssh_key_path
  })
  filename        = "${path.module}/../ansible/inventory/hosts.ini"
  file_permission = "0644"
}

