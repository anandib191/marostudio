import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:8000'),
        'import.meta.env.MODE': JSON.stringify(mode),
        'import.meta.env.PROD': JSON.stringify(isProduction),
        'import.meta.env.DEV': JSON.stringify(!isProduction),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        dedupe: ['react', 'react-dom']
      },
      build: {
        // Production build optimizations
        minify: 'esbuild',
        sourcemap: !isProduction, // Only generate sourcemaps in development
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'ui-vendor': ['react-toastify'],
            },
          },
        },
        chunkSizeWarningLimit: 1000,
        // Remove console.logs in production
        terserOptions: isProduction ? {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        } : undefined,
      },
      publicDir: 'public',
    };
});
