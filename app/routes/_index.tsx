/**
 * @file routes/_index.tsx
 * @description Amazon-style homepage with carousel hero, category circles,
 *              deal of the day, best sellers, and featured products grid.
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense, useState, useEffect} from 'react';
import {COLLECTION_QUERY} from '~/graphql';
import {Hero, FeaturedCategories} from '~/components';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';
import {TRUST_BADGES} from '~/config';
import {formatMoney} from '~/lib/utils';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_IMAGES = [
  'https://picsum.photos/id/1/800/1000',
  'https://picsum.photos/id/2/800/1000',
  'https://picsum.photos/id/21/800/1000',
  'https://picsum.photos/id/26/800/1000',
  'https://picsum.photos/id/30/800/1000',
  'https://picsum.photos/id/42/800/1000',
  'https://picsum.photos/id/54/800/1000',
  'https://picsum.photos/id/64/800/1000',
];

const MOCK_PRODUCTS = [
  {title: 'Luxury Chronograph Watch',    id: 'm1',  category: 'Accessories'},
  {title: 'Ultra-Light Running Shoes',   id: 'm2',  category: 'Footwear'},
  {title: 'Classic Wool Trench Coat',    id: 'm3',  category: 'Apparel'},
  {title: 'Bohemian Summer Dress',       id: 'm4',  category: 'Apparel'},
  {title: 'Breathable Sports Shorts',    id: 'm5',  category: 'Apparel'},
  {title: 'Premium Leather Boots',       id: 'm6',  category: 'Footwear'},
  {title: 'Designer Silk Scarf',         id: 'm7',  category: 'Accessories'},
  {title: 'Casual Denim Jacket',         id: 'm8',  category: 'Apparel'},
  {title: 'Titanium Smart Watch',        id: 'm9',  category: 'Accessories'},
  {title: 'Memory Foam Sneakers',        id: 'm10', category: 'Footwear'},
  {title: 'Evening Cocktail Dress',      id: 'm11', category: 'Apparel'},
  {title: 'High-Performance Leggings',   id: 'm12', category: 'Apparel'},
  {title: 'Vintage Leather Belt',        id: 'm13', category: 'Accessories'},
  {title: 'Winter Parka Coat',           id: 'm14', category: 'Winter'},
  {title: 'Quick-Dry Board Shorts',      id: 'm15', category: 'Apparel'},
  {title: 'Suede Chelsea Boots',         id: 'm16', category: 'Footwear'},
].map((p, i) => ({
  id: p.id,
  title: p.title,
  handle: p.title.toLowerCase().replace(/\s+/g, '-'),
  vendor: 'HydroStore Premium',
  description: `Elevate your style with our ${p.title}. This premium item from our ${p.category} collection is designed for those who demand both style and performance.`,
  featuredImage: {url: MOCK_IMAGES[i % MOCK_IMAGES.length], altText: p.title, width: 800, height: 1000},
  priceRange:        {minVariantPrice: {amount: (3500 + i * 1200).toString(), currencyCode: 'INR'}},
  compareAtPriceRange:{minVariantPrice: {amount: (5500 + i * 1200).toString(), currencyCode: 'INR'}},
  variants: {nodes: [{id: `v-${p.id}`, price: {amount: (3500 + i * 1200).toString(), currencyCode: 'INR'}, availableForSale: true}]},
}));

// ─── Countdown Timer ───────────────────────────────────────────────────────────
function useCountdown(hours: number) {
  // Use a fixed end time to avoid resets on HMR
  const [endTime] = useState(() => Date.now() + hours * 3600 * 1000);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, Math.floor((endTime - now) / 1000));
  const h = String(Math.floor(diff / 3600)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  return {h, m, s};
}

// ─── Meta ──────────────────────────────────────────────────────────────────────
export const meta: MetaFunction = () => [
  {title: 'HydroStore — Shop Watches, Dresses, Shoes & More'},
  {name: 'description', content: 'India\'s premium lifestyle store. Free delivery over ₹5,000. Watches, apparel, footwear and accessories at unbeatable prices.'},
];

// ─── Loader ────────────────────────────────────────────────────────────────────
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const featuredCollection = storefront.query(COLLECTION_QUERY, {
    variables: {handle: 'all', first: 16, language: storefront.i18n.language, country: storefront.i18n.country},
  }).then(async (data) => {
    if (!data?.collection?.products?.nodes?.length) {
      const {products} = await storefront.query(HOMEPAGE_PRODUCTS_QUERY, {
        variables: {first: 16, language: storefront.i18n.language, country: storefront.i18n.country},
      });
      return {collection: {products, title: 'Featured Products'}};
    }
    return data;
  }).catch(() => null);
  return defer({featuredCollection});
}

const HOMEPAGE_PRODUCTS_QUERY = `#graphql
  query HomepageProducts($first: Int, $language: LanguageCode, $country: CountryCode)
  @inContext(country: $country, language: $language) {
    products(first: $first) {
      nodes {
        id title handle vendor description
        featuredImage { url altText width height }
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) { nodes { id price { amount currencyCode } availableForSale } }
      }
    }
  }
`;

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Homepage() {
  const {featuredCollection} = useLoaderData<typeof loader>();
  const deal = useCountdown(6);

  return (
    <>
      <Hero />

      {/* ── Trust Badges ──────────────────────────────────────────── */}
      <section className="bg-neutral-800 text-white py-3 border-b border-neutral-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {TRUST_BADGES.map(badge => (
              <div key={badge.label} className="flex items-center gap-2">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────── */}
      <FeaturedCategories />

      {/* ── Deal of the Day ───────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-4">
        <div className="relative overflow-hidden rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white min-h-[220px]">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="/deal_background_luxury_1777624426649.png"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/40 to-transparent" />
          </div>

          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-2 drop-shadow-sm">🔥 Deal of the Day</p>
            <h2 className="text-4xl font-black tracking-tighter leading-none mb-3 drop-shadow-md">Up to 70% Off</h2>
            <p className="text-neutral-200 text-sm font-medium drop-shadow-sm">Exclusive Flash Deals — Limited Quantities</p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Ends in:</p>
              {[{v: deal.h, l: 'HRS'}, {v: deal.m, l: 'MIN'}, {v: deal.s, l: 'SEC'}].map((t, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-center min-w-[64px] shadow-xl">
                  <span className="text-2xl font-black tabular-nums block leading-none mb-1">{t.v}</span>
                  <span className="text-[9px] font-black text-neutral-300 uppercase tracking-tighter">{t.l}</span>
                </div>
              ))}
            </div>
            <Link to="/collections/sale" className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black rounded-2xl transition-all text-sm whitespace-nowrap shadow-lg shadow-yellow-400/20 active:scale-95 uppercase tracking-widest">
              Shop Deals →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-neutral-900">Best Sellers</h2>
            <p className="text-neutral-500 text-sm mt-1">Our most-loved pieces this season.</p>
          </div>
          <Link to="/collections/all" className="text-xs font-bold text-brand-500 hover:text-brand-700 border-b border-brand-300 pb-0.5 transition-colors">
            See all →
          </Link>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({length: 8}).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        }>
          <Await resolve={featuredCollection}>
            {(resolved) => {
              const products = (resolved as any)?.collection?.products?.nodes?.length
                ? (resolved as any).collection.products.nodes
                : MOCK_PRODUCTS;
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {products.filter((p: any) => p?.variants?.nodes?.[0]).map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </section>

      {/* ── New Arrivals Banner ───────────────────────────────────── */}
      <section className="container mx-auto px-6 pb-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {title: 'New Dresses', sub: 'Fresh summer styles', href: '/collections/apparel', bg: 'from-pink-100 to-rose-50', img: '/category_summer_dresses_1777624240455.png'},
            {title: 'Winter Coats', sub: 'Warm & stylish', href: '/collections/winter', bg: 'from-blue-100 to-indigo-50', img: '/category_winter_coats_1777624214972.png'},
            {title: 'Premium Watches', sub: 'Timeless precision', href: '/collections/accessories', bg: 'from-yellow-100 to-amber-50', img: '/category_luxury_watches_1777624154800.png'},
          ].map(b => (
            <Link key={b.title} to={b.href} className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${b.bg} group`}>
              <img src={b.img} alt={b.title} className="w-full h-48 object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl font-black text-neutral-900 leading-none">{b.title}</h3>
                <p className="text-sm text-neutral-600 mt-1">{b.sub}</p>
                <span className="mt-3 text-xs font-black text-brand-600 uppercase tracking-widest">Shop Now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
