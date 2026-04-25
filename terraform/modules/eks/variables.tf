variable "project_name" {
  description = "Name of the project"
  type        = string
}
variable "environment" {
  description = "Deployment environment"
  type        = string
}
variable "vpc_id" {
  description = "VPC ID where the cluster and nodes will be deployed"
  type        = string
}
variable "private_subnet_ids" {
  description = "List of private subnet IDs for the worker nodes and cluster API"
  type        = list(string)
}
variable "public_subnet_ids" {
  description = "List of public subnet IDs (used if EKS needs to place ALB here later)"
  type        = list(string)
}
