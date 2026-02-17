# WebP Image Conversion Guide

## 🎯 Purpose
This script converts all your product images (JPG, JPEG, PNG) to WebP format, which typically reduces file sizes by 25-35% while maintaining excellent quality.

## 🚀 Quick Start

### Step 1: Install Dependencies

First, install the required package:

```bash
npm install sharp
```

Or if you prefer yarn:

```bash
yarn add sharp
```

### Step 2: Run the Conversion Script

```bash
node scripts/convert-to-webp.js
```

## 📁 What It Does

The script will:
1. ✅ Scan all images in these folders:
   - `public/assets/images/Fashion/`
   - `public/assets/images/Accessories/`
   - `public/assets/images/Product/`
   - `public/assets/images/Marketing/`
   - `public/assets/images/hero-carousel/a1/` ⭐ NEW!
   - `public/assets/images/hero-carousel/a2/` ⭐ NEW!
   - `public/assets/images/hero-carousel/a3/` ⭐ NEW!
   - `public/assets/images/hero-carousel/a4/` ⭐ NEW!
   - `public/assets/images/hero-carousel/a5/` ⭐ NEW!

2. 📦 Convert each image to WebP format with 85% quality

3. 💾 Save WebP images in `webp/` subfolders:
   - `Fashion/webp/`
   - `Accessories/webp/`
   - etc.

4. 📊 Show conversion statistics:
   - Original file size
   - WebP file size
   - Percentage saved
   - Total summary

5. ⏭️ Skip images that are already converted

## 🎨 How Your App Uses WebP

Your React components now use the `<picture>` element with WebP support:

```tsx
<picture>
  <source srcSet="/path/to/image.webp" type="image/webp" />
  <img src="/path/to/image.jpg" alt="Fallback" />
</picture>
```

**Browser behavior:**
- ✅ Modern browsers (Chrome, Edge, Firefox, Safari 14+): Load WebP (smaller, faster)
- 🔄 Older browsers: Automatically fallback to original JPG/PNG

## 📈 Expected Benefits

- **File Size:** 25-35% smaller on average
- **Loading Speed:** 30-50% faster page loads
- **Bandwidth:** Reduced server costs
- **SEO:** Better Google PageSpeed scores
- **UX:** Smoother image loading with skeletons

## 🔧 Configuration

Edit `scripts/convert-to-webp.js` to customize:

```javascript
const WEBP_QUALITY = 85; // Quality (0-100) - higher = better quality, larger file
const IMAGE_FOLDERS = ['Fashion', 'Accessories', ...]; // Folders to process
```

## 💡 Manual Conversion for New Images

After running the script once, you have two options for new images:

### Option 1: Re-run the Script
Just run the script again - it will only convert new images:
```bash
node scripts/convert-to-webp.js
```

### Option 2: Online Tools
Use online converters:
- [Squoosh.app](https://squoosh.app/) (Google)
- [CloudConvert](https://cloudconvert.com/jpg-to-webp)
- [TinyPNG](https://tinypng.com/) (also supports WebP)

## 🗂️ Folder Structure After Conversion

```
public/
└── assets/
    └── images/
        ├── Fashion/
        │   ├── Image_1.jpg          (original - kept as fallback)
        │   ├── IMG_0529.jpg
        │   └── webp/                (new folder)
        │       ├── Image_1.webp     (optimized)
        │       └── IMG_0529.webp
        ├── img_upload.jpg
        ├── hero1.png
        ├── hero2.png
        ├── hero3.png
        └── webp/                    (new folder)
            ├── img_upload.webp
            ├── hero1.webp
            ├── hero2.webp
            └── hero3.webp
```

## ⚠️ Important Notes

1. **Original files are preserved** - WebP files are created in separate `webp/` folders
2. **No data loss** - The conversion is non-destructive
3. **Quality setting** - 85% quality provides excellent results with good compression
4. **Browser support** - 95%+ of users will see WebP images
5. **Lazy loading** - Images use `loading="lazy"` for better performance

## 🧪 Testing

After conversion:

1. Open your app in Chrome/Edge
2. Open DevTools → Network tab
3. Filter by "Img"
4. Refresh the page
5. Check that `.webp` images are loading

## 🎯 Performance Metrics

Expected improvements:
- **Largest Contentful Paint (LCP):** 30-40% faster
- **Total Page Weight:** 25-35% lighter
- **Initial Load Time:** 30-50% faster
- **Mobile Performance:** Significant improvement

## 🐛 Troubleshooting

### Issue: "Cannot find module 'sharp'"
**Solution:** Run `npm install sharp`

### Issue: Script runs but no images converted
**Solution:** Check that image folders exist in `public/assets/images/`

### Issue: WebP not loading in browser
**Solution:** 
1. Clear browser cache
2. Check browser console for errors
3. Verify WebP files exist in `webp/` folders
4. Check DevTools → Network to see which format loaded

## 📝 Summary

**Before running script:**
- ❌ Images load slower (JPG/PNG)
- ❌ Larger file sizes
- ❌ Higher bandwidth usage

**After running script:**
- ✅ 25-35% smaller files
- ✅ 30-50% faster loading
- ✅ Better user experience
- ✅ Automatic fallback for old browsers
- ✅ Lazy loading enabled
- ✅ Improved SEO scores

---

**Ready to optimize?** Run: `node scripts/convert-to-webp.js`
