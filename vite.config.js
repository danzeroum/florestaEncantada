import { defineConfig } from 'vite';

// Base path:
//  - GitHub Pages serve em /florestaEncantada/ (subpasta do domínio) — usar VITE_BASE_PATH
//  - VPS e dev servem em / (raiz)
// Em dev, `base` sempre é `/`. Em build, respeita VITE_BASE_PATH (default: `/`).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.VITE_BASE_PATH ?? '/') : '/',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
}));
