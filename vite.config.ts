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

// Configuration des chunks
const CHUNK_CONFIG = {
  vendor: [
    'react',
    'react-dom',
    '@remix-run/react',
    'lucide-react',
    '@radix-ui',
  ],
  sections: {
    projects: '/components/projects/',
    contact: '/components/contact/',
    dashboard: '/components/dashboard/',
    ui: '/components/ui/',
  },
} as const;

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
    // Optimisation du bundling
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendors
          if (id.includes('node_modules')) {
            for (const lib of CHUNK_CONFIG.vendor) {
              if (id.includes(lib)) return 'vendor';
            }
            return 'dependencies';
          }
          if (id.includes('/components/projects/')) return 'projects';
          if (id.includes('/components/contact/')) return 'contact';
          if (id.includes('/components/dashboard/')) return 'dashboard';
          
          // Sections de composants
          for (const [chunk, path] of Object.entries(CHUNK_CONFIG.sections)) {
            if (id.includes(path)) return chunk;
          }
          
          // Routes
          if (id.includes('/routes/')) return 'routes';
          
          // Utils et hooks
          if (id.includes('/utils/')) return 'utils';
        },
      },
    },
    
    // Configuration du build
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    emptyOutDir: true,
  },
  
  // Optimisations
  optimizeDeps: {
    include: [...CHUNK_CONFIG.vendor],
    exclude: ['@vercel/remix'],
  },
  
  // Configuration esbuild
  esbuild: {
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    drop: ['console', 'debugger'],
    target: 'esnext',
    platform: 'browser',
  },
  
  // Cache et performance
  server: {
    hmr: true,
    watch: {
      usePolling: false,
    },
  },
});
