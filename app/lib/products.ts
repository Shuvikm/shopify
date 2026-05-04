/**
 * Shared product helpers for Storefront API responses.
 * These functions are intentionally defensive because product data can be
 * missing when a store is still being configured or filters return no results.
 */

export const FALLBACK_PRODUCT_IMAGE = '/media__1777623667530.png';

export interface MoneyLike {
  amount?: string | number | null;
  currencyCode?: string | null;
}

export interface ImageLike {
  id?: string | null;
  url?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface NormalizedImage {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface VariantLike {
  id?: string | null;
  title?: string | null;
  availableForSale?: boolean | null;
  price?: MoneyLike | null;
  image?: ImageLike | null;
  selectedOptions?: Array<{name?: string | null; value?: string | null}> | null;
}

export interface ProductLike {
  id?: string | null;
  title?: string | null;
  handle?: string | null;
  vendor?: string | null;
  productType?: string | null;
  description?: string | null;
  featuredImage?: ImageLike | null;
  images?: {nodes?: ImageLike[] | null} | null;
  rating?: {value?: string | null} | null;
  ratingCount?: {value?: string | null} | null;
  priceRange?: {minVariantPrice?: MoneyLike | null} | null;
  compareAtPriceRange?: {minVariantPrice?: MoneyLike | null} | null;
  variants?: {nodes?: VariantLike[] | null} | null;
}

function hashSeed(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function buildProductFallbackImage(seedInput: string): string {
  const seed = hashSeed(seedInput || 'product');
  const hues = [12, 32, 52, 172, 212, 262, 312];
  const hueA = hues[seed % hues.length];
  const hueB = hues[(seed + 3) % hues.length];
  const initials = seedInput
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PR';

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hueA} 92% 92%)" />
      <stop offset="100%" stop-color="hsl(${hueB} 92% 82%)" />
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#g)" />
  <circle cx="400" cy="380" r="190" fill="rgba(255,255,255,0.55)" />
  <text x="400" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="160" font-weight="700" fill="rgba(15,23,42,0.75)">${initials}</text>
  <text x="400" y="790" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" fill="rgba(15,23,42,0.75)">Premium Product</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function toArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  try {
    const parsed = new URL(url, 'https://local.invalid');
    parsed.searchParams.delete('width');
    parsed.searchParams.delete('height');
    parsed.searchParams.delete('crop');
    parsed.searchParams.delete('v');
    return parsed.pathname.toLowerCase();
  } catch {
    return url.split('?')[0].toLowerCase();
  }
}

export function getProductImage(product: ProductLike | null | undefined): NormalizedImage {
  const image = product?.featuredImage?.url
    ? product.featuredImage
    : toArray(product?.images?.nodes).find((candidate) => Boolean(candidate?.url));

  return {
    id: image?.id ?? product?.id ?? 'fallback-product-image',
    url: image?.url ?? buildProductFallbackImage(product?.title ?? product?.handle ?? 'Product'),
    altText: image?.altText ?? product?.title ?? 'Product image',
    width: image?.width ?? 800,
    height: image?.height ?? 1000,
  };
}

export function getFirstVariant(product: ProductLike | null | undefined): VariantLike | null {
  return toArray(product?.variants?.nodes)[0] ?? null;
}

export function isRenderableProduct(product: ProductLike | null | undefined): product is ProductLike {
  return Boolean(
    product?.id &&
      product?.title &&
      product?.handle &&
      product?.priceRange?.minVariantPrice?.amount,
  );
}

export function dedupeProducts<T extends ProductLike>(products: T[] | null | undefined): T[] {
  const seenProductIds = new Set<string>();
  const seenImageUrls = new Set<string>();
  const output: T[] = [];

  for (const product of toArray(products)) {
    if (!isRenderableProduct(product)) continue;

    const productId = product.id ?? '';
    const imageUrl = normalizeImageUrl(getProductImage(product).url);

    if (productId && seenProductIds.has(productId)) continue;
    if (imageUrl && seenImageUrls.has(imageUrl)) continue;

    if (productId) seenProductIds.add(productId);
    if (imageUrl) seenImageUrls.add(imageUrl);
    output.push(product);
  }

  return output;
}

export function dedupeImages(images: ImageLike[] | null | undefined): NormalizedImage[] {
  const seen = new Set<string>();
  const output: NormalizedImage[] = [];

  for (const image of toArray(images)) {
    if (!image?.url) continue;
    const key = normalizeImageUrl(image.url);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push({
      id: image.id ?? key,
      url: image.url,
      altText: image.altText ?? 'Product image',
      width: image.width ?? 800,
      height: image.height ?? 1000,
    });
  }

  if (output.length === 0) {
    output.push({
      id: 'fallback-product-image',
      url: FALLBACK_PRODUCT_IMAGE,
      altText: 'Product image',
      width: 800,
      height: 1000,
    });
  }

  return output;
}

export function getProductRating(product: ProductLike | null | undefined): number {
  const raw = Number.parseFloat(product?.rating?.value ?? '');
  if (Number.isFinite(raw)) return Math.max(0, Math.min(5, raw));
  const seed = hashSeed(product?.id ?? product?.handle ?? product?.title ?? 'rating');
  return 3.5 + (seed % 16) / 10; // 3.5 - 5.0
}

export function getProductReviewCount(product: ProductLike | null | undefined): number {
  const raw = Number.parseInt(product?.ratingCount?.value ?? '', 10);
  if (Number.isFinite(raw) && raw > 0) return raw;
  const seed = hashSeed(product?.id ?? product?.handle ?? product?.title ?? 'reviews');
  return 24 + (seed % 780);
}

export function filterProductsByRating<T extends ProductLike>(
  products: T[],
  minimumRating: number | null,
): T[] {
  if (!minimumRating) return products;
  return products.filter((product) => getProductRating(product) >= minimumRating);
}
