import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import liveReload from 'vite-plugin-live-reload'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    liveReload([
      '**/*.php',
      'templates/**/*.php'
    ])
  ],
  build: {
    outDir: 'assets/dist',
    rollupOptions: {
      input: {
        test: resolve(__dirname, 'assets/src/scripts/test.js'),
        'test-styles': resolve(__dirname, 'assets/src/styles/test.scss')
      },
      output: {
        entryFileNames: 'scripts/[name].js',
        chunkFileNames: 'scripts/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'styles/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    manifest: true,
    sourcemap: true,
    emptyOutDir: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  server: {
    proxy: {
      // Proxy PHP requests to your local WordPress development server
      '/wp-admin': {
        target: 'https://pressbooks.test',
        changeOrigin: true,
        secure: false
      },
      '/wp-login.php': {
        target: 'https://pressbooks.test',
        changeOrigin: true,
        secure: false
      }
    },
    port: 3100,
    host: 'localhost'
  }
})