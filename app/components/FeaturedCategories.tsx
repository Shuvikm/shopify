import {Link} from '@remix-run/react';

const CATEGORIES = [
  {
    title: 'Modern Tech',
    handle: 'tech',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    description: 'Precision engineered tools for work and play.',
  },
  {
    title: 'Daily Rituals',
    handle: 'lifestyle',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
    description: 'Essentials that elevate your everyday routine.',
  },
  {
    title: 'Winter Gear',
    handle: 'winter',
    image: 'https://images.unsplash.com/photo-1418075287427-7f31c7730e1f?auto=format&fit=crop&q=80&w=800',
    description: 'Stay warm and perform at your peak in the snow.',
  },
  {
    title: 'Accessories',
    handle: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    description: 'The small details that make a big difference.',
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-4 leading-none">
              SHOP BY <span className="text-brand-600">CATEGORY.</span>
            </h2>
            <p className="text-neutral-500 text-lg">
              Explore our curated selections designed to fit your unique lifestyle and needs.
            </p>
          </div>
          <Link
            to="/collections"
            className="text-xs font-black uppercase tracking-widest text-brand-600 border-b-2 border-brand-200 pb-1 hover:border-brand-600 transition-all"
          >
            All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.handle}
              to={`/collections/${cat.handle}`}
              className="group relative h-[450px] overflow-hidden rounded-3xl"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-black text-white mb-2 transform transition-transform group-hover:-translate-y-2">
                  {cat.title}
                </h3>
                <p className="text-sm text-neutral-400 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-4 w-10 h-1 bg-brand-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
