import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PublicGoodDesignSystem',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    minify: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/core': resolve(__dirname, 'src/core'),
      '@/assets': resolve(__dirname, 'src/assets'),
      '@/locales': resolve(__dirname, 'src/locales')
    }
  },
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  server: {
    open: true,
    port: 3000
  }
})