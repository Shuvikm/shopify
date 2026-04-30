/**
 * vite-env.d.ts — Ambient type declarations for Vite-specific import patterns.
 * This file is auto-included by tsconfig.json via "**\/\*.ts".
 * It silences TypeScript errors for Vite's ?url, ?raw, and asset imports.
 */

/// <reference types="vite/client" />

/**
 * CSS files imported with the `?url` query param (used in Remix links).
 * Vite transforms these into a string URL at build time.
 * @example import appStyles from '~/styles/app.css?url'
 */
declare module '*.css?url' {
  const url: string;
  export default url;
}

/**
 * SVG imported as URL string.
 */
declare module '*.svg?url' {
  const url: string;
  export default url;
}

/**
 * Standard CSS module (no query param).
 */
declare module '*.css' {
  const stylesheet: string;
  export default stylesheet;
}
