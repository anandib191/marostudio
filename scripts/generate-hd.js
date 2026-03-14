import sharp from 'sharp';
import path from 'path';

const inputImagePath = path.join(process.cwd(), 'public', 'old-pixels-1767411677486.jpeg');
const outputImagePath = path.join(process.cwd(), 'public', 'old-pixels-hd.jpeg');

async function generateHD() {
  try {
    // Generate a significantly lower quality/resolution image to represent "Standard HD"
    // when compared to the 4K original, so the zoom difference is obvious
    await sharp(inputImagePath)
      .resize(800) // Lower resolution
      .jpeg({ quality: 60 }) // Lower quality
      .toFile(outputImagePath);
    console.log('Successfully generated HD version:', outputImagePath);
  } catch (error) {
    console.error('Error generating HD version:', error);
  }
}

generateHD();
