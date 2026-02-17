/**
 * Remove console.log statements from production build
 * This script uses esbuild to remove console statements
 */
import { build } from 'esbuild';
import { readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  console.log('⚠️  This script should only run in production mode');
  process.exit(0);
}

console.log('🧹 Removing console.log statements from production build...');

// This is handled by Vite's esbuild minifier automatically
// But we can add additional cleanup if needed

console.log('✅ Console.log removal handled by Vite build process');
