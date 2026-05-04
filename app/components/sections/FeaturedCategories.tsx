/**
 * @file sections/FeaturedCategories.tsx
 * @description Amazon-style "Shop by Category" horizontal scroll grid.
 */
import {Link} from '@remix-run/react';
import {CATEGORIES} from '~/config/categories';

export function FeaturedCategories() {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-6">
        <h2 className="text-xl font-black text-neutral-900 mb-6 flex items-center gap-2">
          Shop by Category
          <Link to="/collections/all" className="ml-auto text-xs font-bold text-brand-500 hover:text-brand-700 transition-colors">
            See all →
          </Link>
        </h2>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin lg:grid lg:grid-cols-6 xl:grid-cols-12 lg:overflow-visible">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/collections/${cat.handle}`}
              prefetch="intent"
            className="shrink-0 group text-center w-[110px] lg:w-auto"
            >
              <div className="w-[96px] h-[96px] mx-auto rounded-full overflow-hidden bg-neutral-100 border-2 border-transparent group-hover:border-brand-400 transition-all duration-200 mb-2">
                <img
                  src={cat.image}
                  alt={cat.title}
                  title={cat.description}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><text y='50' x='20' font-size='36'>${cat.emoji}</text></svg>`; }}
                />
              </div>
              <p className="text-[11px] font-semibold text-neutral-700 group-hover:text-brand-600 transition-colors leading-tight">
                {cat.title}
              </p>
              <p className="text-[9px] text-neutral-500 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
