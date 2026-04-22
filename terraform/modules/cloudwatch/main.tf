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

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}-dashboard"

  dashboard_body = <<EOF
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "ContainerInsights", "node_cpu_utilization", "ClusterName", "smartshop-dev-cluster" ]
        ],
        "period": 300,
        "stat": "Average",
        "region": "eu-west-1",
        "title": "EKS Cluster CPU Utilization"
      }
    },
    {
      "type": "metric",
      "x": 12,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "ContainerInsights", "node_memory_utilization", "ClusterName", "smartshop-dev-cluster" ]
        ],
        "period": 300,
        "stat": "Average",
        "region": "eu-west-1",
        "title": "EKS Cluster Memory Utilization"
      }
    }
  ]
}
EOF
}

resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "node_cpu_utilization"
  namespace           = "ContainerInsights"
  period              = 120
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "This alarm fires if EKS node CPU is too high"

  dimensions = {
    ClusterName = "smartshop-dev-cluster"
  }
}
