import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    proxy: {
      '/api': 'http://api-driver.marsview.cc'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base:
    process.env.NODE_ENV === 'production' ? '/react-dashboard-manager/' : '/',
  plugins: [react()]
})
