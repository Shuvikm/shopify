/**
 * @file routes/collections.$handle.tsx
 * @description Collection page with product grid and pagination.
 *
 * Uses cursor-based "Load More" pagination via useFetcher.
 * Server loader runs COLLECTION_QUERY — no client waterfall.
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, useFetcher, useNavigation, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {COLLECTION_QUERY} from '~/graphql/CollectionQuery';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';

const PRODUCTS_PER_PAGE = 12;

export const meta: MetaFunction = ({data}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const startCursor = url.searchParams.get('startCursor') ?? undefined;
  const endCursor = url.searchParams.get('endCursor') ?? undefined;

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      first: PRODUCTS_PER_PAGE,
      startCursor,
      endCursor,
      language: context.storefront.i18n.language,
      country: context.storefront.i18n.country,
    },
  });

  if (!collection) throw new Response(`Collection "${handle}" not found`, {status: 404});

  return defer({collection});
}

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

  // Append newly loaded products
  if (fetcher.data && fetcher.state === 'idle') {
    const newProducts = fetcher.data.collection?.products;
    if (newProducts && newProducts.pageInfo.endCursor !== pageInfo.endCursor) {
      setAllProducts((prev: typeof products.nodes) => [...prev, ...newProducts.nodes]);
      setPageInfo(newProducts.pageInfo);
    }
  }

  return (
    <div className="container mx-auto py-10 md:py-14">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">{collection.title}</h1>
        {collection.description && (
          <p className="text-neutral-500 leading-relaxed">{collection.description}</p>
        )}
      </div>

      {/* Product Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        aria-label={`${collection.title} products`}
      >
        {isLoading
          ? Array.from({length: PRODUCTS_PER_PAGE}).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : allProducts.map((product: (typeof products.nodes)[number]) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {/* Load More */}
      {pageInfo.hasNextPage && (
        <div className="flex justify-center mt-12">
          <button
            type="button"
            onClick={loadMore}
            disabled={fetcher.state !== 'idle'}
            className="btn btn-secondary btn-lg px-10"
            id="collection-load-more-btn"
          >
            {fetcher.state !== 'idle' ? 'Loading…' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
