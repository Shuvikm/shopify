/**
 * @file sections/FeaturedCategories.tsx
 * @description Amazon-style "Shop by Category" horizontal scroll grid.
 */
import {Link} from '@remix-run/react';

const CATEGORIES = [
  {title: 'Luxury Watches',    handle: 'accessories', image: '/category_luxury_watches_1777624154800.png',  emoji: '⌚'},
  {title: 'Running Shoes',     handle: 'footwear',    image: '/category_running_shoes_1777624191674.png', emoji: '👟'},
  {title: 'Winter Coats',      handle: 'winter',      image: '/category_winter_coats_1777624214972.png',emoji: '🧥'},
  {title: 'Summer Dresses',    handle: 'apparel',     image: '/category_summer_dresses_1777624240455.png', emoji: '👗'},
  {title: 'Sports Shorts',     handle: 'apparel',     image: '/category_sports_shorts_1777624481154.png', emoji: '🩳'},
  {title: 'Bags & Wallets',    handle: 'accessories', image: '/category_bags_wallets_1777624504769.png', emoji: '👜'},
  {title: 'Smart Home',        handle: 'home',        image: '/category_smart_home_1777624524697.png', emoji: '🏠'},
  {title: 'Outdoor Gear',      handle: 'outdoor',     image: '/category_outdoor_gear_1777624545261.png', emoji: '🏕️'},
  {title: 'Premium Tech',      handle: 'tech',        image: '/category_premium_tech_1777624267216.png',  emoji: '💻'},
  {title: 'Jewellery',         handle: 'jewellery',   image: '/category_jewellery_1777624566155.png',emoji: '💍'},
  {title: 'Sunglasses',        handle: 'accessories', image: '/category_sunglasses_1777624588168.png', emoji: '🕶️'},
  {title: 'Skin Care',         handle: 'lifestyle',   image: '/category_skincare_1777624346725.png', emoji: '🧴'},
];

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
              key={cat.title}
              to={`/collections/${cat.handle}`}
              prefetch="intent"
              className="shrink-0 group text-center w-[90px] lg:w-auto"
            >
              <div className="w-[80px] h-[80px] mx-auto rounded-full overflow-hidden bg-neutral-50 border-2 border-transparent group-hover:border-brand-400 transition-all duration-200 mb-2">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><text y='50' x='20' font-size='36'>${cat.emoji}</text></svg>`; }}
                />
              </div>
              <p className="text-[11px] font-semibold text-neutral-700 group-hover:text-brand-600 transition-colors leading-tight">
                {cat.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
