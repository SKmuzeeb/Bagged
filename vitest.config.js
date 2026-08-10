import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: true,
    // Force demo mode in tests regardless of a local .env's real backend
    // URL, so component tests keep asserting against synchronous local data.
    env: {
      VITE_API_BASE_URL: '',
    },
  },
})
