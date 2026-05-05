import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {COLLECTION_QUERY} from '~/graphql';
import {Hero} from '~/components/sections/Hero';
import {FeaturedCategories} from '~/components/sections/FeaturedCategories';
import {USPSection} from '~/components/sections/USPSection';
import {Testimonials} from '~/components/Testimonials';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';
import {dedupeProducts} from '~/lib/products';
import {withTimeout} from '~/lib/async.server';

export const meta: MetaFunction = () => [
  {title: 'The Collection — Curated Luxury & Minimalist Design'},
  {name: 'description', content: 'Explore our curated selection of premium accessories, apparel, and lifestyle essentials. Built for those who appreciate timeless elegance and sustainable craftsmanship.'},
  {property: 'og:title', content: 'The Collection — Curated Luxury'},
  {property: 'og:description', content: 'Premium curated goods. Delivered fast. Loved globally.'},
  {property: 'og:type', content: 'website'},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const featuredCollection = withTimeout(
    storefront.query(COLLECTION_QUERY, {
      cache: storefront.CacheShort(),
      variables: {handle: 'all', first: 8, language: storefront.i18n.language, country: storefront.i18n.country},
    }),
    7000,
    'homepage collection',
  ).catch(() => null);

  return defer({featuredCollection});
}

export default function Homepage() {
  const {featuredCollection} = useLoaderData<typeof loader>();

  return (
    <div className="bg-paper min-h-screen">
      {/* Hero — above the fold, conversion starts here */}
      <Hero />

      {/* Trust strip — right after hero for immediate credibility */}
      <USPSection />

      {/* Shop by Category — Amazon/Flipkart style, all 28 categories */}
      <FeaturedCategories />

      {/* Featured Collection */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-4">The Selection</p>
              <h2 className="text-brand-primary leading-tight">Curated Essentials</h2>
            </div>
            <Link
              to="/collections/all"
              className="text-xs uppercase tracking-[0.2em] text-brand-primary border-b border-brand-primary/20 hover:border-brand-primary transition-all pb-1 whitespace-nowrap self-start md:self-end"
            >
              View Full Archive →
            </Link>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {Array.from({length: 4}).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          }>
            <Await resolve={featuredCollection}>
              {(resolved) => {
                const products = dedupeProducts((resolved as any)?.collection?.products?.nodes ?? []);
                return products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {products.slice(0, 8).map((product: any) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border border-dashed border-brand-primary/10 bg-white/30">
                    <p className="text-neutral-400 font-serif italic">The archive is currently being updated.</p>
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </section>

      {/* Social proof — after product grid builds desire */}
      <Testimonials />

      {/* Brand Philosophy */}
      <section className="py-24 md:py-32 border-y border-brand-primary/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-12">Our Philosophy</p>
          <h2 className="max-w-4xl mx-auto mb-12 leading-[1.1]">
            "We believe in the beauty of simplicity, the integrity of materials, and the value of conscious craftsmanship."
          </h2>
          <div className="w-16 h-[1px] bg-brand-accent mx-auto mb-12" />
          <Link
            to="/about"
            className="text-xs uppercase tracking-[0.2em] text-brand-primary border-b border-brand-primary/20 hover:border-brand-primary transition-all pb-1"
          >
            Discover Our Story
          </Link>
        </div>
      </section>

      {/* Split Collections Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <Link to="/collections/apparel" className="group relative aspect-square md:aspect-auto md:h-[70vh] overflow-hidden border-r border-paper">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=1200&fit=crop&auto=format&q=85"
            alt="Apparel Collection"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-brand-primary/30 group-hover:bg-brand-primary/15 transition-all duration-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p className="text-[10px] uppercase tracking-[0.5em] mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">Explore</p>
            <h2 className="text-white text-5xl font-serif">Apparel</h2>
            <p className="text-white/60 text-xs tracking-widest mt-3 uppercase">The Collection →</p>
          </div>
        </Link>
        <Link to="/collections/accessories" className="group relative aspect-square md:aspect-auto md:h-[70vh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523170335258-f87a2d362db2?w=1200&h=1200&fit=crop&auto=format&q=85"
            alt="Accessories Collection"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-brand-primary/30 group-hover:bg-brand-primary/15 transition-all duration-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p className="text-[10px] uppercase tracking-[0.5em] mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">Explore</p>
            <h2 className="text-white text-5xl font-serif">Accessories</h2>
            <p className="text-white/60 text-xs tracking-widest mt-3 uppercase">The Collection →</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
