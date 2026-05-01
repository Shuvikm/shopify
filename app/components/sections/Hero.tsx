/**
 * @file sections/Hero.tsx
 * @description Amazon-style rotating deal banner with multiple slides.
 */
import {Link} from '@remix-run/react';
import {useState, useEffect} from 'react';

const SLIDES = [
  {
    badge: '🔥 Deal of the Day',
    headline: 'Up to 70% Off',
    sub: 'Luxury Watches & Premium Accessories',
    cta: 'Shop Now',
    href: '/collections/accessories',
    bg: 'from-neutral-950 to-blue-900',
    accent: 'text-yellow-400',
    img: '/hero_watch_banner_1777624303208.png',
  },
  {
    badge: '⚡ Flash Sale',
    headline: 'New Arrivals',
    sub: 'Designer Coats, Dresses & Footwear',
    cta: 'Explore Collection',
    href: '/collections/apparel',
    bg: 'from-purple-950 to-neutral-900',
    accent: 'text-pink-400',
    img: '/hero_apparel_banner_1777624636523.png',
  },
  {
    badge: '🌟 Best Sellers',
    headline: 'Premium Footwear',
    sub: 'Engineered for comfort. Built for every journey.',
    cta: 'Shop Footwear',
    href: '/collections/footwear',
    bg: 'from-emerald-950 to-neutral-900',
    accent: 'text-emerald-400',
    img: '/hero_footwear_banner_1777624327251.png',
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className={`relative bg-gradient-to-r ${slide.bg} overflow-hidden min-h-[480px] flex items-center transition-all duration-1000`}>
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={slide.img}
          src={slide.img}
          alt=""
          className="w-full h-full object-cover opacity-40 animate-slowZoom"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10 py-16">
        <div className="max-w-xl">
          <span className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-4 ${slide.accent}`}>
            {slide.badge}
          </span>
          <h1 className={`text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-3 ${slide.accent}`}>
            {slide.headline}
          </h1>
          <p className="text-lg text-neutral-200 mb-8 leading-relaxed">{slide.sub}</p>
          <div className="flex items-center gap-4">
            <Link
              to={slide.href}
              className="px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-black uppercase tracking-wider text-sm rounded-lg transition-all active:scale-95 shadow-lg shadow-brand-500/30"
            >
              {slide.cta} →
            </Link>
            <Link to="/collections/all" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
              Shop All
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === active ? 'w-8 bg-white' : 'bg-white/40'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Left/Right arrows */}
      <button
        onClick={() => setActive(a => (a - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
      >
        ‹
      </button>
      <button
        onClick={() => setActive(a => (a + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
      >
        ›
      </button>
    </section>
  );
}
