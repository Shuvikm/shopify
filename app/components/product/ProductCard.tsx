/**
 * @file ProductCard.tsx
 * @description Amazon-style product card with wishlist heart, star rating,
 *              Prime badge, and "Add to Cart" quick action.
 */
import {Link} from '@remix-run/react';
import {formatMoney, isOnSale, cn} from '~/lib/utils';
import {QuickAddButton} from './QuickAddButton';
import {useWishlist} from '~/hooks/useWishlist';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    vendor: string;
    priceRange: {
      minVariantPrice: {amount: string; currencyCode: string};
    };
    compareAtPriceRange?: {
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
        selectedOptions?: Array<{name: string; value: string}>;
        price: {amount: string; currencyCode: string};
      }>;
    };
    description?: string;
  };
  loading?: boolean;
  view?: 'grid' | 'list';
}

// Deterministic pseudo-random rating per product ID
function getRating(id: string) {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 3.5 + (n % 16) * 0.1; // 3.5 – 5.0
}
function getReviewCount(id: string) {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 42 + (n % 958); // 42 – 999
}

function Stars({rating}: {rating: number}) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => {
        const filled = rating >= i;
        const half   = !filled && rating >= i - 0.5;
        return (
          <svg key={i} className={cn('w-3 h-3', filled || half ? 'text-yellow-400' : 'text-neutral-200')} viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </span>
  );
}

export function ProductCard({product, loading = false, view = 'grid'}: ProductCardProps) {
  const {toggle, isWishlisted} = useWishlist();
  const firstVariant = product?.variants?.nodes?.[0];
  const soldOut = !firstVariant?.availableForSale;
  const onSale = product?.priceRange?.minVariantPrice &&
    product?.compareAtPriceRange?.minVariantPrice &&
    isOnSale(product.priceRange.minVariantPrice, product.compareAtPriceRange.minVariantPrice);
  const rating = getRating(product.id);
  const reviewCount = getReviewCount(product.id);
  const wishlisted = isWishlisted(product.id);

  const priceParsed = parseFloat(product.priceRange.minVariantPrice.amount);
  const comparePrice = product.compareAtPriceRange
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const discountPct = onSale && comparePrice ? Math.round((1 - priceParsed / comparePrice) * 100) : 0;

  if (loading) return <ProductCardSkeleton />;

  if (view === 'list') {
    return (
      <article className="group bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-md transition-all flex flex-col sm:flex-row h-full">
        {/* Image */}
        <Link to={`/products/${product.handle}`} className="relative w-full sm:w-48 shrink-0 aspect-[4/5] sm:aspect-square bg-neutral-50 overflow-hidden">
          {product.featuredImage ? (
            <img src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
          <button
            onClick={e => { e.preventDefault(); toggle(product.id); }}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-red-500"
          >
            {wishlisted ? '♥' : '♡'}
          </button>
        </Link>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col min-w-0">
          <div className="flex-1 space-y-1.5">
            <Link to={`/products/${product.handle}`} className="block text-lg font-bold text-neutral-900 hover:text-brand-600 line-clamp-2 transition-colors">
              {product.title}
            </Link>
            
            <div className="flex items-center gap-1.5">
              <Stars rating={rating} />
              <span className="text-xs text-brand-600 font-bold">{rating.toFixed(1)}</span>
              <span className="text-xs text-neutral-400">({reviewCount.toLocaleString('en-IN')})</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className={cn("text-xl font-black", onSale ? "text-red-600" : "text-neutral-900")}>
                {formatMoney(product.priceRange.minVariantPrice)}
              </span>
              {onSale && product.compareAtPriceRange && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatMoney(product.compareAtPriceRange.minVariantPrice)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-xs text-neutral-500 line-clamp-2 pt-1">{product.description}</p>
            )}

            <p className="text-[10px] text-neutral-400 font-medium pt-1 uppercase tracking-widest">
              Brand: {product.vendor}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {!soldOut && firstVariant && (
              <QuickAddButton variantId={firstVariant.id} className="h-9 px-6 !text-xs !rounded-lg flex-1 sm:flex-initial">
                Add to Cart
              </QuickAddButton>
            )}
            {priceParsed >= 5000 && (
              <span className="text-[10px] text-emerald-600 font-bold">✓ FREE Delivery</span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="product-card group bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-lg hover:border-neutral-200 transition-all duration-200" aria-label={product.title}>
      {/* ... existing grid view ... */}
      <Link to={`/products/${product.handle}`} prefetch="intent" className="block relative aspect-[4/5] overflow-hidden bg-neutral-50">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/id/20/800/1000';
            }}
          />
        ) : (
          <img src="https://picsum.photos/id/20/800/1000" alt={product.title} className="w-full h-full object-cover" />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPct > 0 && <span className="badge bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded">-{discountPct}%</span>}
          {soldOut && <span className="badge bg-neutral-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded">Sold Out</span>}
        </div>

        {/* Wishlist heart */}
        <button
          type="button"
          onClick={e => { e.preventDefault(); toggle(product.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all active:scale-90"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className={cn('text-base transition-colors', wishlisted ? 'text-red-500' : 'text-neutral-400')}>
            {wishlisted ? '♥' : '♡'}
          </span>
        </button>

        {/* Quick Add hover overlay */}
        {!soldOut && firstVariant && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <QuickAddButton variantId={firstVariant.id} quantity={1} className="w-full !h-9 !text-xs !rounded-lg">
              + Add to Cart
            </QuickAddButton>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 space-y-1">
        <p className="text-[10px] text-brand-500 font-semibold uppercase tracking-wide">{product.vendor}</p>
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="block text-sm font-medium text-neutral-800 hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
        >
          {product.title}
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <Stars rating={rating} />
          <span className="text-[10px] text-brand-600 font-medium">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-neutral-400">({reviewCount.toLocaleString('en-IN')})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 pt-0.5 flex-wrap">
          <span className={cn('text-base font-black', onSale ? 'text-red-600' : 'text-neutral-900')}>
            {formatMoney(product.priceRange.minVariantPrice)}
          </span>
          {onSale && product.compareAtPriceRange && (
            <span className="text-xs text-neutral-400 line-through">
              {formatMoney(product.compareAtPriceRange.minVariantPrice)}
            </span>
          )}
        </div>

        {/* Free delivery badge */}
        {priceParsed >= 5000 && (
          <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5">
            ✓ FREE Delivery
          </p>
        )}
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-white border border-neutral-100" aria-busy="true" aria-label="Loading product">
      <div className="aspect-[4/5] skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-2.5 w-16 rounded" />
        <div className="skeleton h-3.5 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
