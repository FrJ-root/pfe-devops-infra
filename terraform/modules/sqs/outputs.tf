# ──────────────────────────────────────────────────────────────
# outputs.tf — SQS Module Outputs
# ──────────────────────────────────────────────────────────────

output "queue_url" {
  description = "URL of the main SQS queue (used by the application)"
  value       = aws_sqs_queue.main.url
}

output "queue_arn" {
  description = "ARN of the main SQS queue (used for IAM policies)"
  value       = aws_sqs_queue.main.arn
}

output "dlq_url" {
  description = "URL of the Dead Letter Queue"
  value       = aws_sqs_queue.dlq.url
}

output "dlq_arn" {
  description = "ARN of the Dead Letter Queue"
  value       = aws_sqs_queue.dlq.arn
}
