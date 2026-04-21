# ──────────────────────────────────────────────────────────────
# main.tf — EKS Cluster and Managed Node Group
# ──────────────────────────────────────────────────────────────

# 1. The EKS Cluster (Control Plane)
resource "aws_eks_cluster" "main" {
  name     = "${var.project_name}-${var.environment}-cluster"
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    # We provide ALL subnets (public and private) so EKS has max flexibility to map AZs
    # but the API endpoint stays secure.
    subnet_ids = concat(var.private_subnet_ids, var.public_subnet_ids)

    # API Endpoint configuration
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  # Ensure IAM Role permissions are created before and deleted after EKS Cluster handling.
  # Otherwise, EKS will not be able to properly delete EKS managed EC2 infrastructure.
  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy
  ]
}

# 2. The Managed Node Group (Worker Nodes)
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.project_name}-${var.environment}-ng-1"
  node_role_arn   = aws_iam_role.node.arn

  # Security Best Practice: Placing worker nodes ONLY in private subnets!
  subnet_ids = var.private_subnet_ids

  capacity_type  = "ON_DEMAND"
  instance_types = ["t3.small"] # t3.small — Free Tier eligible (2 vCPU, 2GB RAM)

  scaling_config {
    desired_size = 2
    min_size     = 1
    max_size     = 3
  }

  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
  ]
}
