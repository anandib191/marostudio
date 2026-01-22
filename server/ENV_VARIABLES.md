# Environment Variables Reference

This document lists all environment variables required for the server to run properly.

## Required Environment Variables

### 1. Server Configuration
```env
PORT=8000
NODE_ENV=development
```
- **PORT**: Port number for the server (defaults to 8000 if not set)
- **NODE_ENV**: Environment mode - `development` or `production`

### 2. MongoDB Connection (REQUIRED)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgenphoto?retryWrites=true&w=majority
```
- **MONGODB_URI**: MongoDB Atlas connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- **Required**: Yes - Server will not start without this

### 3. JWT Authentication (REQUIRED)
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30m
```
- **JWT_SECRET**: Secret key for signing JWT tokens (use a long random string)
- **JWT_EXPIRE**: Token expiration time (e.g., `30m`, `1h`, `7d`)
- **Required**: Yes - Authentication will fail without JWT_SECRET

### 4. SMTP Email Configuration (REQUIRED for OTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
```
- **SMTP_HOST**: SMTP server hostname (Gmail: `smtp.gmail.com`)
- **SMTP_PORT**: SMTP port (Gmail: `587` for TLS, `465` for SSL)
- **SMTP_USER**: Your email address
- **SMTP_PASSWORD**: App password (NOT your regular password for Gmail)
- **SMTP_FROM**: Sender email address (usually same as SMTP_USER)
- **Required**: Yes - OTP emails will not send without this

### 5. Admin Configuration
```env
ADMIN_EMAILS=admin@example.com,admin2@example.com
```
- **ADMIN_EMAILS**: Comma-separated list of admin email addresses
- **Required**: No (but needed for admin access)
- **Note**: Emails in this list will get admin role when logging in with `is_admin: true`

### 6. CORS Configuration
```env
FRONTEND_URL=http://localhost:3000
```
- **FRONTEND_URL**: Frontend application URL for CORS
- **Required**: No (defaults to `http://localhost:3000`)
- **Note**: In production, set this to your actual frontend domain

### 7. Bladdit Image Generation API (REQUIRED for image generation)
```env
BLADDIT_API_KEY=your_bladdit_api_key_here
```
- **BLADDIT_API_KEY**: API key for Bladdit image generation service
- **Required**: Yes (if you want image generation to work)
- **Note**: Add this to your `server/.env` file
- **How to get**: 
  - Check Bladdit API documentation
  - Or contact Bladdit support for API access
  - The API might require registration or subscription

### 8. Razorpay Payment Gateway (REQUIRED for payments)
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
- **RAZORPAY_KEY_ID**: Your Razorpay API Key ID (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)
- **RAZORPAY_KEY_SECRET**: Your Razorpay API Key Secret
- **Required**: Yes (if you want payment functionality)
- **Note**: Add these to your `server/.env` file
- **How to get**: 
  1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
  2. Go to Settings → API Keys
  3. Generate test keys (for development) or live keys (for production)
  4. Copy the Key ID and Key Secret

### 8. Frontend Configuration (Client-side)
```env
VITE_WHATSAPP_NUMBER=919876543210
VITE_API_URL=http://localhost:8000
```
- **VITE_WHATSAPP_NUMBER**: WhatsApp phone number for contact form (format: country code + number without + or 0)
- **VITE_API_URL**: Backend API URL (defaults to `http://localhost:8000` if not set)
- **Required**: No (defaults provided)
- **Note**: These are frontend environment variables. Add them to your **root `.env` file** (not in `server/.env`)
- **Example**: For +91 9876543210, use: `919876543210`

## Complete .env File Example

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgenphoto?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30m

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# Admin Emails
ADMIN_EMAILS=admin@example.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Bladdit Image Generation API
BLADDIT_API_KEY=your_bladdit_api_key_here

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend Configuration (add to root .env file, not server/.env)
VITE_WHATSAPP_NUMBER=919876543210
VITE_API_URL=http://localhost:8000
```

## How to Get Values

### MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `nextgenphoto` (or your preferred database name)

### Gmail App Password
1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google Account Settings](https://myaccount.google.com/)
3. Navigate to **Security** → **2-Step Verification** → **App passwords**
4. Select "Mail" and your device
5. Copy the generated 16-character password
6. Use this as `SMTP_PASSWORD`

### JWT Secret
Generate a random string (at least 32 characters):
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator
# https://randomkeygen.com/
```

### Razorpay Keys
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** → **API Keys**
4. Click **Generate Test Key** (for development) or **Generate Live Key** (for production)
5. Copy the **Key ID** (starts with `rzp_test_` or `rzp_live_`)
6. Copy the **Key Secret** (shown only once, save it securely)
7. Add both to your `server/.env` file

## Validation

The server will check for these variables on startup:
- ✅ **MONGODB_URI**: Must be set, or server will fail to connect
- ✅ **JWT_SECRET**: Must be set, or authentication will fail
- ✅ **SMTP_***: Must be set, or OTP emails will fail to send

Optional variables have defaults:
- `PORT` defaults to `8000`
- `NODE_ENV` defaults to `development`
- `FRONTEND_URL` defaults to `http://localhost:3000`
- `JWT_EXPIRE` defaults to `30m` (if not set in code)
- `ADMIN_EMAILS` can be empty (no admins)

## Troubleshooting

### Server won't start
- Check if `MONGODB_URI` is set correctly
- Verify MongoDB connection string format
- Ensure MongoDB Atlas IP whitelist includes your IP

### Authentication fails
- Verify `JWT_SECRET` is set
- Check `JWT_EXPIRE` format (e.g., `30m`, `1h`)

### OTP emails not sending
- Verify all `SMTP_*` variables are set
- For Gmail, ensure you're using an App Password (not regular password)
- Check that 2FA is enabled on your Google account
- Verify `SMTP_PORT` matches your SMTP provider (587 for Gmail TLS)

### Admin access not working
- Ensure your email is in `ADMIN_EMAILS` (comma-separated, no spaces)
- Check that you're logging in with `is_admin: true` in the request
- Verify email matches exactly (case-insensitive but must match)
