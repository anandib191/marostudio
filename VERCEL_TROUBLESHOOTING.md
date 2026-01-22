# Vercel Serverless Function Troubleshooting

## Common Error: "This Serverless Function has crashed"

### Issue
You see: `500: INTERNAL_SERVER_ERROR` or `FUNCTION_INVOCATION_FAILED`

### Causes & Solutions

#### 1. ✅ Fixed: `app.listen()` in Serverless Environment
**Problem**: Express server trying to start a server with `app.listen()` which doesn't work on Vercel.

**Solution**: Code has been updated to detect Vercel environment and skip `app.listen()`.

#### 2. ✅ Fixed: Database Connection at Startup
**Problem**: MongoDB connection happening at module load time, causing timeouts.

**Solution**: Database connection is now lazy-loaded (connects on first request).

#### 3. ✅ Fixed: `process.exit()` Crashes
**Problem**: `process.exit()` calls crash serverless functions.

**Solution**: Exit calls are now conditional (only in non-Vercel environments).

#### 4. Check Environment Variables
**Problem**: Missing required environment variables.

**Solution**: 
- Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables
- Verify all required variables are set:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`
  - `FRONTEND_URL`
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
  - `ADMIN_EMAILS`

#### 5. Check MongoDB Connection
**Problem**: MongoDB connection string is incorrect or network blocked.

**Solution**:
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or Vercel IPs
- Check MongoDB connection string format
- Test connection string locally first

#### 6. Check Build Logs
**Problem**: Build errors not visible in deployment.

**Solution**:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the failed deployment
3. Check "Build Logs" tab
4. Look for error messages

#### 7. Check Function Logs
**Problem**: Runtime errors not visible.

**Solution**:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on deployment
3. Go to "Functions" tab
4. Click on the function
5. Check "Logs" for runtime errors

### How to Debug

1. **Check Deployment Logs**:
   ```
   Vercel Dashboard → Project → Deployments → Click Deployment → Build Logs
   ```

2. **Check Function Logs**:
   ```
   Vercel Dashboard → Project → Deployments → Click Deployment → Functions → Logs
   ```

3. **Test Health Endpoint**:
   ```
   https://your-backend.vercel.app/health
   ```
   Should return: `{"success":true,"message":"Server is running",...}`

4. **Test API Endpoint**:
   ```
   https://your-backend.vercel.app/api/price-plans
   ```
   Should return price plans JSON

### Common Error Messages

#### "Cannot find module"
- **Fix**: Ensure all dependencies are in `package.json`
- **Fix**: Check `node_modules` is not in `.gitignore` (Vercel installs it)

#### "MongoDB connection failed"
- **Fix**: Check `MONGODB_URI` is correct
- **Fix**: Verify MongoDB Atlas network access
- **Fix**: Check MongoDB credentials

#### "JWT_SECRET is not defined"
- **Fix**: Add `JWT_SECRET` to environment variables
- **Fix**: Ensure it's at least 32 characters

#### "CORS error"
- **Fix**: Check `FRONTEND_URL` matches your frontend URL exactly
- **Fix**: Verify CORS configuration in `server.js`

### After Fixing

1. **Redeploy**:
   - Go to Vercel Dashboard → Project → Deployments
   - Click three dots (⋯) on latest deployment
   - Click "Redeploy"

2. **Verify**:
   - Test `/health` endpoint
   - Test an API endpoint
   - Check function logs for errors

### Still Not Working?

1. Check Vercel status: [status.vercel.com](https://status.vercel.com)
2. Review Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
3. Check Vercel community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
