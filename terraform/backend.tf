# ──────────────────────────────────────────────────────────────
# backend.tf — Terraform Remote State Configuration
# ──────────────────────────────────────────────────────────────
# Why: Instead of storing the state file locally (risky — can be
# lost or cause conflicts), we store it in S3 with DynamoDB
# locking. This is the industry-standard approach for production.
#
# - S3: stores the terraform.tfstate file with versioning
# - DynamoDB: prevents two people from running apply at once
# - Encryption: state can contain sensitive values (passwords, etc.)
# ──────────────────────────────────────────────────────────────

terraform {
  backend "s3" {
    bucket         = "smartshop-terraform-state"
    key            = "infra/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "smartshop-terraform-lock"
    encrypt        = true
  }
}
