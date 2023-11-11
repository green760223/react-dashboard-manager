import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  server: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': 'http://api-driver.marsview.cc'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Checked if it's in production mode, if it is, set the base path to /react-todo-list/, if not, set it to /.
  base:
    process.env.NODE_ENV === 'production' ? '/react-dashboard-manager/' : '/',
  plugins: [react()]
})
