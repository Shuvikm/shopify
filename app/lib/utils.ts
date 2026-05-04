/**
 * @file utils.ts
 * @description Shared utility functions used across the storefront.
 * All pure — no side effects, no API calls.
 */
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

// ─── Class Merging ────────────────────────────────────────────────────────────

/**
 * Merge Tailwind CSS classes safely (resolves conflicts).
 * Usage: cn('text-sm text-red-500', condition && 'text-blue-500')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Money Formatting ─────────────────────────────────────────────────────────

/**
 * Format a Storefront API money object into a locale string.
 * @example formatMoney({ amount: '29.99', currencyCode: 'USD' }) → '$29.99'
 */
export function formatMoney(money: {
  amount?: string | number | null;
  currencyCode?: string | null;
} | null | undefined): string {
  const amount = Number.parseFloat(String(money?.amount ?? '0'));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: money?.currencyCode ?? 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

/**
 * Returns true if the compared-at price is strictly higher than the current price.
 */
export function isOnSale(
  price: {amount?: string | number | null; currencyCode?: string | null} | null | undefined,
  compareAtPrice: {amount?: string | number | null; currencyCode?: string | null} | null | undefined,
): boolean {
  if (!compareAtPrice) return false;
  return Number.parseFloat(String(compareAtPrice.amount ?? '0')) > Number.parseFloat(String(price?.amount ?? '0'));
}

// ─── URL Helpers ──────────────────────────────────────────────────────────────

/**
 * Build a product variant URL with selected options as query params.
 * e.g. /products/my-product?Color=Black&Size=M
 */
export function getVariantUrl({
  handle,
  selectedOptions,
  searchParams,
}: {
  handle: string;
  selectedOptions: Array<{name: string; value: string}>;
  searchParams?: URLSearchParams;
}): string {
  const params = new URLSearchParams(searchParams);
  for (const {name, value} of selectedOptions) {
    params.set(name, value);
  }
  return `/products/${handle}?${params.toString()}`;
}

/**
 * Strip URL search params that should not be forwarded.
 */
export function stripParam(url: URL, key: string): string {
  const params = new URLSearchParams(url.search);
  params.delete(key);
  return `${url.pathname}?${params.toString()}`;
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

/**
 * Truncate a string to `maxLength` chars, appending '…' if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 1)}…`;
}

/**
 * Derive an aria-label for a product variant button.
 * e.g. "Color: Black, Size: M"
 */
export function variantAriaLabel(
  selectedOptions: Array<{name: string; value: string}>,
): string {
  return selectedOptions.map(({name, value}) => `${name}: ${value}`).join(', ');
}
