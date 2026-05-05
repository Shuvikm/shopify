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
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild
          ? undefined
          : (id: string) => {
              if (id.includes('node_modules/gsap')) return 'gsap';
              if (id.includes('node_modules/@headlessui')) return 'headlessui';
              if (
                id.includes('node_modules/react/') ||
                id.includes('node_modules/react-dom/')
              ) {
                return 'react-vendor';
              }
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

  ssr: {
    noExternal: ['@shopify/hydrogen', '@shopify/hydrogen-react'],
    // pg and prisma adapters are Node-only — keep them external so Miniflare
    // doesn't try to bundle them.
    external: ['pg', '@prisma/adapter-pg', '@prisma/client', '@prisma/client/edge'],
    optimizeDeps: {
      include: ['use-sync-external-store/with-selector'],
      exclude: ['@prisma/client', 'pg', '@prisma/adapter-pg'],
    },
  },
}));
