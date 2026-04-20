# ──────────────────────────────────────────────────────────────
# providers.tf — AWS Provider Configuration
# ──────────────────────────────────────────────────────────────
# Why: This tells Terraform which cloud provider to use (AWS)
# and which region to deploy resources in. The version constraint
# ensures reproducible builds — important for team work & CI/CD.
# ──────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "SmartShop"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
