// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      },
    },
  },

  optimizeDeps: {
    include: ['swiper/react', 'swiper/modules'],
  },

  css: {
    // ✅ Fix the "Nested CSS was detected" warning from Swiper's CSS
    transformer: 'postcss',
  },

  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // ✅ Rolldown-compatible: use a FUNCTION instead of an object
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('axios') || id.includes('socket.io-client')) {
              return 'data-vendor';
            }
            if (id.includes('swiper')) {
              return 'swiper-vendor';
            }
            // Catch-all for other deps
            return 'vendor';
          }
        },
      },
    },
  },
});