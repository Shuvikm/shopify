import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {COLLECTION_QUERY} from '~/graphql';
import {Hero} from '~/components/sections/Hero';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';
import {dedupeProducts} from '~/lib/products';
import {withTimeout} from '~/lib/async.server';
import {CategoryCard} from '~/components/sections/CategoryCard';

const CATEGORIES = [
  {title: 'Electronics', handle: 'electronics', image: '/category_electronics.png', description: 'Next-gen devices'},
  {title: 'Fashion', handle: 'fashion', image: '/category_fashion.png', description: 'Premium styles'},
  {title: 'Home & Kitchen', handle: 'home', image: '/category_home.png', description: 'Modern living'},
  {title: 'Beauty', handle: 'beauty', image: '/category_beauty.png', description: 'Radiant care'},
  {title: 'Appliances', handle: 'appliances', image: '/editorial_luxury_1.webp', description: 'Smart home'},
  {title: 'Accessories', handle: 'accessories', image: '/banner_luxury_accessories.webp', description: 'Final touches'},
];


export const meta: MetaFunction = () => [
  {title: 'The Collection — Curated Luxury & Minimalist Design'},
  {name: 'description', content: 'Explore our curated selection of premium accessories, apparel, and lifestyle essentials. Built for those who appreciate timeless elegance and sustainable craftsmanship.'},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const featuredCollection = withTimeout(storefront.query(COLLECTION_QUERY, {
    cache: storefront.CacheShort(),
    variables: {handle: 'all', first: 8, language: storefront.i18n.language, country: storefront.i18n.country},
  }), 7000, 'homepage collection').catch(() => null);

  return defer({featuredCollection});
}

export default function Homepage() {
  const {featuredCollection} = useLoaderData<typeof loader>();

  return (
    <div className="bg-paper min-h-screen">
      <Hero />

      {/* Shop by Category - Amazon/Flipkart Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900">Shop by Category</h2>
              <p className="text-neutral-500 text-sm">Explore our diverse collections</p>
            </div>
            <Link to="/collections" className="text-sm font-bold text-brand-accent hover:underline">
              View All Categories →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.handle} category={cat} />
            ))}
          </div>
        </div>
      </section>


      {/* Brand Ethos Section */}
      <section className="py-24 md:py-32 border-b border-brand-primary/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-12 animate-fadeIn">
            Our Philosophy
          </p>
          <h2 className="max-w-4xl mx-auto mb-12 animate-fadeIn leading-[1.1]">
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

      {/* Featured Collection */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-4">
                The Selection
              </p>
              <h2 className="text-brand-primary leading-tight">
                Curated Essentials
              </h2>
            </div>
            <Link 
              to="/collections/all" 
              className="text-xs uppercase tracking-[0.2em] text-brand-primary border-b border-brand-primary/20 hover:border-brand-primary transition-all pb-1 whitespace-nowrap self-start md:self-end"
            >
              View Full Archive
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
                return (
                  products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                      {products.slice(0, 8).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center border border-dashed border-brand-primary/10 rounded-sm bg-white/30">
                      <p className="text-neutral-400 font-serif italic">The archive is currently being updated.</p>
                    </div>
                  )
                );
              }}
            </Await>
          </Suspense>
        </div>
      </section>

      {/* Editorial Section */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 relative group overflow-hidden">
              <img 
                src="/editorial_luxury_1.webp" 
                alt="Luxury Lifestyle" 
                className="w-full aspect-[16/10] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-transparent transition-all duration-700" />
            </div>
            <div className="lg:col-span-5 lg:pl-12">
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-6">
                Editorial
              </p>
              <h3 className="mb-8 font-serif leading-tight">
                An Infinite State of Being
              </h3>
              <p className="text-neutral-600 mb-10 leading-relaxed font-light">
                Our latest editorial explores the intersection of movement and stillness. A visual journey through the textures and tones that define the modern aesthetic.
              </p>
              <Link 
                to="/journal" 
                className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-brand-primary group"
              >
                Read the Journal
                <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Split Collections Banner */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <Link to="/collections/apparel" className="group relative aspect-square md:aspect-auto md:h-[70vh] overflow-hidden border-r border-paper">
          <img src="/banner_luxury_apparel.webp" alt="Apparel" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-brand-primary/10 transition-all duration-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p className="text-[10px] uppercase tracking-[0.5em] mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">Explore</p>
            <h2 className="text-white text-5xl font-serif">Apparel</h2>
          </div>
        </Link>
        <Link to="/collections/accessories" className="group relative aspect-square md:aspect-auto md:h-[70vh] overflow-hidden">
          <img src="/banner_luxury_accessories.webp" alt="Accessories" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-brand-primary/10 transition-all duration-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p className="text-[10px] uppercase tracking-[0.5em] mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">Explore</p>
            <h2 className="text-white text-5xl font-serif">Accessories</h2>
          </div>
        </Link>
      </section>
    </div>
  );
}
