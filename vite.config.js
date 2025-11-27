import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/' is default for Cloudflare Pages (served from root)
  // If deploying to a subdirectory, uncomment and set base path:
  // base: '/spectra/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
})
