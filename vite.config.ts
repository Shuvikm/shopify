import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';

import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({isSsrBuild}) => ({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],

  build: {
    // Don't inline small assets — keep them separately cacheable
    assetsInlineLimit: 0,

    rollupOptions: {
      output: {
        /**
         * Manual chunk splitting — vendor libs that change rarely
         * get their own chunk so browsers cache them across deployments.
         *
         * Chunk budget targets (gzipped):
         *   headlessui:  ~60 KB  (dialog, transitions)
         *   react-vendor: ~45 KB (react + react-dom)
         *   hydrogen:    ~35 KB  (storefront helpers)
         */
        manualChunks: isSsrBuild
          ? undefined
          : (id: string) => {
              // Headless UI — dialog, disclosure, transitions
              if (id.includes('node_modules/@headlessui')) {
                return 'headlessui';
              }
              // React core — almost never changes
              if (
                id.includes('node_modules/react/') ||
                id.includes('node_modules/react-dom/')
              ) {
                return 'react-vendor';
              }
              // Hydrogen client helpers — cart, analytics, image
              if (
                id.includes('node_modules/@shopify/hydrogen-react') ||
                id.includes('node_modules/@shopify/hydrogen')
              ) {
                return 'hydrogen';
              }
            },
      },
    },
  },

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  ssr: {
    noExternal: true,
    optimizeDeps: {
      include: ['use-sync-external-store/with-selector'],
    },
  },

}));
