import {Link} from '@remix-run/react';
import {formatMoney, isOnSale, cn} from '~/lib/utils';
import {QuickAddButton} from './QuickAddButton';
import {useWishlist} from '~/hooks/useWishlist';
import {
  FALLBACK_PRODUCT_IMAGE,
  getFirstVariant,
  getProductImage,
  type ProductLike,
} from '~/lib/products';

interface ProductCardProps {
  product: ProductLike & {
    id: string;
    title: string;
    handle: string;
  };
  loading?: boolean;
}

function ProductImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      fetchPriority="low"
      onError={(event) => {
        event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
      }}
    />
  );
}

export function ProductCard({product, loading = false}: ProductCardProps) {
  const {toggle, isWishlisted} = useWishlist();

  if (loading) return <ProductCardSkeleton />;

  const firstVariant = getFirstVariant(product);
  const image = getProductImage(product);
  const soldOut = !firstVariant?.availableForSale;
  const onSale = Boolean(
    product?.priceRange?.minVariantPrice &&
      product?.compareAtPriceRange?.minVariantPrice &&
      isOnSale(product.priceRange.minVariantPrice, product.compareAtPriceRange.minVariantPrice),
  );
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="group relative bg-transparent overflow-hidden" aria-label={product.title}>
      {/* Image Container */}
      <Link to={`/products/${product.handle}`} prefetch="intent" className="block relative aspect-[3/4] overflow-hidden bg-[#F2F2F2]">
        <ProductImage
          src={image.url}
          alt={image.altText ?? product.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Floating Labels */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {soldOut && (
            <span className="bg-brand-primary text-white text-[9px] uppercase tracking-widest px-2 py-1">
              Out of Stock
            </span>
          )}
          {onSale && !soldOut && (
            <span className="bg-white text-brand-primary text-[9px] uppercase tracking-widest px-2 py-1">
              Limited Edition
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggle(product.id);
          }}
          className="absolute top-4 right-4 text-brand-primary transition-all duration-300 transform group-hover:scale-110"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={cn('w-5 h-5 transition-colors', wishlisted ? 'fill-brand-accent stroke-brand-accent' : 'fill-transparent stroke-brand-primary')}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick Add Overlay */}
        {!soldOut && firstVariant?.id && (
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <QuickAddButton 
              variantId={firstVariant.id} 
              className="w-full bg-brand-primary text-white text-[10px] uppercase tracking-[0.2em] py-4 hover:bg-brand-accent transition-colors duration-500"
            >
              Quick Addition
            </QuickAddButton>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="py-5 text-center px-2">
        <p className="text-[10px] text-brand-accent uppercase tracking-[0.2em] mb-2">
          {product.vendor ?? 'The Collection'}
        </p>
        <Link
          to={`/products/${product.handle}`}
          prefetch="intent"
          className="block text-lg font-serif text-brand-primary hover:text-brand-accent transition-colors duration-300 mb-2 leading-tight"
        >
          {product.title}
        </Link>
        
        <div className="flex items-center justify-center gap-3">
          <span className={cn('text-sm font-light tracking-wide', onSale ? 'text-brand-accent' : 'text-neutral-500')}>
            {formatMoney(product.priceRange?.minVariantPrice)}
          </span>
          {onSale && product.compareAtPriceRange && (
            <span className="text-xs text-neutral-300 line-through">
              {formatMoney(product.compareAtPriceRange.minVariantPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-neutral-100" />
      <div className="py-5 space-y-3 flex flex-col items-center">
        <div className="h-2 w-16 bg-neutral-100" />
        <div className="h-4 w-32 bg-neutral-100" />
        <div className="h-3 w-12 bg-neutral-100" />
      </div>
    </div>
  );
}
