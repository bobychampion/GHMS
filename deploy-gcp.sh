#!/bin/bash

# Google Cloud Deployment Script for Godatin Hotel Management System
# Make sure you have gcloud CLI installed and authenticated

# Configuration
PROJECT_ID="your-gcp-project-id"
SERVICE_NAME="godatin-hotel-management"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting deployment to Google Cloud Run..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image
echo "🏗️ Building Docker image..."
gcloud builds submit --tag $IMAGE_NAME .

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 3000 \
    --memory 2Gi \
    --cpu 2 \
    --max-instances 10 \
    --min-instances 0 \
    --timeout 300 \
    --set-env-vars NODE_ENV=production,PORT=3000

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo "✅ Deployment complete!"
echo "🌐 Your app is available at: $SERVICE_URL"
echo ""
echo "📋 Next steps:"
echo "1. Initialize the database: curl -X POST $SERVICE_URL/api/init"
echo "2. Test admin login: $SERVICE_URL/admin/login"
echo "3. Configure custom domain in Cloud Run console"
echo ""
echo "🔧 To update environment variables:"
echo "   gcloud run services update $SERVICE_NAME --region=$REGION --update-env-vars KEY=VALUE"
