# ──────────────────────────────────────────────────────────────
# main.tf — SQS Queues (Main + Dead Letter Queue)
# ──────────────────────────────────────────────────────────────
# Why: SQS enables asynchronous processing between microservices.
# Instead of the backend blocking on tasks like sending emails or
# processing orders, it pushes a message to SQS and continues.
# A separate Worker process consumes the messages independently.
#
# The DLQ catches "poison messages" that fail repeatedly, so they
# don't block the main queue and can be investigated later.
# ──────────────────────────────────────────────────────────────

# 1. Dead Letter Queue (DLQ)
# Messages that fail processing land here after maxReceiveCount retries
resource "aws_sqs_queue" "dlq" {
  name                      = "${var.project_name}-${var.environment}-dlq"
  message_retention_seconds = 1209600 # 14 days — gives time to investigate failures

  tags = {
    Name = "${var.project_name}-${var.environment}-dlq"
  }
}

# 2. Main Processing Queue
resource "aws_sqs_queue" "main" {
  name                       = "${var.project_name}-${var.environment}-queue"
  delay_seconds              = 0
  max_message_size           = 262144 # 256 KB
  message_retention_seconds  = 345600 # 4 days
  visibility_timeout_seconds = 30     # Time a consumer has to process before message reappears

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3 # After 3 failed attempts, send to DLQ
  })

  tags = {
    Name = "${var.project_name}-${var.environment}-queue"
  }
}
