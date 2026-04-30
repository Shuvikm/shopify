/**
 * @file types/index.ts
 * @description Shared TypeScript interfaces used across the storefront.
 * Note: Vite asset declarations live in vite-env.d.ts at the project root.
 */

// ─── Shopify CDN Image Helper ─────────────────────────────────────────────────

/**
 * Build a Shopify CDN image URL with width/height for responsive images.
 * @example shopifyImageUrl('https://cdn.shopify.com/...jpg', 400) → '...?width=400'
 */
export function shopifyImageUrl(src: string, width: number, height?: number): string {
  const url = new URL(src);
  url.searchParams.set('width', String(width));
  if (height) url.searchParams.set('height', String(height));
  return url.toString();
}

// ─── Generic Pagination ───────────────────────────────────────────────────────

export interface Connection<T> {
  nodes: T[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

// ─── Shared Money Type ────────────────────────────────────────────────────────

export interface Money {
  amount: string;
  currencyCode: string;
}

// ─── Product-related shared types ────────────────────────────────────────────

export interface SelectedOption {
  name: string;
  value: string;
}

export interface Image {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}
