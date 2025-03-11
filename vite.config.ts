// vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from '@vercel/remix/vite';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
      },
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
  ],
  
  // Configuration minimale pour éviter les conflits
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});
