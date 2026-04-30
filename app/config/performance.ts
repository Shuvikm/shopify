/**
 * @file hydrogen.config.ts
 * @description Hydrogen storefront performance & caching configuration.
 *
 * Cache strategy reference:
 * - CacheShort   → 1 min stale / 1 min revalidate  (cart, live inventory)
 * - CacheDefault → 1 hr stale / 1 hr revalidate    (product pages, PDPs)
 * - CacheLong    → 24 hr stale / 1 hr revalidate   (shop metadata, policies)
 * - CacheNone    → no caching (account, draft orders)
 */

export const CACHE_CONFIG = {
  /**
   * Product pages — cache 1 hour, allow stale for up to 4 hours.
   * Use in: products.$handle loader
   */
  PRODUCT_PAGE: {
    maxAge: 60 * 60,         // 1 hr fresh
    staleWhileRevalidate: 60 * 60 * 4, // 4 hr stale-while-revalidate
  },

  /**
   * Collection pages — same as product pages.
   */
  COLLECTION_PAGE: {
    maxAge: 60 * 60,
    staleWhileRevalidate: 60 * 60 * 4,
  },

  /**
   * Predictive search — short cache (results change frequently).
   */
  PREDICTIVE_SEARCH: {
    maxAge: 60,              // 1 min
    staleWhileRevalidate: 60 * 5,
  },

  /**
   * Shop metadata (name, currency) — long cache.
   */
  SHOP_META: {
    maxAge: 60 * 60 * 24,   // 24 hr
    staleWhileRevalidate: 60 * 60,
  },

  /**
   * Cart — never cache (always fresh).
   */
  CART: {
    maxAge: 0,
    staleWhileRevalidate: 0,
  },
} as const;

/**
 * Image sizes for Shopify CDN srcset generation.
 * Used with the `?width=` param on Shopify CDN URLs.
 */
export const IMAGE_SIZES = {
  /** Product gallery hero */
  GALLERY_HERO: [400, 600, 800, 1200] as const,
  /** Product card thumbnail */
  CARD_THUMB: [200, 400, 600] as const,
  /** Predictive search thumbnail */
  SEARCH_THUMB: [80, 160] as const,
  /** Collection banner */
  COLLECTION_BANNER: [600, 900, 1200, 1600] as const,
} as const;

/**
 * Route-level preload hints — added to <Links> for critical resources.
 */
export const PRELOAD_ROUTES = ['/collections/all', '/cart'] as const;
