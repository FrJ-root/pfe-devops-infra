# ──────────────────────────────────────────────────────────────
# outputs.tf — CloudWatch Module Outputs
# ──────────────────────────────────────────────────────────────

output "backend_log_group_name" {
  description = "CloudWatch Log Group name for the backend"
  value       = aws_cloudwatch_log_group.backend.name
}

output "frontend_log_group_name" {
  description = "CloudWatch Log Group name for the frontend"
  value       = aws_cloudwatch_log_group.frontend.name
}

output "eks_log_group_name" {
  description = "CloudWatch Log Group name for EKS"
  value       = aws_cloudwatch_log_group.eks.name
}
