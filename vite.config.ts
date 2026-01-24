import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: set base to your repo name
  // Change 'mood-tracker' to match your GitHub repo name
  base: process.env.GITHUB_PAGES ? '/mood-tracker/' : '/',
})
