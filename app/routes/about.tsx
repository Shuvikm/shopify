import {type MetaFunction} from '@remix-run/server-runtime';
import {Link} from '@remix-run/react';
import {BrandStory} from '~/components/sections/BrandStory';

export const meta: MetaFunction = () => [
  {title: 'Our Story — The Collection'},
  {
    name: 'description',
    content: 'Discover the philosophy and craftsmanship behind The Collection. Our journey towards timeless elegance and sustainable luxury.'
  },
];

export default function About() {
  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <section className="py-24 md:py-32 text-center border-b border-brand-primary/5">
        <div className="container mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-8">Established 2026</p>
          <h1 className="text-brand-primary mb-12">The Archive of Elegance</h1>
          <div className="w-[1px] h-16 bg-brand-accent mx-auto" />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24 md:py-32">
        <BrandStory />
      </div>

      {/* Values Grid */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-4">Core Values</p>
            <h2 className="text-brand-primary">Built on Conviction</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {title: 'Inherent Quality', desc: 'We source only the finest raw materials, ensuring longevity in every stitch.'},
              {title: 'Radical Honesty', desc: 'Direct-to-consumer pricing with total transparency on our supply chain.'},
              {title: 'Quiet Luxury', desc: 'Designed for the discerning individual, not the fleeting trend.'},
            ].map((v, i) => (
              <div key={i} className="space-y-6">
                <div className="w-12 h-[1px] bg-brand-accent" />
                <h3 className="text-brand-primary text-xl font-serif">{v.title}</h3>
                <p className="text-neutral-500 font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-brand-primary mb-12 italic font-serif">"Wear your values."</h2>
          <Link 
            to="/collections/all" 
            className="inline-flex px-12 py-5 bg-brand-primary text-white text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent transition-all duration-700 shadow-xl shadow-brand-primary/5"
          >
            Explore the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
