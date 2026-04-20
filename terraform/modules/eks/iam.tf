# ──────────────────────────────────────────────────────────────
# iam.tf — IAM Roles & Policies for EKS
# ──────────────────────────────────────────────────────────────
# Why: EKS needs permissions for two main entities:
# 1. The Control Plane (managing ELBs, ENIs across AWS)
# 2. The Worker Nodes (pulling images, assigning Pod IPs, logging)
# ──────────────────────────────────────────────────────────────

# ==========================================
# 1. Cluster IAM Role (Control Plane)
# ==========================================
resource "aws_iam_role" "cluster" {
  name = "${var.project_name}-${var.environment}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}

# Attach the standard AmazonEKSClusterPolicy to the role
resource "aws_iam_role_policy_attachment" "cluster_AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.cluster.name
}


# ==========================================
# 2. Node Group IAM Role (Worker Nodes)
# ==========================================
resource "aws_iam_role" "node" {
  name = "${var.project_name}-${var.environment}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

# Grants basic EKS worker node capabilities (e.g., connecting to the cluster endpoint)
resource "aws_iam_role_policy_attachment" "node_AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.node.name
}

# Allows the VPC CNI plugin to manage networking for pods directly on the EC2 ENIs
resource "aws_iam_role_policy_attachment" "node_AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.node.name
}

# Crucial: Allows the nodes to pull Docker images from AWS Elastic Container Registry (ECR)
resource "aws_iam_role_policy_attachment" "node_AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.node.name
}
