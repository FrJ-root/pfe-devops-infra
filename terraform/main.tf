module "vpc" {
  source = "./modules/vpc"
  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
}
module "eks" {
  source = "./modules/eks"
  project_name       = var.project_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids
}
module "sqs" {
  source = "./modules/sqs"
  project_name = var.project_name
  environment  = var.environment
}
module "cloudwatch" {
  source = "./modules/cloudwatch"
  project_name = var.project_name
  environment  = var.environment
}
module "ecr" {
  source = "./modules/ecr"
  project_name = var.project_name
  environment  = var.environment
}
