# Production Deployment Guide

## 🚀 Quick Start

### 1. Environment Setup

Create `.env.production` file in the root directory:

```env
VITE_API_URL=https://your-api-domain.com
GEMINI_API_KEY=your_production_gemini_key
VITE_FORM_API_KEY=your_production_form_key
NODE_ENV=production
```

### 2. Build for Production

```bash
# Install dependencies
npm install

# Convert images to WebP (optional but recommended)
npm run convert:webp

# Build for production
npm run build:prod
```

### 3. Verify Build

```bash
# Preview production build locally
npm run preview:prod
```

### 4. Deploy

#### Vercel (Recommended)
1. Push code to GitHub/GitLab
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

#### Manual Deployment
1. Upload `dist/` folder to your hosting provider
2. Configure server to serve `index.html` for all routes
3. Set up SSL certificate
4. Configure CDN (optional but recommended)

## 📋 Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Images converted to WebP
- [ ] Production build tested locally
- [ ] No hardcoded URLs/API keys
- [ ] Error boundaries tested
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Analytics/monitoring set up

## 🔧 Configuration Files

### Vercel
- `vercel.json` - Deployment configuration
- Environment variables set in Vercel dashboard

### Build
- `vite.config.ts` - Build optimizations
- `package.json` - Scripts and dependencies

### Security
- `public/_headers` - Security headers (Netlify)
- `vercel.json` - Security headers (Vercel)

## 📊 Performance Optimization

1. **Images**: All images converted to WebP format
2. **Code Splitting**: Automatic chunk splitting for better caching
3. **Tree Shaking**: Unused code removed automatically
4. **Minification**: Code minified for production
5. **Gzip/Brotli**: Enable on server/CDN

## 🔐 Security Checklist

- ✅ Environment variables for secrets
- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ CSP headers set
- ✅ No console.logs in production
- ✅ Source maps disabled in production

## 🐛 Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run type-check`
- Verify all dependencies installed
- Check Node.js version (v18+ recommended)

### API Calls Fail
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration on backend
- Verify API endpoints are accessible

### Images Not Loading
- Run `npm run convert:webp`
- Check WebP files exist in `webp/` folders
- Verify image paths in components

## 📈 Monitoring

After deployment:
1. Monitor error rates
2. Check performance metrics
3. Verify analytics (if configured)
4. Test all user flows
5. Monitor API response times
