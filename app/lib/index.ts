/**
 * @file lib/index.ts
 * @description Client-safe utility re-exports ONLY.
 *
 * ⚠️  IMPORTANT: Do NOT add .server.ts exports here.
 *    Vite will throw if a client component imports this file
 *    and it pulls in any server-only module (Node APIs, secrets, etc.)
 *
 * Server-only helpers (cart.server, session.server) must be imported
 * directly by path in loaders/actions:
 *   import { addToCart } from '~/lib/cart.server';
 *   import { AppSession } from '~/lib/session.server';
 */
export {
  cn,
  formatMoney,
  isOnSale,
  getVariantUrl,
  truncate,
  variantAriaLabel,
} from './utils';
