import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },

  build: {
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunks: split heavy deps into separate bundles
        manualChunks(id) {
          // Three.js + R3F ecosystem → load only when gallery/hero visible
          if (
            id.includes('three') ||
            id.includes('@react-three') ||
            id.includes('postprocessing') ||
            id.includes('troika') ||
            id.includes('meshline') ||
            id.includes('draco3d') ||
            id.includes('detect-gpu')
          ) {
            return 'three-bundle'
          }
          // GSAP → separate chunk
          if (id.includes('gsap')) return 'gsap-bundle'
          // Supabase → separate chunk
          if (id.includes('@supabase')) return 'supabase-bundle'
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Framer motion
          if (id.includes('framer-motion') || id.includes('motion-dom')) {
            return 'motion-bundle'
          }
        },
      },
    },

    // Target modern browsers for smaller output
    target: 'es2020',

    // Source maps only in dev
    sourcemap: false,

    // Minification
    minify: 'esbuild',
  },

  // Optimise deps in dev
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap'],
    exclude: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
})