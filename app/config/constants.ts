/**
 * @file config/constants.ts
 * @description App-wide constants — single source of truth for magic strings.
 */

/** Shopify pagination defaults */
export const PAGINATION = {
  PRODUCTS_PER_PAGE: 12,
  SEARCH_RESULTS_LIMIT: 24,
  PREDICTIVE_RESULTS_LIMIT: 6,
} as const;

/** Cart action names (must match cart.tsx action switch) */
export const CART_ACTIONS = {
  ADD: 'ADD_TO_CART',
  UPDATE: 'UPDATE_CART',
  REMOVE: 'REMOVE_CART_LINE',
  DISCOUNT: 'UPDATE_DISCOUNT',
} as const;

/** Default locale */
export const DEFAULT_LOCALE = {
  language: 'EN',
  country: 'IN',
  currency: 'INR',
} as const;

/** Navigation links — shared between Header and MobileMenu */
export const NAV_ITEMS = [
  {label: 'Shop All', href: '/collections/all'},
  {label: 'New Arrivals', href: '/collections/new-arrivals'},
  {label: 'Sale', href: '/collections/sale'},
] as const;

/** Trust badge data — used on homepage */
export const TRUST_BADGES = [
  {icon: '🚀', label: 'Free Shipping Over ₹5,000'},
  {icon: '♻️', label: 'Sustainable Packaging'},
  {icon: '🔒', label: 'Secure Checkout'},
  {icon: '↩️', label: '30-Day Returns'},
] as const;

/** Search debounce delay (ms) */
export const SEARCH_DEBOUNCE_MS = 300;

/** Minimum free shipping threshold (in store currency) */
export const FREE_SHIPPING_THRESHOLD = 5000;
