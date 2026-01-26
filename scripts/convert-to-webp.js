import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGE_FOLDERS = ['Fashion', 'Accessories', 'Product', 'Marketing'];
const HERO_CAROUSEL_FOLDERS = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
const INPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'images');
const HERO_CAROUSEL_DIR = path.join(INPUT_DIR, 'hero-carousel');
const WEBP_QUALITY = 85; // Quality setting (0-100)

/**
 * Convert a single image to WebP format
 */
async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .rotate() // Auto-rotate based on EXIF orientation
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outputPath);
    
    const inputStats = fs.statSync(inputPath);
    const outputStats = fs.statSync(outputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);
    
    console.log(`✅ Converted: ${path.basename(inputPath)}`);
    console.log(`   Original: ${(inputStats.size / 1024).toFixed(2)} KB`);
    console.log(`   WebP: ${(outputStats.size / 1024).toFixed(2)} KB`);
    console.log(`   Savings: ${savings}%\n`);
    
    return { success: true, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
    return { success: false, savings: 0 };
  }
}

/**
 * Process all images in a folder
 */
async function processFolder(folderName) {
  const folderPath = path.join(INPUT_DIR, folderName);
  const webpFolderPath = path.join(folderPath, 'webp');
  
  // Check if folder exists
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder not found: ${folderName}`);
    return { processed: 0, totalSavings: 0 };
  }
  
  // Create webp subfolder if it doesn't exist
  if (!fs.existsSync(webpFolderPath)) {
    fs.mkdirSync(webpFolderPath, { recursive: true });
    console.log(`📁 Created folder: ${webpFolderPath}\n`);
  }
  
  // Get all image files
  const files = fs.readdirSync(folderPath).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });
  
  console.log(`\n🔄 Processing ${files.length} images in ${folderName}...\n`);
  
  let processed = 0;
  let totalSavings = 0;
  
  for (const file of files) {
    const inputPath = path.join(folderPath, file);
    const outputFileName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(webpFolderPath, outputFileName);
    
    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipped (already exists): ${file}\n`);
      continue;
    }
    
    const result = await convertToWebP(inputPath, outputPath);
    if (result.success) {
      processed++;
      totalSavings += result.savings;
    }
  }
  
  return { processed, totalSavings, total: files.length };
}

/**
 * Process hero carousel images
 */
async function processHeroCarousel() {
  console.log('\n🎭 Processing Hero Carousel Images...\n');
  console.log('=' .repeat(60));
  
  let totalProcessed = 0;
  let totalImages = 0;
  let totalSavings = 0;
  
  for (const folder of HERO_CAROUSEL_FOLDERS) {
    const folderPath = path.join(HERO_CAROUSEL_DIR, folder);
    const result = await processFolder(path.join('hero-carousel', folder));
    totalProcessed += result.processed;
    totalImages += result.total || 0;
    totalSavings += result.totalSavings;
  }
  
  return { processed: totalProcessed, total: totalImages, totalSavings };
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting WebP Conversion Process...\n');
  console.log('=' .repeat(60));
  
  let totalProcessed = 0;
  let totalImages = 0;
  let totalSavings = 0;
  
  // Process carousel images (Fashion, Accessories, etc.)
  console.log('\n📸 Processing Carousel Images...\n');
  for (const folder of IMAGE_FOLDERS) {
    const result = await processFolder(folder);
    totalProcessed += result.processed;
    totalImages += result.total || 0;
    totalSavings += result.totalSavings;
    console.log('=' .repeat(60));
  }
  
  // Process hero carousel images (a1, a2, a3, a4, a5)
  const heroResult = await processHeroCarousel();
  totalProcessed += heroResult.processed;
  totalImages += heroResult.total;
  totalSavings += heroResult.totalSavings;
  console.log('=' .repeat(60));
  
  console.log('\n✨ Conversion Complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   Total images: ${totalImages}`);
  console.log(`   Converted: ${totalProcessed}`);
  console.log(`   Skipped: ${totalImages - totalProcessed}`);
  if (totalProcessed > 0) {
    console.log(`   Average savings: ${(totalSavings / totalProcessed).toFixed(2)}%`);
  }
  console.log('\n💡 Next steps:');
  console.log('   1. Test the WebP images in your browser');
  console.log('   2. The app will automatically use WebP when available');
  console.log('   3. Original images are kept as fallback\n');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
