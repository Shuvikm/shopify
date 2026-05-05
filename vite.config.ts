import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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

  resolve: {
    alias: {
      // Manual aliases to avoid plugin-related boot errors
      net: require.resolve('node-stdlib-browser/mock/empty.js'),
      tls: require.resolve('node-stdlib-browser/mock/empty.js'),
      stream: require.resolve('node-stdlib-browser/cjs/mock/stream.js'),
      events: require.resolve('node-stdlib-browser/cjs/mock/events.js'),
      util: require.resolve('node-stdlib-browser/cjs/mock/util.js'),
      buffer: require.resolve('node-stdlib-browser/cjs/mock/buffer.js'),
    },
  },

  ssr: {
    noExternal: true,
  },

  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
}));
