# ChatApp Deployment Guide

This guide covers deploying ChatApp to production on Vercel (frontend), Render (backend), and MongoDB Atlas (database).

## Prerequisites

- GitHub account (for code repo)
- Vercel account
- Render account
- MongoDB Atlas account
- Cloudinary account
- Node.js 20+ installed locally

## Step 1: Prepare Your Code

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/chatapp.git
git branch -M main
git push -u origin main
```

### 2. Create environment files

Copy `.env.example` to `.env` in both backend and frontend (for local testing only).

## Step 2: Set Up Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create database user with strong password
4. Whitelist IP (or allow all: `0.0.0.0/0`)
5. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/chatapp?retryWrites=true&w=majority`

## Step 3: Deploy Backend (Render)

### 3.1 Prepare backend for Render

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: chatapp-backend
    runtime: node
    plan: free
    buildCommand: npm ci
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGO_URI
        fromDatabase:
          name: chatapp-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: CLIENT_URLS
        value: https://your-frontend.vercel.app
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false

databases:
  - name: chatapp-db
    plan: free
```

### 3.2 Deploy via Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click `New` → `Web Service`
3. Connect your GitHub repository
4. Select branch (main)
5. Set configuration:
   - **Runtime**: Node
   - **Build**: `npm ci`
   - **Start**: `npm start`
6. Add environment variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
JWT_SECRET=<generate-a-long-random-string>
JWT_REFRESH_SECRET=<generate-another-long-random-string>
CLIENT_URLS=https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

7. Click `Create Web Service`
8. Wait for deployment to complete
9. Note the deployment URL (e.g., `https://chatapp-backend.onrender.com`)

### 3.3 Keep backend alive (optional)

To prevent free tier from going to sleep, use an uptime monitor:

```bash
# Use a cron job service like cron-job.org
curl https://chatapp-backend.onrender.com/health
```

## Step 4: Deploy Frontend (Vercel)

### 4.1 Update environment variables

In your repository, update `frontend/.env.production`:

```env
VITE_API_URL=https://your-chatapp-backend.onrender.com/api
VITE_SOCKET_URL=https://your-chatapp-backend.onrender.com
```

### 4.2 Deploy via Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click `Add New` → `Project`
3. Import your GitHub repository
4. Select `frontend` folder as root directory
5. Set environment variables:

```
VITE_API_URL=https://your-chatapp-backend.onrender.com/api
VITE_SOCKET_URL=https://your-chatapp-backend.onrender.com
```

6. Click `Deploy`
7. Wait for deployment to complete
8. Get your frontend URL (e.g., `https://chatapp.vercel.app`)

### 4.3 Update backend CORS

Update backend `.env` on Render:

```env
CLIENT_URLS=https://chatapp.vercel.app
```

Redeploy backend after updating.

## Step 5: Set Up Cloudinary (Media Uploads)

1. Go to [Cloudinary Dashboard](https://cloudinary.com)
2. Sign up for free account
3. Get credentials:
   - Cloud Name
   - API Key
   - API Secret
4. Add to backend environment variables:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 6: Testing

### Local Testing

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Open http://localhost:5173
```

### Production Testing

1. Visit `https://chatapp.vercel.app`
2. Register a new account
3. Create a chat
4. Send messages (test real-time sync)
5. Upload media (test Cloudinary)
6. Test on mobile: use responsive design

### API Health Checks

```bash
# Check backend health
curl https://your-chatapp-backend.onrender.com/health

# Response should include:
# { "status": "ok", "environment": "production", "services": { "redis": "up" } }
```

## Step 7: Domain Setup (Optional)

### Connect Custom Domain to Vercel

1. In Vercel project settings, go to "Domains"
2. Add your domain
3. Follow DNS instructions (usually CNAME records)

### Connect Custom Domain to Render

1. In Render service settings, go to "Custom Domains"
2. Add your domain
3. Update DNS records as shown

## Troubleshooting

### Backend not connecting to frontend

- Check `CLIENT_URLS` in backend `.env`
- Ensure CORS is properly configured
- Redeploy backend after changing CORS

### Messages not syncing

- Check Socket.IO connection in browser DevTools
- Verify backend health endpoint
- Check browser console for errors

### Media uploads failing

- Verify Cloudinary credentials are correct
- Check Cloudinary account quota
- Ensure API keys haven't expired

### Database connection failing

- Verify MongoDB connection string
- Whitelist deployment IP addresses (or use `0.0.0.0/0`)
- Check MongoDB user permissions

## Monitoring

### Set up logs

- Render: View logs in Dashboard
- Vercel: View logs in Deployment
- Check application errors in browser console

### Set up alerts

Use services like:
- [Uptime Robot](https://uptimerobot.com) for backend health
- [Sentry](https://sentry.io) for error tracking

## Scaling (Future)

When ready to upgrade from free tier:

1. **Backend**: Upgrade Render plan (standard, pro, etc.)
2. **Database**: Upgrade MongoDB Atlas tier
3. **Frontend**: Vercel scales automatically
4. **Cache**: Add Redis for better performance
5. **CDN**: Vercel includes global CDN by default

## Security Checklist

- [ ] Change default JWT secrets
- [ ] Use strong MongoDB passwords
- [ ] Enable IP whitelist in MongoDB
- [ ] Use HTTPS everywhere
- [ ] Enable rate limiting
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Use environment variables for all secrets

## Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/chatapp` |
| `JWT_SECRET` | JWT signing key | Must be long random string |
| `JWT_REFRESH_SECRET` | Refresh token signing key | Must be long random string |
| `CLIENT_URLS` | Frontend URL(s) for CORS | `https://chatapp.vercel.app` |
| `NODE_ENV` | Environment | `production` or `development` |
| `CLOUDINARY_*` | Media upload credentials | From Cloudinary dashboard |
| `VITE_API_URL` | Backend API URL | `https://backend.onrender.com/api` |
| `VITE_SOCKET_URL` | WebSocket URL | `https://backend.onrender.com` |

## Support

For issues:
1. Check logs in deployment platform
2. Verify environment variables
3. Test locally with `npm run dev:*`
4. Check GitHub issues for similar problems
