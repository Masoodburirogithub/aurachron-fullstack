// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(),
      // require('postcss-import'),
        // require('tailwindcss/nesting'),
        // require('tailwindcss'),
        // require('autoprefixer'),
      ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  
  optimizeDeps: {
    include: ['swiper/react', 'swiper/modules']
  },
  '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      
})
