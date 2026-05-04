export function BrandStory() {
  return (
    <div className="space-y-32">
      {/* Editorial Chapter 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 md:gap-24">
        <div className="order-2 lg:order-1 relative group overflow-hidden">
          <img 
            src="/about_luxury_1.webp" 
            alt="Craftsmanship" 
            className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand-primary/5" />
        </div>
        <div className="order-1 lg:order-2 space-y-8 px-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent">Chapter I</p>
          <h2 className="text-brand-primary">The Art of Refinement</h2>
          <p className="text-neutral-600 font-light leading-relaxed max-w-lg">
            Our journey began in a small atelier with a single conviction: that true luxury is not found in the loud or the ornate, but in the quiet perfection of the essential.
          </p>
          <p className="text-neutral-600 font-light leading-relaxed max-w-lg">
            We spent years sourcing materials that met our uncompromising standards—from GOTS-certified organic cotton to ethically harvested exotic leathers.
          </p>
        </div>
      </section>

      {/* Philosophy Block */}
      <section className="bg-brand-primary py-24 md:py-32 text-center text-white px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-accent">Our Philosophy</p>
          <h3 className="text-white font-serif italic text-3xl md:text-5xl leading-tight">
            "We design for the individual who values substance over status, and legacy over trends."
          </h3>
          <div className="w-16 h-[1px] bg-brand-accent mx-auto" />
        </div>
      </section>

      {/* Chapter 2 */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 md:gap-24">
        <div className="space-y-8 px-6 lg:pl-24">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent">Chapter II</p>
          <h2 className="text-brand-primary">Legacy in the Making</h2>
          <p className="text-neutral-600 font-light leading-relaxed max-w-lg">
            Every piece in our collection is designed to be a lifelong companion. We prioritize durability and timeless silhouettes that transcend seasons.
          </p>
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-brand-primary/5">
            <div>
              <p className="text-2xl font-serif text-brand-primary mb-2">120+</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">Artisans</p>
            </div>
            <div>
              <p className="text-2xl font-serif text-brand-primary mb-2">100%</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">Traceable</p>
            </div>
          </div>
        </div>
        <div className="relative group overflow-hidden">
          <img 
            src="/about_luxury_2.webp" 
            alt="Atelier" 
            className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-brand-primary/5" />
        </div>
      </section>
    </div>
  );
}
