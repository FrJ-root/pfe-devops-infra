# ──────────────────────────────────────────────────────────────
# outputs.tf — Root-Level Outputs
# ──────────────────────────────────────────────────────────────
# Outputs are printed after `terraform apply` and can be
# queried with `terraform output`. We'll populate this as we
# add modules (VPC IDs, EKS endpoint, SQS URL, etc.)
# ──────────────────────────────────────────────────────────────

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "Public Subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private Subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "eks_cluster_name" {
  description = "EKS Cluster Name"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "EKS Cluster Endpoint URL"
  value       = module.eks.cluster_endpoint
}

output "configure_kubectl" {
  description = "Command to run to configure kubectl"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "sqs_queue_url" {
  description = "SQS Main Queue URL"
  value       = module.sqs.queue_url
}

output "sqs_dlq_url" {
  description = "SQS Dead Letter Queue URL"
  value       = module.sqs.dlq_url
}

output "cloudwatch_backend_log_group" {
  description = "CloudWatch Log Group for Backend"
  value       = module.cloudwatch.backend_log_group_name
}

output "cloudwatch_frontend_log_group" {
  description = "CloudWatch Log Group for Frontend"
  value       = module.cloudwatch.frontend_log_group_name
}

output "ecr_backend_repository_url" {
  description = "Backend ECR Repository URL"
  value       = module.ecr.backend_repository_url
}

output "ecr_frontend_repository_url" {
  description = "Frontend ECR Repository URL"
  value       = module.ecr.frontend_repository_url
}
