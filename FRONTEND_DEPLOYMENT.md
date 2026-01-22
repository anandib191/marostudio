# Frontend Deployment Guide - Quick Steps

Since your backend is already deployed, follow these steps to deploy the frontend.

## Prerequisites

✅ Backend deployed on Vercel  
✅ Backend URL copied (e.g., `https://nextgenphoto-api.vercel.app`)

---

## Step 1: Create Frontend Project in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** button
3. **Select the SAME Git repository** (yes, same repo as backend!)
4. Click **"Import"**

---

## Step 2: Configure Frontend Project

### Project Settings:

1. **Project Name**: 
   - Enter: `nextgenphoto` (or any name you like)
   - This will be your frontend URL: `nextgenphoto.vercel.app`

2. **Framework Preset**: 
   - Select **"Vite"** from dropdown
   - ✅ Vercel will auto-detect Vite

3. **Root Directory**: 
   - Leave it as **"."** (root - DON'T override!)
   - ⚠️ This is different from backend which uses `server/`

4. **Build Command**: 
   - Should auto-fill: `npm run build`
   - Or change to: `npm run build:prod`

5. **Output Directory**: 
   - Should auto-fill: `dist`
   - ✅ This is correct

6. **Install Command**: 
   - Should show: `npm install`
   - ✅ This is correct

---

## Step 3: Add Frontend Environment Variables

Click **"Environment Variables"** section, then click **"Add"** for each:

### Required Variable:

1. **VITE_API_URL** ⚠️ MOST IMPORTANT
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-project.vercel.app`
   - ⚠️ Replace with your actual backend URL!
   - Example: `https://nextgenphoto-api.vercel.app`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

### Optional Variables:

2. **GEMINI_API_KEY** (if you use it in frontend)
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

3. **VITE_WHATSAPP_NUMBER** (for contact form)
   - Key: `VITE_WHATSAPP_NUMBER`
   - Value: `919876543210`
   - ⚠️ Replace with your WhatsApp number (with country code, no +)
   - Environments: ✅ Production, ✅ Preview, ✅ Development

---

## Step 4: Deploy Frontend

1. After adding environment variables, scroll down
2. Click **"Deploy"** button (big blue button)
3. Wait for deployment (usually 2-5 minutes)
4. Watch the build logs
5. When complete, you'll see:
   - ✅ "Ready" status
   - A URL like: `https://nextgenphoto.vercel.app`
6. **⚠️ COPY THIS FRONTEND URL!**

---

## Step 5: Update Backend FRONTEND_URL

Now tell your backend about the frontend URL:

1. Go back to Vercel Dashboard
2. Find your **Backend Project** (the one you deployed first)
3. Click on it
4. Go to **Settings** tab (top menu)
5. Click **"Environment Variables"** (left sidebar)
6. Find `FRONTEND_URL` variable
7. Click the **pencil/edit icon** (or three dots → Edit)
8. Update Value to your frontend URL: `https://nextgenphoto.vercel.app`
   - ⚠️ Use the exact URL you copied in Step 4
9. Click **"Save"**
10. Go to **"Deployments"** tab
11. Find the latest deployment
12. Click **three dots (⋯)** → **"Redeploy"**
13. Confirm redeploy
14. Wait for redeployment to complete (1-2 minutes)

---

## Step 6: Test Your Application

### Test Frontend:
1. Open your frontend URL: `https://nextgenphoto.vercel.app`
2. Should load the landing page
3. Check browser console (F12) for errors

### Test API Connection:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login or any action that calls API
4. Check if requests go to: `https://your-backend.vercel.app/api/...`
5. Verify no CORS errors

### Test Authentication:
1. Try to login/signup
2. Check if OTP email is received
3. Verify login works

---

## Troubleshooting

### Issue: CORS Error
**Symptom**: Browser console shows CORS error  
**Fix**: 
- Go to Backend Project → Settings → Environment Variables
- Verify `FRONTEND_URL` matches your frontend URL exactly (including https://)
- Redeploy backend

### Issue: API Not Found (404)
**Symptom**: API calls return 404  
**Fix**:
- Check `VITE_API_URL` in frontend environment variables
- Verify backend URL is correct (no trailing slash)
- Redeploy frontend

### Issue: Environment Variables Not Working
**Symptom**: App uses default/localhost URLs  
**Fix**:
- Verify variables start with `VITE_` for frontend
- Redeploy after adding/changing variables
- Check build logs for errors

### Issue: Build Fails
**Symptom**: Deployment shows error  
**Fix**:
- Check build logs in Vercel
- Verify all dependencies in package.json
- Check for TypeScript errors
- Ensure vercel.json is correct

---

## Quick Checklist

- [ ] Frontend project created in Vercel
- [ ] Root directory set to `.` (not `server`)
- [ ] Framework preset: Vite
- [ ] `VITE_API_URL` environment variable added with backend URL
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] Backend `FRONTEND_URL` updated
- [ ] Backend redeployed
- [ ] Application tested and working

---

## Your URLs After Deployment

- **Frontend**: `https://nextgenphoto.vercel.app`
- **Backend API**: `https://nextgenphoto-api.vercel.app`
- **Health Check**: `https://nextgenphoto-api.vercel.app/health`

---

## Next Steps

Once everything is working:
1. Test all features (login, payments, admin dashboard)
2. Add custom domain (optional)
3. Monitor error logs
4. Set up monitoring (optional)

**Congratulations! Your full-stack application is now live! 🎉**
