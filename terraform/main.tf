# ──────────────────────────────────────────────────────────────
# main.tf — Root Module Orchestrator
# ──────────────────────────────────────────────────────────────
# This file calls the child modules (VPC, EKS, SQS, etc.)
# We'll add module blocks here in Steps 3, 4, and 5.
# ──────────────────────────────────────────────────────────────

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
