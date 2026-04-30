/**
 * @file routes/_index.tsx
 * @description Homepage — hero section + featured collection grid.
 *
 * Uses deferred data so the hero is instantly visible while products stream in.
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {COLLECTION_QUERY} from '~/graphql';
import {ProductCard, ProductCardSkeleton} from '~/components/product';
import {TRUST_BADGES} from '~/config';

export const meta: MetaFunction = () => [
  {title: 'HydroStore — Premium Headless Shopify'},
  {
    name: 'description',
    content:
      'Discover our premium collection of products. Built with Hydrogen + Remix for instant load speeds.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  // Defer the collection so the hero renders immediately
  const featuredCollection = context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: 'frontpage',
      first: 8,
      language: context.storefront.i18n.language,
      country: context.storefront.i18n.country,
    },
  });

  return defer({featuredCollection});
}

export default function Homepage() {
  const {featuredCollection} = useLoaderData<typeof loader>();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-neutral-900 text-white">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto py-28 md:py-40 relative z-10 text-center">
          <span className="inline-block badge bg-brand-500/20 text-brand-300 mb-6 text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-brand-500/30">
            New Season Collection
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            Premium Products,
            <br />
            <span className="text-brand-400">Instant Experience.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Shop our curated collection — powered by Hydrogen + Remix for a
            lightning-fast 95+ Lighthouse score.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/collections/all"
              className="btn btn-primary btn-lg px-8"
              prefetch="intent"
            >
              Shop All Products
            </Link>
            <Link
              to="/collections/new-arrivals"
              className="btn btn-secondary btn-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
              prefetch="intent"
            >
              New Arrivals →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="container mx-auto py-6">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-1">
                <dt className="text-2xl">{badge.icon}</dt>
                <dd className="text-xs font-semibold text-neutral-600">{badge.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="container mx-auto py-16 md:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              Featured Products
            </h2>
            <p className="text-neutral-500 mt-2">Curated picks from our front page.</p>
          </div>
          <Link
            to="/collections/all"
            className="text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors hidden sm:block"
            prefetch="intent"
          >
            View All →
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({length: 8}).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <Await resolve={featuredCollection}>
            {(resolved) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const products = ((resolved as any)?.collection?.products?.nodes ?? []) as Parameters<typeof ProductCard>[0]['product'][];
              if (!products.length) {
                return (
                  <p className="text-neutral-400 text-center py-12">
                    No featured products found. Add products to your "frontpage" collection in Shopify Admin.
                  </p>
                );
              }
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>

        <div className="text-center mt-10 sm:hidden">
          <Link to="/collections/all" className="btn btn-secondary btn-lg">
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}


