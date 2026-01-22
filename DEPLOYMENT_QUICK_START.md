# 🚀 Quick Deployment Checklist

Use this as a quick reference while deploying.

## ⚡ Quick Steps

### 1️⃣ Backend Deployment (Do First!)

**Vercel Project Settings:**
- Project Name: `nextgenphoto-api`
- Framework: **Other**
- Root Directory: **`server`** ⚠️ (Click Override)
- Build Command: (empty)
- Output Directory: (empty)

**Environment Variables (Backend):**
```
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_long_secret_32_chars_min
JWT_EXPIRE=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
FRONTEND_URL=https://nextgenphoto.vercel.app (update after frontend deploy)
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
ADMIN_EMAILS=admin@example.com
```

**After Deploy:**
- ✅ Copy backend URL: `https://nextgenphoto-api.vercel.app`

---

### 2️⃣ Frontend Deployment (Do Second!)

**Vercel Project Settings:**
- Project Name: `nextgenphoto`
- Framework: **Vite**
- Root Directory: **`.`** (root - don't override!)
- Build Command: `npm run build:prod`
- Output Directory: `dist`

**Environment Variables (Frontend):**
```
VITE_API_URL=https://nextgenphoto-api.vercel.app (use your backend URL!)
GEMINI_API_KEY=your_key (optional)
VITE_WHATSAPP_NUMBER=919876543210 (optional)
```

**After Deploy:**
- ✅ Copy frontend URL: `https://nextgenphoto.vercel.app`

---

### 3️⃣ Update Backend FRONTEND_URL

1. Go to Backend Project → Settings → Environment Variables
2. Edit `FRONTEND_URL` = your frontend URL
3. Redeploy backend

---

## 📋 Environment Variables Checklist

### Backend (12 variables)
- [ ] NODE_ENV
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] JWT_EXPIRE
- [ ] SMTP_HOST
- [ ] SMTP_PORT
- [ ] SMTP_USER
- [ ] SMTP_PASSWORD
- [ ] SMTP_FROM
- [ ] FRONTEND_URL
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] ADMIN_EMAILS

### Frontend (1-3 variables)
- [ ] VITE_API_URL (REQUIRED)
- [ ] GEMINI_API_KEY (optional)
- [ ] VITE_WHATSAPP_NUMBER (optional)

---

## 🔗 Important URLs

After deployment:
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.vercel.app`
- Health Check: `https://your-backend.vercel.app/health`

---

## ⚠️ Common Mistakes

1. ❌ Wrong Root Directory (backend should be `server`, frontend should be `.`)
2. ❌ Forgot to add `VITE_` prefix for frontend variables
3. ❌ Wrong backend URL in `VITE_API_URL`
4. ❌ Forgot to update `FRONTEND_URL` after frontend deploy
5. ❌ Using Gmail password instead of App Password

---

## 📖 Full Guide

For detailed instructions, see: **VERCEL_STEP_BY_STEP.md**
