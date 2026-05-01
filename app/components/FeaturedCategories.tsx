import {Link} from '@remix-run/react';

const CATEGORIES = [
  {
    title: 'Modern Tech',
    handle: 'tech',
    image: '/assets/category-tech.png',
    description: 'Precision engineered tools for work and play.',
  },
  {
    title: 'Daily Rituals',
    handle: 'lifestyle',
    image: '/assets/category-lifestyle.png',
    description: 'Essentials that elevate your everyday routine.',
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-4">
              SHOP BY <span className="text-brand-600">CATEGORY.</span>
            </h2>
            <p className="text-neutral-500 text-lg">
              Explore our curated selections designed to fit your unique lifestyle and needs.
            </p>
          </div>
          <Link
            to="/collections"
            className="text-sm font-bold uppercase tracking-widest text-brand-600 border-b-2 border-brand-200 pb-1 hover:border-brand-600 transition-all"
          >
            All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.handle}
              to={`/collections/${cat.handle}`}
              className="group relative h-[500px] overflow-hidden"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <h3 className="text-3xl font-black text-white mb-2 transform transition-transform group-hover:-translate-y-2">
                  {cat.title}
                </h3>
                <p className="text-neutral-300 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  {cat.description}
                </p>
                <div className="mt-6 w-12 h-1 bg-brand-500 transform scale-x-0 transition-transform origin-left group-hover:scale-x-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
