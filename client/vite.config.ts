import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({command, mode, isSsrBuild, isPreview}) => {
  // serve and dev is the same thing
  if (command === 'serve') {
    return {
      plugins: [react()],
      server: {
        port: 3000
      }
    }
  } else {
    // command === 'build'
    return {
      base: '/static',
      build: {
        outDir: '../server/static',
      }
    }
  }
})