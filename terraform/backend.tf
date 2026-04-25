terraform {
  backend "s3" {
    bucket         = "smartshop-terraform-state"
    key            = "infra/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "smartshop-terraform-lock"
    encrypt        = true
  }
}
