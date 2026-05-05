import {Link} from '@remix-run/react';
import {CATEGORIES} from '~/config/categories';

// Gradient palette per department — renders entirely in CSS, zero network requests
const DEPT_GRADIENT: Record<string, string> = {
  "Women's Fashion": 'from-rose-400 to-pink-300',
  "Men's Fashion":   'from-blue-500 to-indigo-400',
  'Accessories':     'from-amber-400 to-yellow-300',
  'Footwear':        'from-slate-500 to-gray-400',
  'Beauty':          'from-purple-400 to-pink-300',
  'Home':            'from-emerald-400 to-teal-300',
  'Featured':        'from-neutral-500 to-stone-400',
};

export function FeaturedCategories() {
  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-neutral-900">Shop by Category</h2>
          <Link to="/collections/all" className="text-xs font-bold text-brand-accent hover:underline">
            See all →
          </Link>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory lg:grid lg:grid-cols-7 xl:grid-cols-10 lg:overflow-visible">
          {CATEGORIES.map((cat) => {
            const grad = DEPT_GRADIENT[cat.department] ?? 'from-neutral-400 to-neutral-300';
            return (
              <Link
                key={cat.id}
                to={`/collections/${cat.handle}`}
                prefetch="intent"
                className="shrink-0 snap-start group text-center w-[100px] lg:w-auto"
              >
                {/* CSS gradient circle — no external image dependency */}
                <div className={`w-[88px] h-[88px] mx-auto rounded-full bg-gradient-to-br ${grad} flex items-center justify-center border-[3px] border-transparent group-hover:border-white group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 mb-3`}>
                  <span className="text-3xl leading-none select-none" role="img" aria-label={cat.title}>
                    {cat.emoji}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-neutral-800 group-hover:text-brand-accent transition-colors leading-tight">
                  {cat.title}
                </p>
                <p className="text-[9px] text-neutral-400 mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
