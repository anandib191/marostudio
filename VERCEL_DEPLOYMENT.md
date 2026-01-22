# Vercel Deployment Guide

This guide covers deploying NextGenPhoto to Vercel.

> **📖 For Complete Step-by-Step Instructions**: See [VERCEL_STEP_BY_STEP.md](./VERCEL_STEP_BY_STEP.md) - This is a detailed beginner-friendly guide with screenshots descriptions and troubleshooting.

## Prerequisites

- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub/GitLab/Bitbucket repository with your code
- MongoDB Atlas database
- SMTP email credentials
- Razorpay account (for payments)

## Deployment Strategy

Since your repository contains both frontend and server code, you have two options:

### Option 1: Two Separate Vercel Projects (Recommended)
- **Frontend Project**: Deploy root directory as frontend
- **Backend Project**: Deploy `server/` directory as backend API

### Option 2: Single Vercel Project (Monorepo)
- Deploy frontend at root
- Deploy backend as serverless functions (requires code restructuring)

**We'll use Option 1 (Two Separate Projects)** as it's simpler and more maintainable.

## Deployment Steps

### 1. Frontend Deployment (Vercel)

#### Step 1: Create Frontend Project in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project" (again - this is a separate project!)
3. Import the **same** Git repository
4. **Important Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root - don't override)
   - **Build Command**: `npm run build:prod` or `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Step 2: Set Frontend Environment Variables
In the frontend project settings → Environment Variables, add:

**Required:**
```
VITE_API_URL=https://your-backend-project.vercel.app
```
*(Use the backend URL you copied in Step 1.3)*

**Optional:**
```
GEMINI_API_KEY=your_gemini_api_key
VITE_WHATSAPP_NUMBER=919876543210
```

#### Step 3: Deploy Frontend
1. Click "Deploy"
2. Wait for deployment
3. **Copy the frontend URL** (e.g., `https://nextgenphoto.vercel.app`)

#### Step 4: Update Backend FRONTEND_URL
1. Go back to your **Backend Project** in Vercel
2. Settings → Environment Variables
3. Update `FRONTEND_URL` with your frontend URL:
   ```
   FRONTEND_URL=https://your-frontend-project.vercel.app
   ```
4. Redeploy backend (or it will auto-redeploy)

## Project Structure on Vercel

After deployment, you'll have:

- **Frontend Project**: `https://your-frontend.vercel.app`
  - Serves the React app from `dist/` folder
  - Root directory: `.` (project root)
  
- **Backend Project**: `https://your-backend.vercel.app`
  - Serves the Express API
  - Root directory: `server/`
  - All API routes work: `/api/auth`, `/api/admin`, etc.

## Environment Variables Summary

### Frontend Project (Vercel Environment Variables)
Go to: Frontend Project → Settings → Environment Variables

```env
VITE_API_URL=https://your-backend-project.vercel.app
GEMINI_API_KEY=your_gemini_api_key (optional)
VITE_WHATSAPP_NUMBER=919876543210 (optional)
```

### Backend Project (Vercel Environment Variables)
Go to: Backend Project → Settings → Environment Variables

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgenphoto?retryWrites=true&w=majority
JWT_SECRET=your_very_long_secret_minimum_32_characters
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM=your_email@gmail.com
FRONTEND_URL=https://your-frontend-project.vercel.app
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
ADMIN_EMAILS=admin@yourdomain.com
```

## Important Notes

1. **Two Separate Projects**: You need to create TWO projects in Vercel:
   - One for frontend (root directory)
   - One for backend (server directory)

2. **Backend First**: Always deploy backend first, then use its URL in frontend's `VITE_API_URL`

3. **Root Directory**: 
   - Frontend: `.` (root)
   - Backend: `server` (must specify!)

4. **vercel.json**: 
   - Frontend: Already created at root
   - Backend: Already created in `server/` folder

5. **Same Repository**: Both projects can use the same Git repository, just different root directories

## Custom Domain Setup

### Frontend Custom Domain
1. Go to Vercel Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Backend Custom Domain (if on Vercel)
1. Same process as frontend
2. Update `FRONTEND_URL` in backend environment variables
3. Update `VITE_API_URL` in frontend environment variables

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend `FRONTEND_URL` points to frontend
- [ ] CORS is configured correctly in backend
- [ ] Environment variables are set in both projects
- [ ] Test authentication flow
- [ ] Test payment integration
- [ ] Test admin dashboard access
- [ ] Verify email sending works

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check CORS configuration in `server/server.js`

### API Not Found
- Verify `VITE_API_URL` is set correctly
- Check backend is running and accessible
- Verify backend routes are working

### Environment Variables Not Working
- Ensure variables start with `VITE_` for frontend
- Redeploy after adding/changing environment variables
- Check Vercel build logs for errors

## Continuous Deployment

Once connected to Git:
- Every push to main branch auto-deploys
- Preview deployments for pull requests
- Environment variables persist across deployments

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
