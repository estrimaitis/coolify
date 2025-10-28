# Coolify Deployment Guide

This guide provides step-by-step instructions for deploying the Survey App on Coolify.

## Overview

This monorepo contains two applications:
- **Frontend**: Next.js application (root directory)
- **Backend**: Express API (server directory)

Each application will be deployed separately to different domains.

## Prerequisites

✅ Coolify instance up and running  
✅ GitHub account with this repository  
✅ Two domains or subdomains configured (e.g., `app.example.com` and `api.example.com`)

## Step 1: Push to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Survey app for Coolify"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy Backend API

### Create Application in Coolify

1. Log in to your Coolify dashboard
2. Click **"+ New"** → **"Application"**
3. Select **"Public Repository"**
4. Enter your GitHub repository URL
5. Click **"Continue"**

### Configure Backend

**General Settings:**
- **Name**: `survey-api` (or your preferred name)
- **Branch**: `main`
- **Build Pack**: `nixpacks`

**Build Settings:**
- **Base Directory**: `server`
- **Publish Directory**: `dist`

**Commands:**
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

**Port:**
- **Port**: `4001`

### Environment Variables

Add the following environment variables:

| Key | Value |
|-----|-------|
| `PORT` | `4001` |
| `CORS_ORIGIN` | `https://your-frontend-domain.com` |

**Note**: Update `CORS_ORIGIN` with your actual frontend domain after setting it up.

### Domain Configuration

1. Click on **"Domains"** tab
2. Add your backend domain (e.g., `api.example.com`)
3. Coolify will automatically provision SSL certificate

### Deploy

Click **"Deploy"** button and wait for the deployment to complete.

### Verify Backend

Once deployed, visit:
- `https://api.example.com/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Survey API is running",
  "timestamp": "..."
}
```

## Step 3: Deploy Frontend

### Create Application in Coolify

1. In Coolify dashboard, click **"+ New"** → **"Application"**
2. Select **"Public Repository"**
3. Use the **same GitHub repository**
4. Click **"Continue"**

### Configure Frontend

**General Settings:**
- **Name**: `survey-frontend` (or your preferred name)
- **Branch**: `main`
- **Build Pack**: `nixpacks`

**Build Settings:**
- **Base Directory**: `.` (root directory)
- **Publish Directory**: `.next`

**Commands:**
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

**Port:**
- **Port**: `4000`

### Environment Variables

Add the following environment variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://api.example.com` |

**Note**: Use your actual backend domain URL (the one you set up in Step 2).

### Domain Configuration

1. Click on **"Domains"** tab
2. Add your frontend domain (e.g., `app.example.com`)
3. Coolify will automatically provision SSL certificate

### Deploy

Click **"Deploy"** button and wait for the deployment to complete.

### Verify Frontend

Once deployed, visit your frontend domain (e.g., `https://app.example.com`).

You should see the survey form.

## Step 4: Update CORS Configuration

Now that both applications are deployed, update the backend's CORS configuration:

1. Go to your backend application in Coolify
2. Navigate to **"Environment Variables"**
3. Update `CORS_ORIGIN` to your actual frontend domain:
   ```
   CORS_ORIGIN=https://app.example.com
   ```
4. **Redeploy** the backend application

## Step 5: Test the Application

1. Visit your frontend domain
2. Fill out the survey form
3. Click "Submit Survey"
4. You should see a success message
5. Check the backend API:
   - `https://api.example.com/api/survey/responses` - See all responses
   - `https://api.example.com/api/survey/stats` - See statistics

## Coolify Configuration Summary

### Backend Application

| Setting | Value |
|---------|-------|
| Base Directory | `server` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Port | `4001` |
| Env: PORT | `4001` |
| Env: CORS_ORIGIN | `https://your-frontend-domain.com` |

### Frontend Application

| Setting | Value |
|---------|-------|
| Base Directory | `.` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Port | `4000` |
| Env: NEXT_PUBLIC_API_URL | `https://your-backend-domain.com` |

## Troubleshooting

### Issue: Frontend shows "Failed to submit survey"

**Solution:**
1. Check browser console for CORS errors
2. Verify `CORS_ORIGIN` in backend includes your frontend domain
3. Ensure both apps are deployed and running
4. Check backend logs in Coolify dashboard

### Issue: Build fails in Coolify

**Solution:**
1. Check build logs in Coolify dashboard
2. Verify Base Directory is correct
3. Ensure all dependencies are in package.json
4. Check that Node.js version is compatible (18+)

### Issue: 502 Bad Gateway

**Solution:**
1. Check if the application is running (view logs)
2. Verify the port configuration matches the application
3. Restart the application in Coolify

### Issue: Environment variables not working

**Solution:**
1. Ensure environment variables are set in Coolify dashboard
2. For frontend vars, they must start with `NEXT_PUBLIC_`
3. Redeploy after changing environment variables

## Updating the Application

To deploy updates:

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Update application"
   git push
   ```

2. In Coolify dashboard:
   - Navigate to your application
   - Click **"Redeploy"** or enable auto-deploy from GitHub

## Auto-Deploy Setup

To enable automatic deployments:

1. In Coolify, go to your application
2. Navigate to **"Settings"** → **"Auto Deploy"**
3. Enable **"Deploy on commit"**
4. Coolify will now automatically deploy when you push to the configured branch

## Monitoring

Coolify provides:
- **Real-time logs**: View application logs in the dashboard
- **Metrics**: CPU, memory, and network usage
- **Health checks**: Automatic health monitoring
- **Alerts**: Configure notifications for downtime

## Production Considerations

Before going to production, consider:

1. **Database**: Replace in-memory storage with a proper database
2. **Logging**: Implement proper logging (e.g., Winston, Pino)
3. **Error Tracking**: Add error tracking (e.g., Sentry)
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Validation**: Add request validation
6. **Security Headers**: Configure security headers
7. **Backups**: Set up regular backups
8. **Monitoring**: Set up uptime monitoring

## Support

For Coolify-specific issues, check:
- [Coolify Documentation](https://coolify.io/docs)
- [Coolify Discord](https://discord.gg/coolify)
- [Coolify GitHub](https://github.com/coollabsio/coolify)

---

**Happy Deploying! 🚀**

