variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-west-1"
}
variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}
variable "project_name" {
  description = "Name of the project — used for naming and tagging"
  type        = string
  default     = "smartshop"
}
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}
variable "availability_zones" {
  description = "List of AZs to use (EKS requires at least 2)"
  type        = list(string)
  default     = ["eu-west-1a", "eu-west-1b"]
}
