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

// ─── Mock Data for Demo Fallback ──────────────────────────────────────────────
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1418075287427-7f31c7730e1f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1526170315870-ef51865e17c3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800',
];

const MOCK_PRODUCTS = Array.from({length: 16}).map((_, i) => ({
  id: `mock-${i}`,
  title: i % 2 === 0 ? `Premium Tool ${i + 1}` : `Lifestyle Kit ${i + 1}`,
  handle: 'v2-snowboard',
  vendor: 'HydroStore Premium',
  description: 'Engineered for maximum performance and style. A staple for any professional kit.',
  featuredImage: {
    url: MOCK_IMAGES[i % MOCK_IMAGES.length],
    altText: 'Mock Product',
    width: 800,
    height: 1000,
  },
  priceRange: {
    minVariantPrice: {amount: (145 + i * 20).toString(), currencyCode: 'USD'}
  },
  compareAtPriceRange: {
    minVariantPrice: {amount: (195 + i * 20).toString(), currencyCode: 'USD'}
  },
  variants: {
    nodes: [{
      id: `mock-v-${i}`,
      price: {amount: (145 + i * 20).toString(), currencyCode: 'USD'},
      availableForSale: true,
    }]
  }
}));

export const meta: MetaFunction = () => [
  {title: 'HydroStore — Premium Headless Shopify'},
  {
    name: 'description',
    content: 'Discover our premium collection of products. Built with Hydrogen + Remix for instant load speeds.',
  },
];

export async function loader({context}: LoaderFunctionArgs) {
  // Try to fetch 'all' collection as it's more likely to have products than 'frontpage'
  const featuredCollection = context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: 'all', // Changed from 'frontpage' to 'all'
      first: 12,
      language: context.storefront.i18n.language,
      country: context.storefront.i18n.country,
    },
  }).catch(() => null);

  return defer({featuredCollection});
}

export default function Homepage() {
  const {featuredCollection} = useLoaderData<typeof loader>();

  return (
    <>
      <Hero />

      {/* ── Trust Badges ─────────────────────────────────────────────── */}
      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="container mx-auto py-6 px-6">
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
              const products = resolved?.collection?.products?.nodes?.length 
                ? resolved.collection.products.nodes 
                : MOCK_PRODUCTS;
              return <BundleBuilder products={products.slice(0, 12)} />;
            }}
          </Await>
        </Suspense>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral-900 leading-none">
              FEATURED <span className="text-brand-600">PICKS.</span>
            </h2>
            <p className="text-neutral-500 mt-4 text-lg">Our most wanted essentials, curated for you.</p>
          </div>
          <Link
            to="/collections/all"
            className="text-xs font-black uppercase tracking-[0.2em] text-brand-500 hover:text-brand-700 transition-colors hidden sm:block border-b-2 border-brand-500 pb-1"
          >
            Explore All →
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
              const products = (resolved as any)?.collection?.products?.nodes?.length 
                ? (resolved as any).collection.products.nodes 
                : MOCK_PRODUCTS;
              
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
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
