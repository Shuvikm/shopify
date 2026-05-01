/**
 * @file routes/_index.tsx
 * @description Homepage — cinematic hero, bundle builder, and featured collections.
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {COLLECTION_QUERY} from '~/graphql';
import {Hero, FeaturedCategories, BundleBuilder, ProductCard, ProductCardSkeleton} from '~/components';
import {TRUST_BADGES} from '~/config';

export const meta: MetaFunction = () => [
  {title: 'HydroStore — Premium Headless Shopify'},
  {
    name: 'description',
    content: 'Discover our premium collection of products. Built with Hydrogen + Remix for instant load speeds.',
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
      <Hero />

      {/* ── Trust Badges ─────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="container mx-auto py-6">
          <dl className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-1">
                <dt className="text-2xl">{badge.icon}</dt>
                <dd className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  {badge.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FeaturedCategories />

      {/* ── Build Your Bundle Feature ─────────────────────────────────── */}
      <section className="container mx-auto px-6">
        <Suspense fallback={<div className="h-[600px] bg-neutral-900 rounded-3xl animate-pulse" />}>
          <Await resolve={featuredCollection}>
            {(resolved: any) => {
              const products = resolved.collection?.products?.nodes ?? [];
              return <BundleBuilder products={products.slice(0, 8)} />;
            }}
          </Await>
        </Suspense>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral-900">
              FEATURED <span className="text-brand-600">PICKS.</span>
            </h2>
            <p className="text-neutral-500 mt-2">Curated products for the discerning buyer.</p>
          </div>
          <Link
            to="/collections/all"
            className="text-sm font-bold uppercase tracking-widest text-brand-500 hover:text-brand-700 transition-colors hidden sm:block"
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
              const products = (resolved as any)?.collection?.products?.nodes ?? [];
              if (!products.length) {
                return <p className="text-neutral-400 text-center py-12">No products found.</p>;
              }
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </section>
    </>
  );
}
