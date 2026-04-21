# ──────────────────────────────────────────────────────────────
# main.tf — CloudWatch Log Groups
# ──────────────────────────────────────────────────────────────
# Why: Centralized logging is essential for debugging in production.
# Instead of SSHing into individual containers (which is impossible
# in EKS private subnets), we send all logs to CloudWatch where
# they can be searched, filtered, and alerted on from the console.
#
# Each application component gets its own Log Group for clean
# separation and independent retention policies.
# ──────────────────────────────────────────────────────────────

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/${var.project_name}/${var.environment}/backend"
  retention_in_days = 30

  tags = {
    Name      = "${var.project_name}-${var.environment}-backend-logs"
    Component = "backend"
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/${var.project_name}/${var.environment}/frontend"
  retention_in_days = 30

  tags = {
    Name      = "${var.project_name}-${var.environment}-frontend-logs"
    Component = "frontend"
  }
}

resource "aws_cloudwatch_log_group" "eks" {
  name              = "/${var.project_name}/${var.environment}/eks"
  retention_in_days = 30

  tags = {
    Name      = "${var.project_name}-${var.environment}-eks-logs"
    Component = "eks"
  }
}
