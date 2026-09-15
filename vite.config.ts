import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1600,
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    include: ['@react-three/rapier'],
  },
})
