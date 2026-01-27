# Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Create `.env.production` file with production values
- [ ] Set `VITE_API_URL` to production API URL
- [ ] Set `GEMINI_API_KEY` with production API key
- [ ] Set `VITE_FORM_API_KEY` for form submissions
- [ ] Verify all environment variables are set
- [ ] **Never commit `.env` files to git**

### 2. Build Optimization
- [ ] Run `npm run build:prod` to create production build
- [ ] Verify build output in `dist/` folder
- [ ] Check bundle sizes (should be optimized)
- [ ] Verify no source maps in production build
- [ ] Test production build locally with `npm run preview`

### 3. Image Optimization
- [ ] Run `npm run convert:webp` to convert all images to WebP
- [ ] Verify WebP images are created in `webp/` folders
- [ ] Test image loading with WebP fallbacks
- [ ] Check image file sizes (should be reduced by 25-35%)

### 4. Security
- [ ] Remove all hardcoded API keys/URLs
- [ ] Verify CSP headers are configured
- [ ] Check for exposed sensitive data in console
- [ ] Verify HTTPS is enforced in production
- [ ] Review CORS settings on backend

### 5. Performance
- [ ] Enable gzip/brotli compression on server
- [ ] Configure CDN for static assets
- [ ] Set proper cache headers
- [ ] Verify lazy loading for images
- [ ] Check Core Web Vitals scores

### 6. Error Handling
- [ ] Test error boundaries
- [ ] Verify error logging (if implemented)
- [ ] Test offline scenarios
- [ ] Verify fallback images load correctly

### 7. Testing
- [ ] Test all user flows end-to-end
- [ ] Test authentication flow
- [ ] Test image generation
- [ ] Test payment flow (if applicable)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

### 8. SEO & Meta Tags
- [ ] Verify meta tags in `index.html`
- [ ] Update Open Graph URLs
- [ ] Update canonical URLs
- [ ] Verify structured data (JSON-LD)
- [ ] Test social media previews

### 9. Analytics & Monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure analytics (if needed)
- [ ] Set up performance monitoring
- [ ] Configure uptime monitoring

### 10. Documentation
- [ ] Update README with production setup
- [ ] Document environment variables
- [ ] Document deployment process
- [ ] Create runbook for common issues

## 🚀 Deployment Steps

### Vercel Deployment
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build command: `npm run build:prod`
4. Set output directory: `dist`
5. Configure framework preset: `Vite`
6. Deploy and verify

### Manual Deployment
1. Run `npm run build:prod`
2. Upload `dist/` folder to hosting provider
3. Configure server to serve `index.html` for all routes
4. Set up SSL certificate
5. Configure redirects/rewrites

## 🔍 Post-Deployment Verification

- [ ] Verify site loads correctly
- [ ] Test all API endpoints
- [ ] Verify images load (WebP + fallbacks)
- [ ] Check console for errors
- [ ] Test authentication
- [ ] Verify HTTPS redirect
- [ ] Check mobile responsiveness
- [ ] Test performance (PageSpeed Insights)
- [ ] Verify SEO tags
- [ ] Test error scenarios

## 📊 Performance Targets

- **Lighthouse Score**: > 90
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Total Blocking Time**: < 200ms
- **Cumulative Layout Shift**: < 0.1

## 🐛 Troubleshooting

### Common Issues:
1. **API calls failing**: Check `VITE_API_URL` environment variable
2. **Images not loading**: Verify WebP conversion ran successfully
3. **Build fails**: Check for TypeScript errors with `npm run type-check`
4. **Large bundle size**: Review manual chunks in `vite.config.ts`
5. **CORS errors**: Verify backend CORS configuration

## 📝 Environment Variables Reference

### Required for Production:
- `VITE_API_URL` - Backend API URL
- `GEMINI_API_KEY` - Gemini AI API key
- `VITE_FORM_API_KEY` - Form submission API key

### Optional:
- `VITE_PRODUCTION_URL` - Production frontend URL
- `NODE_ENV` - Set to `production`

## 🔐 Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use environment variables for all secrets
3. ✅ Enable HTTPS only
4. ✅ Set secure cookies
5. ✅ Implement CSP headers
6. ✅ Regular dependency updates
7. ✅ Monitor for security vulnerabilities
