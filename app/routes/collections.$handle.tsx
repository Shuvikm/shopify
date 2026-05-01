/**
 * @file routes/collections.$handle.tsx
 * @description Collection page with filter sidebar and sorting.
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, useFetcher, useNavigation, Link, useSearchParams, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {COLLECTION_QUERY} from '~/graphql/CollectionQuery';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';
import {cn} from '~/lib/utils';

const PRODUCTS_PER_PAGE = 12;

export const meta: MetaFunction = ({data}) => {
  const col = (data as any)?.collection;
  return [
    {title: col?.seo?.title ?? col?.title ?? 'Collection'},
    {name: 'description', content: col?.seo?.description ?? col?.description ?? ''},
  ];
};

import {MOCK_PRODUCTS} from '~/config/mock';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});

  const url = new URL(request.url);
  const sortKey = url.searchParams.get('sort') ?? 'COLLECTION_DEFAULT';
  const reverse = url.searchParams.get('reverse') === 'true';
  const startCursor = url.searchParams.get('startCursor') ?? undefined;
  const endCursor = url.searchParams.get('endCursor') ?? undefined;

  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');

  const filters: any[] = [];
  
  // Price filters
  if (minPrice || maxPrice) {
    filters.push({
      price: {
        min: minPrice ? parseFloat(minPrice) : undefined,
        max: maxPrice ? parseFloat(maxPrice) : undefined,
      },
    });
  }

  // Dynamic filters from URL
  const dynamicFilters = url.searchParams.getAll('filter');
  dynamicFilters.forEach(f => {
    try {
      filters.push(JSON.parse(f));
    } catch (e) {
      console.error('Failed to parse filter:', f);
    }
  });

  let {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      first: PRODUCTS_PER_PAGE,
      startCursor,
      endCursor,
      sortKey,
      reverse,
      filters,
      language: context.storefront.i18n.language,
      country: context.storefront.i18n.country,
    },
  });

  // Fallback for 'all' or missing collections
  if (!collection || !collection.products?.nodes?.length) {
    collection = {
      title: handle === 'all' ? 'All Products' : handle.charAt(0).toUpperCase() + handle.slice(1),
      handle,
      description: `Explore our curated selection of ${handle} gear.`,
      products: {
        nodes: MOCK_PRODUCTS,
        pageInfo: {
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: null,
          endCursor: null,
        }
      },
    };
  }

  return defer({collection});
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        id
        title
        handle
        vendor
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
          width
          height
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

const SORT_OPTIONS = [
  {label: 'Featured', value: 'COLLECTION_DEFAULT', reverse: false},
  {label: 'Price: Low to High', value: 'PRICE', reverse: false},
  {label: 'Price: High to Low', value: 'PRICE', reverse: true},
  {label: 'Newest Arrivals', value: 'CREATED', reverse: true},
];

export default function CollectionPage() {
  const {collection} = useLoaderData<typeof loader>();
  const {products} = collection;
  const [allProducts, setAllProducts] = useState(products.nodes);
  const [pageInfo, setPageInfo] = useState(products.pageInfo);
  const fetcher = useFetcher<typeof loader>();
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const isLoading = navigation.state === 'loading';

  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const activeSort = searchParams.get('sort') || 'COLLECTION_DEFAULT';

  function loadMore() {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor) return;
    fetcher.load(`/collections/${collection.handle}?endCursor=${pageInfo.endCursor}`);
  }

  if (fetcher.data && fetcher.state === 'idle') {
    const newProducts = (fetcher.data as any).collection?.products;
    if (newProducts && newProducts.pageInfo.endCursor !== pageInfo.endCursor) {
      setAllProducts((prev: any) => [...prev, ...newProducts.nodes]);
      setPageInfo(newProducts.pageInfo);
    }
  }

  return (
    <div className="container mx-auto px-6 py-10 md:py-14">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-neutral-900 tracking-tighter mb-4 leading-none">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="text-neutral-500 max-w-xl text-lg leading-relaxed">{collection.description}</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="lg:w-56 shrink-0 space-y-6">
          {/* Sort */}
          <div className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Sort By</h3>
            <div className="flex flex-col gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.label}
                  to={`?sort=${opt.value}&reverse=${opt.reverse}${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`}
                  className={cn(
                    "text-sm font-medium px-2 py-1.5 rounded-md transition-colors",
                    activeSort === opt.value ? "bg-brand-50 text-brand-600 font-bold" : "text-neutral-600 hover:text-brand-500 hover:bg-neutral-50"
                  )}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Price</h3>
            <div className="flex flex-col gap-1.5">
              {[
                {label: 'Under ₹2,000',    href: '?maxPrice=2000'},
                {label: '₹2,000 – ₹5,000', href: '?minPrice=2000&maxPrice=5000'},
                {label: '₹5,000 – ₹10,000',href: '?minPrice=5000&maxPrice=10000'},
                {label: 'Over ₹10,000',    href: '?minPrice=10000'},
              ].map(p => (
                <Link key={p.label} to={p.href} className="text-sm font-medium text-neutral-600 hover:text-brand-500 hover:bg-brand-50 px-2 py-1.5 rounded-md transition-colors">
                  {p.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Dynamic Filters from API */}
          {products.filters.map((filter: any) => (
            <div key={filter.id} className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">{filter.label}</h3>
              <div className="flex flex-col gap-1.5">
                {filter.values.map((val: any) => {
                  const isActive = searchParams.toString().includes(encodeURIComponent(val.input));
                  return (
                    <Link
                      key={val.id}
                      to={isActive ? '?' : `?filter=${encodeURIComponent(val.input)}`}
                      className={cn(
                        "text-sm font-medium px-2 py-1.5 rounded-md transition-colors flex justify-between items-center",
                        isActive ? "bg-brand-50 text-brand-600 font-bold" : "text-neutral-600 hover:text-brand-500 hover:bg-neutral-50"
                      )}
                    >
                      <span>{val.label}</span>
                      <span className="text-[10px] text-neutral-300">({val.count})</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Fallback Categories if no API filters */}
          {products.filters.length === 0 && (
            <div className="bg-white rounded-xl border border-neutral-100 p-4 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Categories</h3>
              <div className="flex flex-col gap-1.5">
                {[
                  ['All Products',    '/collections/all'],
                  ['Watches',         '/collections/accessories'],
                  ['Dresses',         '/collections/apparel'],
                  ['Shoes',           '/collections/footwear'],
                  ['Coats',           '/collections/winter'],
                ].map(([label, href]) => (
                  <Link key={href} to={href} className="text-sm font-medium text-neutral-600 hover:text-brand-500 hover:bg-brand-50 px-2 py-1.5 rounded-md transition-colors">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-neutral-50 gap-4">
            <div className="flex items-center gap-6">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {allProducts.length} Products
              </p>
              
              {/* View Toggle */}
              <div className="flex bg-neutral-100 p-0.5 rounded-lg shrink-0">
                <button
                  onClick={() => setView('grid')}
                  className={cn("p-1.5 rounded-md transition-all", view === 'grid' ? "bg-white shadow-sm text-brand-600" : "text-neutral-400 hover:text-neutral-600")}
                  aria-label="Grid View"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={cn("p-1.5 rounded-md transition-all", view === 'list' ? "bg-white shadow-sm text-brand-600" : "text-neutral-400 hover:text-neutral-600")}
                  aria-label="List View"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>
                </button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {minPrice && (
                <Link
                  to={`?${new URLSearchParams(Array.from(searchParams.entries()).filter(([k]) => k !== 'minPrice')).toString()}`}
                  className="flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full border border-brand-100 hover:bg-brand-100 transition-colors"
                >
                  Min: ₹{minPrice}
                  <span className="text-brand-300">✕</span>
                </Link>
              )}
              {maxPrice && (
                <Link
                  to={`?${new URLSearchParams(Array.from(searchParams.entries()).filter(([k]) => k !== 'maxPrice')).toString()}`}
                  className="flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full border border-brand-100 hover:bg-brand-100 transition-colors"
                >
                  Max: ₹{maxPrice}
                  <span className="text-brand-300">✕</span>
                </Link>
              )}
              {(minPrice || maxPrice) && (
                <Link to="?" className="text-[10px] font-bold text-neutral-400 hover:text-neutral-600 transition-colors underline ml-2">
                  Clear All
                </Link>
              )}
            </div>
          </div>

          <div className={cn(
            "grid gap-6 md:gap-8",
            view === 'grid' ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
          )}>
            {allProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} view={view} />
            ))}
          </div>

          {pageInfo.hasNextPage && (
            <div className="flex justify-center mt-16">
              <button
                type="button"
                onClick={loadMore}
                disabled={fetcher.state !== 'idle'}
                className="btn btn-secondary !h-14 px-12 !text-base"
              >
                {fetcher.state !== 'idle' ? 'Loading…' : 'Explore More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
