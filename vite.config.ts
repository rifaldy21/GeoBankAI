import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // Bundle analyzer - generates stats.html
      visualizer({
        open: false,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
            'query-vendor': ['@tanstack/react-query'],
            'chart-vendor': ['recharts'],
            'map-vendor': ['leaflet', 'react-leaflet', 'leaflet.markercluster'],
            'ui-vendor': ['lucide-react', 'motion'],
            // Separate large export libraries
            'export-vendor': ['xlsx', 'jspdf', 'jspdf-autotable'],
            // AI vendor
            'ai-vendor': ['@google/genai', 'react-markdown'],
          },
        },
        // Optimize tree shaking
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
      chunkSizeWarningLimit: 1000,
      // Enable minification and tree shaking
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
          passes: 2, // Run compression twice for better results
        },
        mangle: {
          safari10: true, // Fix Safari 10 issues
        },
        format: {
          comments: false, // Remove all comments
        },
      },
      // Optimize CSS
      cssMinify: true,
      cssCodeSplit: true, // Split CSS into separate files
      // Enable source maps for debugging (can be disabled for smaller builds)
      sourcemap: false,
      // Optimize asset handling
      assetsInlineLimit: 4096, // Inline assets smaller than 4kb
      // Report compressed size
      reportCompressedSize: true,
    },
  };
});
