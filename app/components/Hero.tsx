import {Link} from '@remix-run/react';

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden flex items-center">
      {/* Background Image with Parallax-like feel */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <img
          src="https://images.unsplash.com/photo-1519750783826-e2420f4d687f?auto=format&fit=crop&q=80&w=2000"
          alt="Premium Lifestyle"
          className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-400 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-brand-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            New Season Arrival
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6">
            ELEVATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
              YOUR ESSENTIALS.
            </span>
          </h1>
          <p className="text-xl text-neutral-300 mb-10 max-w-lg leading-relaxed">
            Discover the intersection of performance and aesthetics. Curated gear for the modern visionary.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/collections/all"
              className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-brand-500 translate-y-full transition-transform group-hover:translate-y-0" />
            </Link>
            <Link
              to="/pages/about"
              className="text-white font-bold uppercase tracking-widest text-sm border-b-2 border-brand-500/50 pb-1 hover:border-brand-500 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 hidden md:block">
        <div className="flex flex-col items-end gap-2 text-white/50 text-[10px] tracking-[0.5em] uppercase font-bold">
          <span>Est. 2026</span>
          <div className="w-20 h-px bg-white/20" />
          <span>Designed for Precision</span>
        </div>
      </div>
    </section>
  );
}
