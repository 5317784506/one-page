import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    open: false,
    port: 5173
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
