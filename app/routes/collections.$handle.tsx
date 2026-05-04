/**
 * @file routes/collections.$handle.tsx
 * @description Dynamic collection/category page with defensive Storefront API
 * loading, de-duplicated product grids, filters, sorting, and pagination.
 */
import {json} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
  type MetaFunction,
} from '@remix-run/react';
import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {COLLECTION_QUERY, PRODUCTS_QUERY} from '~/graphql/CollectionQuery';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';
import {cn} from '~/lib/utils';
import {
  dedupeProducts,
  filterProductsByRating,
  getFirstVariant,
  type ProductLike,
} from '~/lib/products';
import {withTimeout} from '~/lib/async.server';
import {CATEGORIES} from '~/config/categories';

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS = [
  {label: 'Featured', value: 'COLLECTION_DEFAULT', reverse: false},
  {label: 'Price: Low to High', value: 'PRICE', reverse: false},
  {label: 'Price: High to Low', value: 'PRICE', reverse: true},
  {label: 'Newest Arrivals', value: 'CREATED', reverse: true},
];

const CATEGORY_OPTIONS = [
  {label: 'All Products', href: '/collections/all'},
  ...CATEGORIES.map((category) => ({
    label: category.title,
    href: `/collections/${category.handle}`,
  })),
];

const EMPTY_PAGE_INFO = {
  hasPreviousPage: false,
  hasNextPage: false,
  startCursor: null,
  endCursor: null,
};

export const meta: MetaFunction = ({data}) => {
  const collection = (data as any)?.collection;
  return [
    {title: collection?.seo?.title ?? collection?.title ?? 'Collection'},
    {name: 'description', content: collection?.seo?.description ?? collection?.description ?? ''},
  ];
};

function parsePrice(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function safeSortKey(value: string | null): string {
  return SORT_OPTIONS.some((option) => option.value === value) ? String(value) : 'COLLECTION_DEFAULT';
}

function productSortKey(collectionSortKey: string): string {
  if (collectionSortKey === 'CREATED') return 'CREATED_AT';
  if (collectionSortKey === 'COLLECTION_DEFAULT') return 'TITLE';
  return collectionSortKey;
}

function buildCollectionFilters(url: URL) {
  const filters: Record<string, unknown>[] = [];
  const min = parsePrice(url.searchParams.get('minPrice'));
  const max = parsePrice(url.searchParams.get('maxPrice'));
  const availability = url.searchParams.get('availability');
  const category = url.searchParams.get('category');

  if (min !== undefined || max !== undefined) {
    filters.push({price: {min, max}});
  }

  if (availability === 'in-stock') filters.push({available: true});
  if (availability === 'out-of-stock') filters.push({available: false});
  if (category) filters.push({productType: category});

  for (const rawFilter of url.searchParams.getAll('filter')) {
    try {
      const parsed = JSON.parse(rawFilter);
      if (parsed && typeof parsed === 'object') filters.push(parsed);
    } catch {
      console.warn('Ignoring invalid Storefront filter input:', rawFilter);
    }
  }

  return filters;
}

function makeEmptyCollection(handle: string, error?: string) {
  const title = handle === 'all'
    ? 'All Products'
    : handle
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

  return {
    id: `local-${handle}`,
    handle,
    title,
    description: error ?? 'Products will appear here when this collection is available in Shopify.',
    seo: {title, description: error ?? ''},
    image: null,
    products: {
      filters: [],
      nodes: [],
      pageInfo: EMPTY_PAGE_INFO,
    },
  };
}

async function loadCollectionProducts({
  context,
  handle,
  first,
  endCursor,
  startCursor,
  sortKey,
  reverse,
  filters,
}: {
  context: LoaderFunctionArgs['context'];
  handle: string;
  first: number;
  endCursor?: string;
  startCursor?: string;
  sortKey: string;
  reverse: boolean;
  filters: Record<string, unknown>[];
}) {
  const {storefront} = context;

  const data = await withTimeout(storefront.query(COLLECTION_QUERY, {
    cache: storefront.CacheShort(),
    variables: {
      handle,
      first,
      startCursor,
      endCursor,
      sortKey,
      reverse,
      filters,
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  }), 7000, `collection ${handle}`);

  return (data as any)?.collection ?? null;
}

async function loadProductSearch({
  context,
  handle,
  first,
  endCursor,
  sortKey,
  reverse,
}: {
  context: LoaderFunctionArgs['context'];
  handle: string;
  first: number;
  endCursor?: string;
  sortKey: string;
  reverse: boolean;
}) {
  const {storefront} = context;
  const query = handle === 'all' ? undefined : handle.replace(/-/g, ' ');

  const data = await withTimeout(storefront.query(PRODUCTS_QUERY, {
    cache: storefront.CacheShort(),
    variables: {
      query,
      first,
      endCursor,
      sortKey: productSortKey(sortKey),
      reverse,
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  }), 7000, `products ${handle}`);

  const products = (data as any)?.products ?? {nodes: [], filters: [], pageInfo: EMPTY_PAGE_INFO};
  return {
    ...makeEmptyCollection(handle),
    description: handle === 'all' ? 'Browse every product in the store.' : `Search results for ${handle.replace(/-/g, ' ')}.`,
    products,
  };
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Response('Not found', {status: 404});

  const url = new URL(request.url);
  const sortKey = safeSortKey(url.searchParams.get('sort'));
  const reverse = url.searchParams.get('reverse') === 'true';
  const startCursor = url.searchParams.get('startCursor') ?? undefined;
  const endCursor = url.searchParams.get('endCursor') ?? undefined;
  const filters = buildCollectionFilters(url);

  try {
    let collection = await loadCollectionProducts({
      context,
      handle,
      first: PRODUCTS_PER_PAGE,
      startCursor,
      endCursor,
      sortKey,
      reverse,
      filters,
    });

    if (!collection?.products?.nodes?.length && (handle === 'all' || !collection)) {
      collection = await loadProductSearch({
        context,
        handle,
        first: PRODUCTS_PER_PAGE,
        endCursor,
        sortKey,
        reverse,
      });
    }

    const productConnection = collection?.products ?? {};
    const safeCollection = {
      ...(collection ?? makeEmptyCollection(handle)),
      products: {
        filters: Array.isArray(productConnection.filters) ? productConnection.filters : [],
        nodes: dedupeProducts(productConnection.nodes ?? []),
        pageInfo: productConnection.pageInfo ?? EMPTY_PAGE_INFO,
      },
    };

    return json({collection: safeCollection, error: null});
  } catch (error) {
    console.error('Collection loader error:', error);
    return json({
      collection: makeEmptyCollection(handle, 'We could not load this collection. Please try again shortly.'),
      error: 'COLLECTION_LOAD_FAILED',
    });
  }
}

function linkWith(searchParams: URLSearchParams, updates: Record<string, string | null>) {
  const params = new URLSearchParams(searchParams);
  params.delete('endCursor');
  params.delete('startCursor');

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === '') params.delete(key);
    else params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : '?';
}

function productPrice(product: ProductLike): number {
  const value = Number.parseFloat(String(product.priceRange?.minVariantPrice?.amount ?? '0'));
  return Number.isFinite(value) ? value : 0;
}

function applyClientFilters(products: ProductLike[], searchParams: URLSearchParams) {
  const minPrice = parsePrice(searchParams.get('minPrice'));
  const maxPrice = parsePrice(searchParams.get('maxPrice'));
  const availability = searchParams.get('availability');
  const minimumRating = Number.parseFloat(searchParams.get('rating') ?? '');

  let filtered = dedupeProducts(products);

  if (minPrice !== undefined) filtered = filtered.filter((product) => productPrice(product) >= minPrice);
  if (maxPrice !== undefined) filtered = filtered.filter((product) => productPrice(product) <= maxPrice);
  if (availability === 'in-stock') filtered = filtered.filter((product) => getFirstVariant(product)?.availableForSale !== false);
  if (availability === 'out-of-stock') filtered = filtered.filter((product) => getFirstVariant(product)?.availableForSale === false);
  if (Number.isFinite(minimumRating)) filtered = filterProductsByRating(filtered, minimumRating);

  return filtered;
}

export default function CollectionPage() {
  const {collection, error} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const fetcher = useFetcher<typeof loader>();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const initialProducts = useMemo(
    () => applyClientFilters((collection.products.nodes ?? []) as ProductLike[], searchParams),
    [collection.products.nodes, searchParams],
  );
  const [allProducts, setAllProducts] = useState<ProductLike[]>(initialProducts);
  const [pageInfo, setPageInfo] = useState(collection.products.pageInfo ?? EMPTY_PAGE_INFO);
  const isLoading = navigation.state === 'loading';

  useEffect(() => {
    setAllProducts(initialProducts);
    setPageInfo(collection.products.pageInfo ?? EMPTY_PAGE_INFO);
  }, [collection.handle, initialProducts, collection.products.pageInfo]);

  useEffect(() => {
    if (fetcher.state !== 'idle' || !fetcher.data) return;
    const nextProducts = (fetcher.data as any).collection?.products;
    if (!nextProducts?.nodes?.length) return;

    setAllProducts((current) => dedupeProducts([...current, ...applyClientFilters(nextProducts.nodes, searchParams)]));
    setPageInfo(nextProducts.pageInfo ?? EMPTY_PAGE_INFO);
  }, [fetcher.data, fetcher.state, searchParams]);

  function loadMore() {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor) return;
    const params = new URLSearchParams(searchParams);
    params.set('endCursor', pageInfo.endCursor);
    fetcher.load(`/collections/${collection.handle}?${params.toString()}`);
  }

  const activeSort = searchParams.get('sort') || 'COLLECTION_DEFAULT';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const rating = searchParams.get('rating');
  const availability = searchParams.get('availability');
  const productFilters = Array.isArray(collection.products.filters) ? collection.products.filters : [];

  return (
    <div className="container mx-auto px-6 py-10 md:py-14">
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-3">Shop by category</p>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter mb-4 leading-none">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-neutral-500 max-w-xl text-lg leading-relaxed">{collection.description}</p>
        )}
        {error && (
          <p className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
            Storefront data is temporarily unavailable, so this page is showing a safe empty state.
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-60 shrink-0 space-y-5">
          <FilterPanel title="Sort By">
            {SORT_OPTIONS.map((option) => (
              <Link
                key={option.label}
                to={linkWith(searchParams, {sort: option.value, reverse: String(option.reverse)})}
                className={cn(
                  'text-sm font-medium px-2 py-1.5 rounded-md transition-colors',
                  activeSort === option.value ? 'bg-brand-50 text-brand-600 font-bold' : 'text-neutral-600 hover:text-brand-500 hover:bg-neutral-50',
                )}
              >
                {option.label}
              </Link>
            ))}
          </FilterPanel>

          <FilterPanel title="Price">
            {[
              {label: 'Under Rs. 2,000', updates: {minPrice: null, maxPrice: '2000'}},
              {label: 'Rs. 2,000 - Rs. 5,000', updates: {minPrice: '2000', maxPrice: '5000'}},
              {label: 'Rs. 5,000 - Rs. 10,000', updates: {minPrice: '5000', maxPrice: '10000'}},
              {label: 'Over Rs. 10,000', updates: {minPrice: '10000', maxPrice: null}},
            ].map((price) => (
              <Link key={price.label} to={linkWith(searchParams, price.updates)} className="text-sm font-medium text-neutral-600 hover:text-brand-500 hover:bg-brand-50 px-2 py-1.5 rounded-md transition-colors">
                {price.label}
              </Link>
            ))}
          </FilterPanel>

          <FilterPanel title="Availability">
            {[
              {label: 'In stock', value: 'in-stock'},
              {label: 'Out of stock', value: 'out-of-stock'},
            ].map((item) => (
              <Link
                key={item.value}
                to={linkWith(searchParams, {availability: availability === item.value ? null : item.value})}
                className={cn(
                  'text-sm font-medium px-2 py-1.5 rounded-md transition-colors',
                  availability === item.value ? 'bg-brand-50 text-brand-600 font-bold' : 'text-neutral-600 hover:text-brand-500 hover:bg-neutral-50',
                )}
              >
                {item.label}
              </Link>
            ))}
          </FilterPanel>

          <FilterPanel title="Rating">
            {[4, 3, 2].map((stars) => (
              <Link
                key={stars}
                to={linkWith(searchParams, {rating: rating === String(stars) ? null : String(stars)})}
                className={cn(
                  'text-sm font-medium px-2 py-1.5 rounded-md transition-colors',
                  rating === String(stars) ? 'bg-brand-50 text-brand-600 font-bold' : 'text-neutral-600 hover:text-brand-500 hover:bg-neutral-50',
                )}
              >
                {stars} stars and up
              </Link>
            ))}
          </FilterPanel>

          <FilterPanel title="Categories">
            {CATEGORY_OPTIONS.map((category) => (
              <Link key={category.href} to={category.href} className="text-sm font-medium text-neutral-600 hover:text-brand-500 hover:bg-brand-50 px-2 py-1.5 rounded-md transition-colors">
                {category.label}
              </Link>
            ))}
          </FilterPanel>

          {productFilters.map((filter: any) => (
            <FilterPanel key={filter.id} title={filter.label}>
              {(filter.values ?? []).slice(0, 8).map((value: any) => {
                const currentFilters = searchParams.getAll('filter');
                const encodedInput = value.input;
                const isActive = currentFilters.includes(encodedInput);
                const params = new URLSearchParams(searchParams);
                params.delete('filter');
                currentFilters
                  .filter((input) => input !== encodedInput)
                  .forEach((input) => params.append('filter', input));
                if (!isActive) params.append('filter', encodedInput);
                const query = params.toString();

                return (
                  <Link
                    key={value.id}
                    to={query ? `?${query}` : '?'}
                    className={cn(
                      'text-sm font-medium px-2 py-1.5 rounded-md transition-colors flex justify-between items-center',
                      isActive ? 'bg-brand-50 text-brand-600 font-bold' : 'text-neutral-600 hover:text-brand-500 hover:bg-neutral-50',
                    )}
                  >
                    <span>{value.label}</span>
                    <span className="text-[10px] text-neutral-300">({value.count})</span>
                  </Link>
                );
              })}
            </FilterPanel>
          ))}
        </aside>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-neutral-100 gap-4">
            <div className="flex items-center gap-6">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {isLoading ? 'Updating...' : `${allProducts.length} Products`}
              </p>

              <div className="flex bg-neutral-100 p-0.5 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className={cn('p-1.5 rounded-md transition-all', view === 'grid' ? 'bg-white shadow-sm text-brand-600' : 'text-neutral-400 hover:text-neutral-600')}
                  aria-label="Grid view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={cn('p-1.5 rounded-md transition-all', view === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-neutral-400 hover:text-neutral-600')}
                  aria-label="List view"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                minPrice && {label: `Min Rs. ${minPrice}`, key: 'minPrice'},
                maxPrice && {label: `Max Rs. ${maxPrice}`, key: 'maxPrice'},
                availability && {label: availability === 'in-stock' ? 'In stock' : 'Out of stock', key: 'availability'},
                rating && {label: `${rating}+ stars`, key: 'rating'},
              ].filter(Boolean).map((chip: any) => (
                <Link
                  key={chip.key}
                  to={linkWith(searchParams, {[chip.key]: null})}
                  className="flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full border border-brand-100 hover:bg-brand-100 transition-colors"
                >
                  {chip.label}
                  <span className="text-brand-300">x</span>
                </Link>
              ))}
              {searchParams.toString() && (
                <Link to="?" className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 transition-colors underline ml-2">
                  Clear all
                </Link>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {Array.from({length: 6}).map((_, index) => <ProductCardSkeleton key={index} />)}
            </div>
          ) : allProducts.length > 0 ? (
            <div className={cn('grid gap-6 md:gap-8', view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1')}>
              {allProducts.map((product) => (
                <ProductCard key={product.id ?? product.handle} product={product as any} view={view} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-12 text-center">
              <h2 className="text-xl font-black text-neutral-900">No products found</h2>
              <p className="text-sm text-neutral-500 mt-2">Try clearing filters or checking the Shopify collection handle.</p>
              <Link to="/collections/all" className="btn btn-primary mt-6">Shop all products</Link>
            </div>
          )}

          {pageInfo.hasNextPage && (
            <div className="flex justify-center mt-16">
              <button
                type="button"
                onClick={loadMore}
                disabled={fetcher.state !== 'idle'}
                className="btn btn-secondary !h-14 px-12 !text-base"
              >
                {fetcher.state !== 'idle' ? 'Loading...' : 'Explore More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({title, children}: {title: string; children: ReactNode}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3">
      <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">{title}</h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}
