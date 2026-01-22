# Debugging 404 Error on Send OTP

## Issue
Getting 404 error when clicking "Send OTP" button.

## Quick Fixes to Try

### 1. Check VITE_API_URL in Vercel

1. Go to Vercel Dashboard → Your **Frontend Project**
2. Settings → Environment Variables
3. Check if `VITE_API_URL` exists
4. Verify the value is your **backend URL**:
   ```
   https://your-backend-project.vercel.app
   ```
5. Make sure there's **NO trailing slash** at the end
6. Make sure it starts with `https://`

### 2. Verify Backend URL is Correct

Test your backend directly:
1. Open: `https://your-backend.vercel.app/health`
2. Should return: `{"success":true,"message":"Server is running",...}`
3. If this doesn't work, backend has issues

### 3. Test API Endpoint Directly

Test the send-otp endpoint:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Run this command:
   ```javascript
   fetch('https://your-backend.vercel.app/api/auth/send-otp', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: 'test@example.com', is_admin: false })
   }).then(r => r.json()).then(console.log).catch(console.error)
   ```
4. Check what error you get

### 4. Check Browser Console

1. Open your frontend: `https://nextgen-three-blush.vercel.app/login`
2. Open DevTools (F12) → **Console** tab
3. Click "Send OTP"
4. Look for error messages
5. Check what URL it's trying to call

### 5. Redeploy Frontend

After fixing `VITE_API_URL`:
1. Go to Vercel Dashboard → Frontend Project
2. Deployments → Latest
3. Click **three dots (⋯)** → **Redeploy**
4. Wait for deployment

## Common Issues

### Issue: VITE_API_URL Not Set
**Symptom**: API calls go to `http://localhost:8000`  
**Fix**: Add `VITE_API_URL` environment variable in Vercel

### Issue: Wrong Backend URL
**Symptom**: 404 on all API calls  
**Fix**: Verify backend URL is correct and accessible

### Issue: Backend Routes Not Working
**Symptom**: Backend health check works but `/api/auth/send-otp` returns 404  
**Fix**: Check backend deployment logs, verify routes are registered

### Issue: CORS Error
**Symptom**: CORS error in console  
**Fix**: Update `FRONTEND_URL` in backend environment variables

## Expected API URL Format

Frontend should call:
```
https://your-backend.vercel.app/api/auth/send-otp
```

NOT:
```
https://your-backend.vercel.app/api/auth/send-otp/  (trailing slash)
http://your-backend.vercel.app/api/auth/send-otp   (http instead of https)
localhost:8000/api/auth/send-otp                  (localhost)
```

## Quick Test

Open browser console on your frontend and run:
```javascript
console.log('API_URL:', import.meta.env.VITE_API_URL);
```

This will show what URL the frontend is using. If it shows `undefined` or `http://localhost:8000`, then `VITE_API_URL` is not set correctly in Vercel.
