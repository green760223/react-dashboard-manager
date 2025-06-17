import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    proxy: {
      '/api': 'https://api-driver.marsview.com.cn'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: '/',
  plugins: [react()]
})
