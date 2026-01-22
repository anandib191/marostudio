# Fix 404 Error on Send OTP

## Problem
- Frontend: `nextgen-three-blush.vercel.app`
- Backend: `next-gen-8ate.vercel.app`
- Error: 404 NOT_FOUND when clicking "Send OTP"
- Network tab shows: "Provisional headers are shown" (CORS/Network issue)

## Root Causes

### 1. CORS Configuration Issue
The backend needs to allow requests from your frontend domain.

### 2. Backend Route Not Found
The `/api/auth/send-otp` endpoint might not be properly configured.

## Step-by-Step Fix

### Step 1: Verify Backend is Working

Test these URLs in browser:

1. **Health Check:**
   ```
   https://next-gen-8ate.vercel.app/health
   ```
   Should return: `{"success":true,"message":"Server is running",...}`

2. **Root Endpoint:**
   ```
   https://next-gen-8ate.vercel.app/
   ```
   Should return API info

3. **Send OTP Endpoint (Direct Test):**
   Open browser console and run:
   ```javascript
   fetch('https://next-gen-8ate.vercel.app/api/auth/send-otp', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@example.com', is_admin: false })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```

### Step 2: Fix CORS in Backend

1. Go to Vercel Dashboard → **Backend Project** (`next-gen-8ate`)
2. Settings → Environment Variables
3. Find `FRONTEND_URL`
4. Update it to: `https://nextgen-three-blush.vercel.app`
   - ⚠️ Must match your frontend URL exactly!
   - Include `https://`
   - No trailing slash
5. Save
6. Redeploy backend (Deployments → Latest → ⋯ → Redeploy)

### Step 3: Verify Frontend VITE_API_URL

1. Go to Vercel Dashboard → **Frontend Project** (`nextgen-three-blush`)
2. Settings → Environment Variables
3. Check `VITE_API_URL`:
   - Should be: `https://next-gen-8ate.vercel.app`
   - No trailing slash
   - Must start with `https://`
4. If wrong, update and save
5. Redeploy frontend

### Step 4: Test Again

1. Clear browser cache (Ctrl+Shift+Delete)
2. Open frontend: `https://nextgen-three-blush.vercel.app/login`
3. Open DevTools (F12) → Console tab
4. Try "Send OTP" again
5. Check Network tab for the request

## Expected Behavior After Fix

✅ Network tab should show:
- Status: 200 (not 404)
- Request URL: `https://next-gen-8ate.vercel.app/api/auth/send-otp`
- Response: `{"success":true,"message":"OTP sent successfully"}`

✅ No "Provisional headers" warning

✅ OTP email received

## If Still Not Working

### Check Backend Logs:
1. Vercel Dashboard → Backend Project
2. Deployments → Latest
3. Functions tab → Click on function
4. Check Logs for errors

### Check Frontend Build:
1. Vercel Dashboard → Frontend Project
2. Deployments → Latest
3. Check Build Logs for errors

### Common Issues:

**Issue: Backend returns 404**
- Check if `/api/auth/send-otp` route exists in `server/routes/auth.js`
- Verify `server.js` includes: `app.use('/api/auth', authRoutes)`

**Issue: CORS Error**
- Verify `FRONTEND_URL` in backend matches frontend URL exactly
- Check backend CORS configuration allows your frontend origin

**Issue: "Failed to fetch"**
- Backend might be down
- Network connectivity issue
- Check backend health endpoint first

## Quick Verification Checklist

- [ ] Backend health check works: `https://next-gen-8ate.vercel.app/health`
- [ ] `FRONTEND_URL` in backend = `https://nextgen-three-blush.vercel.app`
- [ ] `VITE_API_URL` in frontend = `https://next-gen-8ate.vercel.app`
- [ ] Both projects redeployed after changes
- [ ] Browser cache cleared
- [ ] No CORS errors in console
- [ ] Network request shows 200 status (not 404)
