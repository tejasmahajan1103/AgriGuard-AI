import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/weather': {
        target: 'https://a53cwd7442.execute-api.eu-north-1.amazonaws.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

