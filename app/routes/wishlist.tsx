/**
 * @file routes/wishlist.tsx
 * @description Wishlist page — shows items the user has saved.
 */
import {Link, useFetcher} from '@remix-run/react';
import {useEffect} from 'react';
import {useWishlist} from '~/hooks/useWishlist';
import {type MetaFunction} from '@remix-run/react';
import {type LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {NODES_QUERY} from '~/graphql/ProductQuery';
import {ProductCard} from '~/components/product/ProductCard';

export const meta: MetaFunction = () => [
  {title: 'My Wishlist — HydroStore'},
  {name: 'description', content: 'Your saved items on HydroStore.'},
];

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const ids = url.searchParams.getAll('id');

  if (!ids.length) return json({products: []});

  const {nodes} = await context.storefront.query(NODES_QUERY, {
    variables: {
      ids,
      language: context.storefront.i18n.language,
      country: context.storefront.i18n.country,
    },
  });

  return json({products: nodes || []});
}

export default function WishlistPage() {
  const {ids} = useWishlist();
  const fetcher = useFetcher<typeof loader>();

  useEffect(() => {
    if (ids.length > 0) {
      const params = new URLSearchParams();
      ids.forEach(id => params.append('id', id));
      fetcher.load(`/wishlist?${params.toString()}`);
    }
  }, [ids.length]);

  const products = fetcher.data?.products || [];
  const isLoading = fetcher.state === 'loading';

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1 text-neutral-900">My Wishlist ♡</h1>
          <p className="text-neutral-500 text-sm">
            {ids.length === 0 ? 'No items saved yet.' : `${ids.length} item${ids.length > 1 ? 's' : ''} saved`}
          </p>
        </div>
        <Link to="/collections/all" className="text-xs font-bold text-brand-600 hover:underline">
          Continue Shopping →
        </Link>
      </div>

      {ids.length === 0 ? (
        <div className="text-center py-32 space-y-6 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
          <div className="text-6xl grayscale opacity-20">🛒</div>
          <div className="space-y-1">
            <p className="text-xl font-black text-neutral-900">Your wishlist is empty</p>
            <p className="text-neutral-500 text-sm">Save items you like to track them here.</p>
          </div>
          <Link to="/collections/all" className="inline-flex h-12 items-center px-8 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {isLoading && products.length === 0 ? (
            Array.from({length: ids.length}).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-neutral-100 animate-pulse rounded-2xl" />
            ))
          ) : (
            products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
