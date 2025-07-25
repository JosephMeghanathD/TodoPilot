#!/bin/bash

# ==============================================================================
# Build and Deploy Script for Taskpilot Application to Google Cloud Run
#
# USAGE:
#   ./deploy.sh             - Builds and deploys BOTH services.
#   ./deploy.sh user-service   - Builds and deploys ONLY the user-service.
#   ./deploy.sh todolist-service - Builds and deploys ONLY the todolist-service.
#
# PREREQUISITES:
#   - gcloud CLI installed and authenticated (`gcloud auth login`).
#   - Docker installed and running.
#   - Your gcloud project is configured (`gcloud config set project ...`).
#   - The necessary APIs are enabled (run, artifactregistry, secretmanager).
#   - Secrets are created in Secret Manager (neondb-password, etc.).
# ==============================================================================

# --- Configuration ---

# Exit immediately if a command exits with a non-zero status.
set -e

# GCP Project Configuration
# Dynamically gets your configured gcloud project ID.
readonly PROJECT_ID=$(gcloud config get-value project)
readonly REGION="us-central1" # Or your preferred region
readonly REPO_NAME="taskpilot-repo"

# Artifact Registry URL
readonly ARTIFACT_REGISTRY_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}"

# NeonDB Configuration (Replace with your actual details)
readonly NEON_DB_URL="jdbc:postgresql://ep-steep-term-ae0uitxy-pooler.c-2.us-east-2.aws.neon.tech:5432/neondb?sslmode=require&channel_binding=require"
readonly NEON_DB_USER="neondb_owner"

# --- Helper Functions ---

# Function to print colored headers
print_header() {
  echo ""
  echo "============================================================"
  echo "  $1"
  echo "============================================================"
}

# Function to build, tag, and push a Docker image
build_and_push() {
  local service_name=$1
  local image_tag="${ARTIFACT_REGISTRY_URL}/${service_name}:latest"

  print_header "Building and Pushing: ${service_name}"

  echo "Building Docker image from ./${service_name} for linux/amd64 platform"
  # Add the --platform flag to build for Cloud Run's architecture
  docker build --platform linux/amd64 -t "${service_name}" "./${service_name}"

  echo "Tagging image as: ${image_tag}"
  docker tag "${service_name}" "${image_tag}"

  echo "Pushing image to Artifact Registry..."
  docker push "${image_tag}"

  echo "Image for ${service_name} pushed successfully."
}

# Function to deploy the user-service
deploy_user_service() {
  local image_tag="${ARTIFACT_REGISTRY_URL}/user-service:latest"
  print_header "Deploying taskpilot-user-service to Cloud Run"

  gcloud run deploy taskpilot-user-service \
    --image="${image_tag}" \
    --platform=managed \
    --region="${REGION}" \
    --allow-unauthenticated \
    --port=8081 \
    --set-env-vars="SPRING_DATASOURCE_URL=${NEON_DB_URL}" \
    --set-env-vars="SPRING_DATASOURCE_USERNAME=${NEON_DB_USER}" \
    --set-secrets="SPRING_DATASOURCE_PASSWORD=neondb-password:latest" \
    --set-secrets="JWT_SECRET=taskpilot-jwt-secret:latest"

  echo "taskpilot-user-service deployed successfully."
}

# Function to deploy the todolist-service
deploy_todolist_service() {
  local image_tag="${ARTIFACT_REGISTRY_URL}/todolist-service:latest"
  print_header "Deploying taskpilot-todolist-service to Cloud Run"

  gcloud run deploy taskpilot-todolist-service \
    --image="${image_tag}" \
    --platform=managed \
    --region="${REGION}" \
    --allow-unauthenticated \
    --port=8082 \
    --set-env-vars="SPRING_DATASOURCE_URL=${NEON_DB_URL}" \
    --set-env-vars="SPRING_DATASOURCE_USERNAME=${NEON_DB_USER}" \
    --set-env-vars="GEMINI_PROJECT_ID=${PROJECT_ID}" \
    --set-secrets="SPRING_DATASOURCE_PASSWORD=neondb-password:latest" \
    --set-secrets="JWT_SECRET=taskpilot-jwt-secret:latest" \
    --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"

  echo "taskpilot-todolist-service deployed successfully."
}

# --- Main Logic ---
main() {
  # Pre-flight check
  if ! command -v gcloud &> /dev/null || ! command -v docker &> /dev/null; then
    echo "Error: 'gcloud' and 'docker' commands must be installed and in your PATH."
    exit 1
  fi

  # Determine which service to deploy based on the first argument
  # Uses a default value of 'all' if no argument is provided
  local service_to_deploy=${1:-all}

  case "$service_to_deploy" in
    all)
      print_header "Starting full deployment for ALL services"
      build_and_push "user-service"
      build_and_push "todolist-service"
      deploy_user_service
      deploy_todolist_service
      ;;
    user-service)
      print_header "Starting deployment for: user-service"
      build_and_push "user-service"
      deploy_user_service
      ;;
    todolist-service)
      print_header "Starting deployment for: todolist-service"
      build_and_push "todolist-service"
      deploy_todolist_service
      ;;
    *)
      echo "Error: Invalid argument. Use 'user-service', 'todolist-service', or no argument for all."
      exit 1
      ;;
  esac

  print_header "Deployment Complete!"
}

# Pass all script arguments to the main function
main "$@"