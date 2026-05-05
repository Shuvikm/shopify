import {Link} from '@remix-run/react';
import {useState, useEffect} from 'react';

const SLIDES = [
  {
    subtitle: 'The 2026 Collection',
    headline: 'Timeless Elegance Redefined',
    description: 'Discover the art of minimalist design through our curated collection of premium accessories and lifestyle essentials.',
    cta: 'Explore Collection',
    href: '/collections/accessories',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop&auto=format&q=90',
    alignment: 'left',
  },
  {
    subtitle: 'Craftsmanship First',
    headline: 'Detail in Every Thread',
    description: 'Bespoke apparel designed for those who appreciate the finer details of modern tailoring and sustainable luxury.',
    cta: 'View Apparel',
    href: '/collections/apparel',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&auto=format&q=90',
    alignment: 'right',
  },
  {
    subtitle: 'Accessories Atelier',
    headline: 'Crafted for the Connoisseur',
    description: 'Each piece tells a story of heritage craftsmanship — from hand-stitched leather to precision-set gemstones.',
    cta: 'Shop Accessories',
    href: '/collections/accessories',
    img: 'https://images.unsplash.com/photo-1523170335258-f87a2d362db2?w=1920&h=1080&fit=crop&auto=format&q=90',
    alignment: 'left',
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 8000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="relative w-full h-[90vh] overflow-hidden bg-paper">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full overflow-hidden">
          <img
            key={slide.img}
            src={slide.img}
            alt=""
            className="w-full h-full object-cover animate-slowZoom"
            loading={active === 0 ? "eager" : "lazy"}
            fetchPriority={active === 0 ? "high" : "low"}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-brand-primary/10 backdrop-contrast-[1.1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper/40 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="container relative z-10 h-full flex items-center">
        <div className={`max-w-2xl px-6 md:px-12 transition-all duration-1000 transform ${active % 2 === 0 ? 'ml-0' : 'ml-auto text-right'}`}>
          <div className="overflow-hidden mb-6">
            <p className="text-brand-accent font-sans text-xs uppercase tracking-[0.3em] animate-slide-in-left">
              {slide.subtitle}
            </p>
          </div>
          
          <h1 className="text-brand-primary mb-8 animate-fadeIn">
            {slide.headline}
          </h1>
          
          <p className="text-neutral-700 text-lg mb-12 max-w-lg leading-relaxed animate-fadeIn opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
            {slide.description}
          </p>
          
          <div className={`flex items-center gap-8 animate-fadeIn opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards] ${active % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <Link
              to={slide.href}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-brand-primary text-white text-sm uppercase tracking-widest hover:bg-brand-accent transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10">{slide.cta}</span>
              <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            
            <Link 
              to="/collections/all" 
              className="text-brand-primary text-xs uppercase tracking-widest border-b border-brand-primary/20 hover:border-brand-primary transition-all py-1"
            >
              Shop All
            </Link>
          </div>
        </div>
      </div>

      {/* Luxury Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-end gap-6">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group flex flex-col items-center gap-3"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className={`text-[10px] tracking-widest transition-all ${i === active ? 'text-brand-accent' : 'text-brand-primary/40'}`}>
              0{i + 1}
            </span>
            <div className={`h-[1px] transition-all duration-700 ${i === active ? 'w-16 bg-brand-accent' : 'w-8 bg-brand-primary/20 group-hover:w-12'}`} />
          </button>
        ))}
      </div>
      
      {/* Decorative side element */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 z-10 hidden lg:block overflow-hidden">
        <p className="text-[10px] uppercase tracking-[0.5em] text-brand-primary/20 [writing-mode:vertical-rl] rotate-180">
          ESTABLISHED IN 2026 — PARIS • LONDON • NEW YORK
        </p>
      </div>
    </section>
  );
}
