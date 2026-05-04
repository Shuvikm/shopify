/**
 * @file SearchResults.tsx
 * @description Renders predictive search hits grouped by type.
 * Used inside `PredictiveSearch` overlay and the `/search` route.
 */
import {Link} from '@remix-run/react';
import {formatMoney} from '~/lib/utils';
import {FALLBACK_PRODUCT_IMAGE} from '~/lib/products';
import type {
  PredictiveSearchResult,
  PredictiveSearchProduct,
  PredictiveSearchCollection,
} from '~/graphql/PredictiveSearchQuery';

interface SearchResultsProps {
  results: PredictiveSearchResult;
  query: string;
  onItemClick?: () => void;
}

export function SearchResults({results, query, onItemClick}: SearchResultsProps) {
  const products = Array.isArray(results?.products) ? results.products : [];
  const collections = Array.isArray(results?.collections) ? results.collections : [];
  const hasResults = products.length > 0 || collections.length > 0;

  if (!hasResults) return null;

  return (
    <div className="space-y-16">
      {/* Products Section */}
      {products.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-8 pb-2 border-b border-brand-primary/5">
            Matching Selections
          </h3>
          <ul className="space-y-2" role="group" aria-label="Product results">
            {products.map((product) => (
              <ProductHit key={product.id} product={product} onClick={onItemClick} />
            ))}
          </ul>
        </section>
      )}

      {/* Collections Section */}
      {collections.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-8 pb-2 border-b border-brand-primary/5">
            Curated Archives
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" role="group" aria-label="Collection results">
            {collections.map((col) => (
              <CollectionHit key={col.id} collection={col} onClick={onItemClick} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ProductHit({
  product,
  onClick,
}: {
  product: PredictiveSearchProduct;
  onClick?: () => void;
}) {
  const firstVariant = product.variants?.nodes?.[0];

  return (
    <li role="option" aria-selected="false">
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        onClick={onClick}
        className="group flex items-center gap-6 py-3 transition-colors"
      >
        <div className="w-14 h-14 bg-neutral-50 overflow-hidden shrink-0">
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              width={56}
              height={56}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
            />
          ) : (
            <div className="w-full h-full bg-neutral-100" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-lg font-serif text-brand-primary group-hover:text-brand-accent transition-colors truncate">{product.title}</p>
          <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400 mt-1">{product.vendor}</p>
        </div>

        <span className="text-sm font-light tracking-wide text-brand-accent">
          {firstVariant
            ? formatMoney(firstVariant.price)
            : formatMoney(product.priceRange.minVariantPrice)}
        </span>
      </Link>
    </li>
  );
}

function CollectionHit({
  collection,
  onClick,
}: {
  collection: PredictiveSearchCollection;
  onClick?: () => void;
}) {
  return (
    <li role="option" aria-selected="false">
      <Link
        to={`/collections/${collection.handle}`}
        prefetch="intent"
        onClick={onClick}
        className="group flex items-center justify-between p-4 border border-brand-primary/5 hover:border-brand-accent transition-all duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-neutral-50 overflow-hidden shrink-0">
            <img
              src={collection.image?.url ?? FALLBACK_PRODUCT_IMAGE}
              alt={collection.image?.altText ?? collection.title}
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
              }}
            />
          </div>
          <p className="text-sm font-serif text-brand-primary group-hover:text-brand-accent">{collection.title}</p>
        </div>
        <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-300 group-hover:text-brand-accent">View Archive</span>
      </Link>
    </li>
  );
}
