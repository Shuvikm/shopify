/**
 * @file routes/collections.$handle.tsx
 * @description Collection page with filter sidebar and sorting.
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, useFetcher, useNavigation, Link, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {COLLECTION_QUERY} from '~/graphql/CollectionQuery';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';

const PRODUCTS_PER_PAGE = 12;

export const meta: MetaFunction = ({data}) => {
  const col = (data as any)?.collection;
  return [
    {title: col?.seo?.title ?? col?.title ?? 'Collection'},
    {name: 'description', content: col?.seo?.description ?? col?.description ?? ''},
  ];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});

  const url = new URL(request.url);
  const sortKey = url.searchParams.get('sort') ?? 'COLLECTION_DEFAULT';
  const reverse = url.searchParams.get('reverse') === 'true';
  const startCursor = url.searchParams.get('startCursor') ?? undefined;
  const endCursor = url.searchParams.get('endCursor') ?? undefined;

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      first: PRODUCTS_PER_PAGE,
      startCursor,
      endCursor,
      sortKey,
      reverse,
      language: context.storefront.i18n.language,
      country: context.storefront.i18n.country,
    },
  });

  if (!collection) throw new Response(`Collection "${handle}" not found`, {status: 404});

  return defer({collection});
}

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
  const isLoading = navigation.state === 'loading';

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

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-64 shrink-0 space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Sort By</h3>
            <div className="flex flex-col gap-2">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.label}
                  to={`?sort=${opt.value}&reverse=${opt.reverse}`}
                  className="text-sm font-bold text-neutral-600 hover:text-brand-500 transition-colors"
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 border-t border-neutral-100 pt-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">Categories</h3>
            <div className="flex flex-col gap-2">
              <Link to="/collections/all" className="text-sm font-bold text-neutral-600 hover:text-brand-500">All Products</Link>
              <Link to="/collections/frontpage" className="text-sm font-bold text-neutral-600 hover:text-brand-500">Featured</Link>
              <Link to="/collections/new-arrivals" className="text-sm font-bold text-neutral-600 hover:text-brand-500">New Arrivals</Link>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-50">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Showing {allProducts.length} Products
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {allProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
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
