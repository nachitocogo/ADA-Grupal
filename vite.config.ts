import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`        → dist/ normal (Netlify, subcarpeta de la central de recursos, cualquier host estático)
// `npm run build:single` → dist/index.html con todo inline (un solo archivo para compartir o incrustar)
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2020' },
}));
