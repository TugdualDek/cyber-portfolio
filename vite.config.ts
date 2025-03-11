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
        v3_lazyRouteDiscovery: true,
      },
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
  ],
  
  build: {
    // Configuration simplifiée du bundling
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react', 
            'react-dom', 
            '@remix-run/react',
            'lucide-react', 
            '@radix-ui',
          ],
        },
      },
    },
    
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: true, // Activer les sourcemaps pour le débogage
  },
  
  // Retirer les optimisations qui peuvent causer des problèmes
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    // Désactivation des options problématiques
    // minifyIdentifiers: true,
    // minifySyntax: true,
    // minifyWhitespace: true,
    // drop: ['console', 'debugger'],
    target: 'esnext',
  },
});
