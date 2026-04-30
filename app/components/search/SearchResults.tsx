/**
 * @file SearchResults.tsx
 * @description Renders predictive search hits grouped by type.
 * Used inside `PredictiveSearch` overlay and the `/search` route.
 */
import {Link} from '@remix-run/react';
import {formatMoney} from '~/lib/utils';
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
  const {products, collections} = results;
  const hasResults = products.length > 0 || collections.length > 0;

  if (!hasResults) return null;

  return (
    <div className="divide-y divide-neutral-50">
      {/* Products Section */}
      {products.length > 0 && (
        <section className="px-4 py-3">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-2">
            Products
          </h3>
          <ul role="group" aria-label="Product results">
            {products.map((product) => (
              <ProductHit key={product.id} product={product} onClick={onItemClick} />
            ))}
          </ul>
          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onItemClick}
            className="block text-xs text-brand-500 hover:text-brand-700 font-medium px-2 mt-3 transition-colors"
          >
            See all results for "{query}" →
          </Link>
        </section>
      )}

      {/* Collections Section */}
      {collections.length > 0 && (
        <section className="px-4 py-3">
          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-2">
            Collections
          </h3>
          <ul role="group" aria-label="Collection results">
            {collections.map((col) => (
              <CollectionHit key={col.id} collection={col} onClick={onItemClick} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ─── Product Hit ──────────────────────────────────────────────────────────────

function ProductHit({
  product,
  onClick,
}: {
  product: PredictiveSearchProduct;
  onClick?: () => void;
}) {
  const firstVariant = product.variants.nodes[0];

  return (
    <li role="option" aria-selected="false">
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        onClick={onClick}
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
      >
        {/* Thumbnail */}
        <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 shrink-0">
          {product.featuredImage ? (
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">{product.title}</p>
          <p className="text-xs text-neutral-400">{product.vendor}</p>
        </div>

        {/* Price */}
        <span className="text-sm font-semibold text-neutral-900 shrink-0">
          {firstVariant
            ? formatMoney(firstVariant.price)
            : formatMoney(product.priceRange.minVariantPrice)}
        </span>
      </Link>
    </li>
  );
}

// ─── Collection Hit ───────────────────────────────────────────────────────────

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
        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50 transition-colors"
      >
        <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 shrink-0">
          {collection.image ? (
            <img
              src={collection.image.url}
              alt={collection.image.altText ?? collection.title}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}
        </div>
        <p className="text-sm font-medium text-neutral-900">{collection.title}</p>
        <span className="ml-auto text-xs text-neutral-400">Collection →</span>
      </Link>
    </li>
  );
}
