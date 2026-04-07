import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isProduction = mode === 'production';
    
    return {
      server: {
        port: 3000,
        host: "0.0.0.0",
        proxy: {
          '/s3-proxy': {
            target: 'https://growspace-app-storage.s3.eu-north-1.amazonaws.com',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/s3-proxy/, ''),
          },
        },
      },
      plugins: [react(), tailwindcss(),],
      esbuild: {
        // Drop console and debugger in production builds
        drop: isProduction ? ["console", "debugger"] : [],
        // Keep console.error and console.warn for production debugging
        pure: isProduction
          ? ["console.log", "console.info", "console.debug"]
          : [],
      },
      define: {
        "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
        "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
        "import.meta.env.VITE_API_URL": JSON.stringify(
          env.VITE_API_URL || "http://localhost:8000",
        ),
        "import.meta.env.MODE": JSON.stringify(mode),
        "import.meta.env.PROD": JSON.stringify(isProduction),
        "import.meta.env.DEV": JSON.stringify(!isProduction),
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "."),
        },
        dedupe: ["react", "react-dom"],
      },
      build: {
        // Production build optimizations
        minify: "esbuild",
        sourcemap: false, // Disable sourcemaps in production for security
        target: "es2015", // Better browser compatibility
        cssCodeSplit: true, // Split CSS for better caching
        rollupOptions: {
          output: {
            manualChunks: {
              "react-vendor": ["react", "react-dom", "react-router-dom"],
              "ui-vendor": ["react-toastify", "swiper"],
              "pdf-vendor": ["jspdf", "html2canvas", "jszip"],
            },
            // Optimize chunk names
            chunkFileNames: "assets/js/[name]-[hash].js",
            entryFileNames: "assets/js/[name]-[hash].js",
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name.split(".");
              const ext = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/css/i.test(ext)) {
                return `assets/css/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            },
          },
        },
        chunkSizeWarningLimit: 1000,
        // Report compressed sizes
        reportCompressedSize: true,
        // Reduce chunk size warnings
        assetsInlineLimit: 4096, // Inline assets smaller than 4kb
      },
      publicDir: "public",
    };
});
