# Production Deployment Guide

This guide covers the steps to deploy NextGenPhoto to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (MongoDB Atlas recommended)
- Domain name with SSL certificate
- SMTP email service configured
- Razorpay account (for payments)
- Gemini API key

## Environment Setup

### 1. Backend Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your production values:

```env
NODE_ENV=production
PORT=8000

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextgenphoto?retryWrites=true&w=majority
JWT_SECRET=your-very-long-and-secure-secret-key-minimum-32-characters
JWT_EXPIRE=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

FRONTEND_URL=https://yourdomain.com

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

ADMIN_EMAILS=admin@yourdomain.com
```

### 2. Frontend Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=https://api.yourdomain.com
GEMINI_API_KEY=your_gemini_api_key
VITE_WHATSAPP_NUMBER=919876543210
```

## Build Steps

### 1. Build Frontend

```bash
npm install
npm run build:prod
```

This creates an optimized production build in the `dist/` directory.

### 2. Install Backend Dependencies

```bash
cd server
npm install --production
```

## Deployment Options

### Option 1: PM2 (Recommended for VPS)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start backend server:
```bash
cd server
pm2 start server.js --name nextgenphoto-api
pm2 save
pm2 startup
```

3. Serve frontend (using PM2 with serve):
```bash
npm install -g serve
cd ..
pm2 serve dist 3000 --name nextgenphoto-frontend --spa
pm2 save
```

### Option 2: Docker

Create `Dockerfile` in root:
```dockerfile
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM node:18-alpine AS backend
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm ci --production
COPY server ./server

FROM node:18-alpine
WORKDIR /app
COPY --from=backend /app/server ./server
COPY --from=frontend-builder /app/dist ./dist
WORKDIR /app/server
EXPOSE 8000
CMD ["node", "server.js"]
```

### Option 3: Nginx + Node.js

1. Build frontend and copy to nginx directory
2. Configure nginx to serve static files
3. Proxy API requests to Node.js backend
4. Use PM2 to manage Node.js process

## Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication
- [ ] Use environment variables (never commit .env)
- [ ] Set up regular database backups
- [ ] Monitor error logs
- [ ] Set up rate limiting (consider adding express-rate-limit)

## Monitoring

- Monitor server logs: `pm2 logs`
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor database performance
- Set up uptime monitoring

## Backup Strategy

1. Database backups (MongoDB Atlas provides automatic backups)
2. Environment variable backups (store securely)
3. Regular code backups (Git repository)

## Performance Optimization

- Enable gzip compression in nginx
- Use CDN for static assets
- Enable MongoDB indexes
- Monitor and optimize slow queries
- Use caching where appropriate

## Post-Deployment

1. Test all critical flows
2. Verify email sending works
3. Test payment integration
4. Verify admin dashboard access
5. Check error logs
6. Monitor performance metrics
