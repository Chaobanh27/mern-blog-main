import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  }
})
