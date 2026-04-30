/**
 * @file ProductCard.tsx
 * @description Reusable product card for collection and homepage grids.
 *
 * Features:
 * - Image with skeleton loading state
 * - Sale / New / Sold Out badges
 * - Hover Quick-Add button (via QuickAddButton)
 * - Link to PDP with Remix `prefetch="intent"` for instant navigation
 */
import {Link} from '@remix-run/react';
import {formatMoney, isOnSale, cn} from '~/lib/utils';
import {QuickAddButton} from './QuickAddButton';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    vendor: string;
    priceRange: {
      minVariantPrice: {amount: string; currencyCode: string};
    };
    compareAtPriceRange: {
      minVariantPrice: {amount: string; currencyCode: string};
    };
    featuredImage: {
      url: string;
      altText: string | null;
      width: number;
      height: number;
    } | null;
    variants: {
      nodes: Array<{
        id: string;
        availableForSale: boolean;
        selectedOptions: Array<{name: string; value: string}>;
        price: {amount: string; currencyCode: string};
      }>;
    };
  };
  /** Force a loading skeleton */
  loading?: boolean;
}

export function ProductCard({product, loading = false}: ProductCardProps) {
  const firstVariant = product.variants.nodes[0];
  const soldOut = !firstVariant?.availableForSale;
  const onSale = isOnSale(
    product.priceRange.minVariantPrice,
    product.compareAtPriceRange.minVariantPrice,
  );

  if (loading) {
    return <ProductCardSkeleton />;
  }

  return (
    <article className="product-card" aria-label={product.title}>
      <Link to={`/products/${product.handle}`} prefetch="intent" className="block" tabIndex={-1} aria-hidden="true">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              width={product.featuredImage.width}
              height={product.featuredImage.height}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
              <span className="text-neutral-400 text-xs">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {onSale && <span className="badge-sale">Sale</span>}
            {soldOut && <span className="badge-sold-out">Sold Out</span>}
          </div>

          {/* Hover Quick-Add */}
          {!soldOut && firstVariant && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
              <QuickAddButton
                variantId={firstVariant.id}
                quantity={1}
                className="w-full"
              >
                Quick Add
              </QuickAddButton>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-1">
        <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
          {product.vendor}
        </p>
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="block text-sm font-semibold text-neutral-900 hover:text-brand-600 transition-colors line-clamp-2"
        >
          {product.title}
        </Link>
        <div className="flex items-center gap-2 pt-0.5">
          <span className={cn('text-sm font-bold', onSale ? 'text-red-600' : 'text-neutral-900')}>
            {formatMoney(product.priceRange.minVariantPrice)}
          </span>
          {onSale && (
            <span className="text-xs text-neutral-400 line-through">
              {formatMoney(product.compareAtPriceRange.minVariantPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/** Skeleton placeholder while products load */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-card" aria-busy="true" aria-label="Loading product">
      <div className="aspect-[4/5] skeleton" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/4 rounded" />
      </div>
    </div>
  );
}
