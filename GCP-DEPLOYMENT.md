# Google Cloud Platform Deployment Guide

## 🚀 Deploy Your Hotel Booking App to Google Cloud

### Prerequisites

1. **Google Cloud Account**
   - Sign up at [cloud.google.com](https://cloud.google.com)
   - Get $300 free credits for new accounts

2. **Install Google Cloud CLI**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

3. **Authenticate**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "New Project"
3. Name: `godatin-hotel-management`
4. Click "Create"

### Step 2: Configure Your Project

```bash
# Replace with your actual project ID
export PROJECT_ID="your-project-id-here"
gcloud config set project $PROJECT_ID
```

### Step 3: Deploy Your App

```bash
# Make the script executable
chmod +x deploy-gcp.sh

# Edit the script to add your project ID
nano deploy-gcp.sh

# Run the deployment
./deploy-gcp.sh
```

### Step 4: Initialize Database

After deployment, initialize your database:
```bash
# Get your service URL
SERVICE_URL=$(gcloud run services describe godatin-hotel-management --region=us-central1 --format='value(status.url)')

# Initialize database
curl -X POST $SERVICE_URL/api/init
```

### Step 5: Configure Custom Domain

1. **In Google Cloud Console:**
   - Go to Cloud Run → Your Service
   - Click "Manage Custom Domains"
   - Add your domain

2. **Update DNS Records:**
   ```
   Type: CNAME
   Name: www
   Value: ghs.googlehosted.com
   
   Type: A
   Name: @
   Value: [IP provided by Google]
   ```

3. **Update Environment Variables:**
   ```bash
   gcloud run services update godatin-hotel-management \
     --region=us-central1 \
     --update-env-vars NEXTAUTH_URL=https://yourdomain.com
   ```

## 💰 Cost Breakdown

| Service | Cost | Purpose |
|---------|------|---------|
| Cloud Run | $0.40/million requests | App hosting |
| Cloud Build | $0.003/minute | Docker builds |
| Container Registry | $0.10/GB/month | Image storage |
| Load Balancer | $18/month | Custom domain |
| **Total** | **~$20-50/month** | Complete hosting |

## 🔧 Management Commands

```bash
# View logs
gcloud run services logs read godatin-hotel-management --region=us-central1

# Update environment variables
gcloud run services update godatin-hotel-management \
  --region=us-central1 \
  --update-env-vars KEY=VALUE

# Scale service
gcloud run services update godatin-hotel-management \
  --region=us-central1 \
  --min-instances=1 \
  --max-instances=10

# Redeploy
./deploy-gcp.sh
```

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Dockerfile syntax
   - Ensure all dependencies are in package.json

2. **Service Won't Start:**
   - Check environment variables
   - Verify MongoDB connection string

3. **Custom Domain Issues:**
   - Wait 24-48 hours for DNS propagation
   - Check SSL certificate status

### Support:
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js on Google Cloud](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nextjs)
