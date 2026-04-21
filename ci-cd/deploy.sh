#!/bin/bash
# ==============================================================================
# SmartShop Local CI/CD Pipeline
# Simplistic deployment script simulating Jenkins/GitHub Actions on the local VM.
# ==============================================================================

set -e # Exit immediately if a command exits with a non-zero status

# Configuration
REGION="eu-west-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_BASE="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

BACKEND_REPO="smartshop-backend"
FRONTEND_REPO="smartshop-frontend"

# We use the short git commit hash as the tag to ensure unique versions
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")
TAG="${COMMIT_HASH}-$(date +%s)"

echo "🚀 Starting CI/CD Pipeline for tag: $TAG"

# 1. AWS ECR Login
echo "🔑 Logging into AWS ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_BASE

# 2. Build and Push Backend
echo "📦 Building Backend Image..."
cd ../../SmartShop # Going from pfe-devops-infra/ci-cd to SmartShop
docker build -t ${BACKEND_REPO}:${TAG} .
docker tag ${BACKEND_REPO}:${TAG} ${ECR_BASE}/${BACKEND_REPO}:${TAG}

echo "☁️ Pushing Backend Image to ECR..."
docker push ${ECR_BASE}/${BACKEND_REPO}:${TAG}

# 3. Build and Push Frontend
echo "📦 Building Frontend Image..."
cd ../SmartShop-frontend # Going from SmartShop to SmartShop-frontend
# Since vite builds for browser, the VITE_API_URL should be the ALB url or host! 
# We'll build with default production env.
docker build -t ${FRONTEND_REPO}:${TAG} .
docker tag ${FRONTEND_REPO}:${TAG} ${ECR_BASE}/${FRONTEND_REPO}:${TAG}

echo "☁️ Pushing Frontend Image to ECR..."
docker push ${ECR_BASE}/${FRONTEND_REPO}:${TAG}

# 4. Deploy to EKS
echo "☸️ Updating Kubernetes Deployments..."
cd ../pfe-devops-infra/k8s # Go back to infrastructure k8s dir

# Tell Kubernetes to use the new exact images
kubectl set image deployment/smartshop-backend backend=${ECR_BASE}/${BACKEND_REPO}:${TAG} -n smartshop
kubectl set image deployment/smartshop-frontend frontend=${ECR_BASE}/${FRONTEND_REPO}:${TAG} -n smartshop

# 5. Verify Rollout
echo "⏳ Waiting for Kubernetes rollout to finish..."
kubectl rollout status deployment/smartshop-backend -n smartshop
kubectl rollout status deployment/smartshop-frontend -n smartshop

echo "✅ CI/CD Pipeline Completed Successfully! The applications are LIVE!"
