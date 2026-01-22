# Complete Vercel Deployment Guide - Step by Step

This is a complete beginner-friendly guide to deploy your NextGenPhoto application to Vercel.

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] Git repository with your code pushed (GitHub/GitLab/Bitbucket)
- [ ] Vercel account (we'll create one if you don't have it)
- [ ] MongoDB Atlas account (or MongoDB connection string)
- [ ] Gmail account (for SMTP/OTP emails)
- [ ] Razorpay account (for payments)
- [ ] Gemini API key (for image generation)

---

## PART 1: Create Vercel Account & Connect Repository

### Step 1: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** (top right)
3. Choose **"Continue with GitHub"** (recommended) or use email
4. Complete the signup process
5. You'll be redirected to Vercel Dashboard

### Step 2: Verify Your Git Repository

Make sure your code is pushed to GitHub/GitLab/Bitbucket:
- Your repository should have this structure:
  ```
  your-repo/
  ├── components/
  ├── server/
  ├── package.json
  ├── vercel.json
  └── server/vercel.json
  ```

---

## PART 2: Deploy Backend (API Server)

**⚠️ IMPORTANT: Deploy backend FIRST, then frontend!**

### Step 3: Create Backend Project in Vercel

1. In Vercel Dashboard, click **"Add New Project"** button
2. You'll see a list of your Git repositories
3. **Find and click on your repository** (the one with your NextGenPhoto code)
4. Click **"Import"** button

### Step 4: Configure Backend Project Settings

After clicking Import, you'll see project configuration:

1. **Project Name**: 
   - Change to: `nextgenphoto-api` (or any name you like)
   - This will be your backend URL: `nextgenphoto-api.vercel.app`

2. **Framework Preset**: 
   - Click dropdown
   - Select **"Other"**

3. **Root Directory**: 
   - Click **"Override"** button
   - Type: `server`
   - Press Enter
   - ✅ This tells Vercel to use the `server/` folder as the root

4. **Build Command**: 
   - Leave it **EMPTY** (or type: `npm install`)

5. **Output Directory**: 
   - Leave it **EMPTY**

6. **Install Command**: 
   - Should show: `npm install`
   - If not, type: `npm install`

7. Click **"Environment Variables"** section to expand it

### Step 5: Add Backend Environment Variables

Click **"Add"** button for each variable below:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **MONGODB_URI**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/nextgenphoto?retryWrites=true&w=majority`
   - ⚠️ Replace with your actual MongoDB connection string
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `your-very-long-random-string-minimum-32-characters`
   - ⚠️ Generate a long random string (at least 32 characters)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

4. **JWT_EXPIRE**
   - Key: `JWT_EXPIRE`
   - Value: `7d`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

5. **SMTP_HOST**
   - Key: `SMTP_HOST`
   - Value: `smtp.gmail.com`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

6. **SMTP_PORT**
   - Key: `SMTP_PORT`
   - Value: `587`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

7. **SMTP_USER**
   - Key: `SMTP_USER`
   - Value: `your-email@gmail.com`
   - ⚠️ Replace with your Gmail address
   - Environments: ✅ Production, ✅ Preview, ✅ Development

8. **SMTP_PASSWORD**
   - Key: `SMTP_PASSWORD`
   - Value: `your-gmail-app-password`
   - ⚠️ This is NOT your Gmail password! It's an App Password
   - How to get App Password:
     - Go to Google Account → Security → 2-Step Verification → App passwords
     - Generate password for "Mail"
     - Copy and paste here
   - Environments: ✅ Production, ✅ Preview, ✅ Development

9. **SMTP_FROM**
   - Key: `SMTP_FROM`
   - Value: `your-email@gmail.com`
   - ⚠️ Usually same as SMTP_USER
   - Environments: ✅ Production, ✅ Preview, ✅ Development

10. **FRONTEND_URL**
    - Key: `FRONTEND_URL`
    - Value: `https://your-frontend-project.vercel.app`
    - ⚠️ We'll update this after frontend is deployed
    - For now, use a placeholder: `https://nextgenphoto.vercel.app`
    - Environments: ✅ Production, ✅ Preview, ✅ Development

11. **RAZORPAY_KEY_ID**
    - Key: `RAZORPAY_KEY_ID`
    - Value: `your_razorpay_key_id`
    - ⚠️ Get from Razorpay Dashboard → Settings → API Keys
    - Environments: ✅ Production, ✅ Preview, ✅ Development

12. **RAZORPAY_KEY_SECRET**
    - Key: `RAZORPAY_KEY_SECRET`
    - Value: `your_razorpay_key_secret`
    - ⚠️ Get from Razorpay Dashboard → Settings → API Keys
    - Environments: ✅ Production, ✅ Preview, ✅ Development

13. **ADMIN_EMAILS**
    - Key: `ADMIN_EMAILS`
    - Value: `admin@yourdomain.com`
    - ⚠️ Comma-separated list of admin emails
    - Environments: ✅ Production, ✅ Preview, ✅ Development

### Step 6: Deploy Backend

1. After adding all environment variables, scroll down
2. Click **"Deploy"** button (big blue button at bottom)
3. Wait for deployment (usually 1-3 minutes)
4. You'll see build logs in real-time
5. When deployment completes, you'll see:
   - ✅ "Ready" status
   - A URL like: `https://nextgenphoto-api.vercel.app`
6. **⚠️ COPY THIS URL!** You'll need it for frontend configuration
7. Click on the URL to test if backend is working
   - You should see: `{"success":true,"message":"Server is running",...}`

### Step 7: Test Backend Health Check

1. Open the backend URL in browser
2. Add `/health` at the end: `https://your-backend.vercel.app/health`
3. You should see a JSON response with server status
4. If you see an error, check the deployment logs

---

## PART 3: Deploy Frontend (React App)

### Step 8: Create Frontend Project in Vercel

1. In Vercel Dashboard, click **"Add New Project"** again
2. **Select the SAME repository** (yes, same repo as backend!)
3. Click **"Import"**

### Step 9: Configure Frontend Project Settings

1. **Project Name**: 
   - Change to: `nextgenphoto` (or any name)
   - This will be your frontend URL: `nextgenphoto.vercel.app`

2. **Framework Preset**: 
   - Select **"Vite"** from dropdown
   - ✅ Vercel will auto-detect Vite

3. **Root Directory**: 
   - Leave it as **"."** (root - don't override!)
   - ⚠️ This is different from backend!

4. **Build Command**: 
   - Should auto-fill: `npm run build`
   - Or change to: `npm run build:prod`

5. **Output Directory**: 
   - Should auto-fill: `dist`
   - ✅ This is correct

6. **Install Command**: 
   - Should show: `npm install`
   - ✅ This is correct

7. Click **"Environment Variables"** section

### Step 10: Add Frontend Environment Variables

Click **"Add"** for each:

1. **VITE_API_URL** (REQUIRED)
   - Key: `VITE_API_URL`
   - Value: `https://nextgenphoto-api.vercel.app`
   - ⚠️ Use the backend URL you copied in Step 6!
   - If your backend URL is different, use that
   - Environments: ✅ Production, ✅ Preview, ✅ Development

2. **GEMINI_API_KEY** (Optional)
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
   - ⚠️ Get from Google AI Studio
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **VITE_WHATSAPP_NUMBER** (Optional)
   - Key: `VITE_WHATSAPP_NUMBER`
   - Value: `919876543210`
   - ⚠️ Replace with your WhatsApp number (with country code, no +)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### Step 11: Deploy Frontend

1. Scroll down and click **"Deploy"** button
2. Wait for deployment (usually 2-5 minutes)
3. Watch the build logs
4. When complete, you'll see:
   - ✅ "Ready" status
   - A URL like: `https://nextgenphoto.vercel.app`
5. **⚠️ COPY THIS FRONTEND URL!**

### Step 12: Update Backend FRONTEND_URL

Now we need to tell backend about frontend URL:

1. Go back to Vercel Dashboard
2. Find your **Backend Project** (nextgenphoto-api)
3. Click on it
4. Go to **Settings** tab (top menu)
5. Click **"Environment Variables"** (left sidebar)
6. Find `FRONTEND_URL` variable
7. Click the **pencil/edit icon** (or three dots → Edit)
8. Update Value to your frontend URL: `https://nextgenphoto.vercel.app`
9. Click **"Save"**
10. Go to **"Deployments"** tab
11. Find the latest deployment
12. Click **three dots (⋯)** → **"Redeploy"**
13. Confirm redeploy
14. Wait for redeployment to complete

---

## PART 4: Testing & Verification

### Step 13: Test Your Application

1. **Test Frontend:**
   - Open frontend URL: `https://nextgenphoto.vercel.app`
   - Should load the landing page
   - Check browser console (F12) for errors

2. **Test Authentication:**
   - Try to login/signup
   - Check if OTP email is received
   - Verify login works

3. **Test API Connection:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try any action that calls API
   - Check if requests go to: `https://nextgenphoto-api.vercel.app/api/...`
   - Verify no CORS errors

4. **Test Backend Directly:**
   - Visit: `https://nextgenphoto-api.vercel.app/health`
   - Should return JSON with server status

### Step 14: Common Issues & Fixes

#### Issue 1: CORS Error
**Symptom**: Browser console shows CORS error
**Fix**: 
- Go to Backend Project → Environment Variables
- Verify `FRONTEND_URL` matches your frontend URL exactly
- Redeploy backend

#### Issue 2: API Not Found (404)
**Symptom**: API calls return 404
**Fix**:
- Check `VITE_API_URL` in frontend environment variables
- Verify backend URL is correct
- Redeploy frontend

#### Issue 3: Environment Variables Not Working
**Symptom**: App uses default/localhost URLs
**Fix**:
- Verify variables start with `VITE_` for frontend
- Redeploy after adding/changing variables
- Check build logs for errors

#### Issue 4: Build Fails
**Symptom**: Deployment shows error
**Fix**:
- Check build logs in Vercel
- Verify all dependencies in package.json
- Check for TypeScript errors
- Ensure vercel.json files are correct

---

## PART 5: Custom Domain (Optional)

### Step 15: Add Custom Domain to Frontend

1. Go to Frontend Project → Settings → Domains
2. Click **"Add Domain"**
3. Enter your domain: `yourdomain.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take 24-48 hours)

### Step 16: Add Custom Domain to Backend

1. Go to Backend Project → Settings → Domains
2. Click **"Add Domain"**
3. Enter subdomain: `api.yourdomain.com`
4. Follow DNS configuration
5. Update `VITE_API_URL` in frontend to: `https://api.yourdomain.com`
6. Update `FRONTEND_URL` in backend to: `https://yourdomain.com`
7. Redeploy both projects

---

## PART 6: Continuous Deployment Setup

### Step 17: Verify Auto-Deploy

Your projects are already set up for auto-deployment:
- ✅ Every push to main/master branch = Auto deploy
- ✅ Pull requests = Preview deployments

**To test:**
1. Make a small change in your code
2. Commit and push to GitHub
3. Go to Vercel Dashboard
4. You'll see a new deployment starting automatically

---

## Quick Reference: Your URLs

After deployment, you'll have:

- **Frontend**: `https://nextgenphoto.vercel.app`
- **Backend API**: `https://nextgenphoto-api.vercel.app`
- **Health Check**: `https://nextgenphoto-api.vercel.app/health`

---

## Summary Checklist

- [ ] Vercel account created
- [ ] Backend project created with root directory: `server`
- [ ] All backend environment variables added
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend project created with root directory: `.`
- [ ] Frontend environment variables added (including `VITE_API_URL`)
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] Backend `FRONTEND_URL` updated
- [ ] Backend redeployed
- [ ] Application tested and working
- [ ] Custom domain added (optional)

---

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure both projects are using correct root directories
5. Check CORS configuration matches frontend URL

**Congratulations! Your application is now live on Vercel! 🎉**
