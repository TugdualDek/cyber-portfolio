import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from '@vercel/remix/vite';

// Types pour Remix
declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

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
        manualChunks: (id) => {
          // Regrouper les dépendances principales
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            return 'react';
          }
          
          // Regrouper les dépendances Remix
          if (id.includes('node_modules/@remix-run/')) {
            return 'remix';
          }
          
          // Regrouper les composants Radix UI (correctement)
          if (id.includes('node_modules/@radix-ui/')) {
            return 'radix';
          }
          
          // Autres dépendances node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
          
          // Composants de l'application par section
          if (id.includes('/components/projects/')) return 'projects';
          if (id.includes('/components/contact/')) return 'contact';
          if (id.includes('/components/dashboard/')) return 'dashboard';
          if (id.includes('/components/ui/')) return 'ui';
          
          // Routes
          if (id.includes('/routes/')) {
            return 'routes';
          }
        },
      },
    },
    
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: true, // Activer les sourcemaps pour le débogage
  },
  
  // Configuration esbuild
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    target: 'esnext',
  },
});
