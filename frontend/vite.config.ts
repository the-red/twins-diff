import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../web/dist',
    emptyOutDir: true,
  },
  server: {
    // 開発時はGoサーバー(3001)にAPIをプロキシ
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
