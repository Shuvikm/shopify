/**
 * @file components/CategoryCard.tsx
 * @description Reusable category card component with images
 */
import {Link} from '@remix-run/react';
import {cn} from '~/lib/utils';

interface CategoryCardProps {
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
  featured?: boolean;
  className?: string;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  electronics:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop',
  fashion:
    'https://images.unsplash.com/photo-1595637707802-0b656c55af02?w=500&h=400&fit=crop',
  home:
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
  beauty: 'https://images.unsplash.com/photo-1556304603-acf75860ba96?w=500&h=400&fit=crop',
  sports:
    'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=400&fit=crop',
  books:
    'https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=500&h=400&fit=crop',
  toys: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=400&fit=crop',
  food: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop',
};

function getCategoryImage(name: string, provided?: string): string {
  if (provided) return provided;

  const slug = name.toLowerCase().replace(/\s+/g, '');
  return (
    DEFAULT_CATEGORY_IMAGES[slug] ||
    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop&q=80`
  );
}

export function CategoryCard({
  name,
  slug,
  image,
  productCount,
  featured = false,
  className,
}: CategoryCardProps) {
  const categoryImage = getCategoryImage(name, image);

  return (
    <Link
      to={`/collections/${slug}`}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'hover:shadow-2xl transition-all duration-300',
        featured ? 'md:col-span-2 md:row-span-2' : '',
        className,
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={categoryImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50 group-hover:from-black/50 group-hover:to-black/70 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 text-white min-h-[250px] md:min-h-[300px]">
        <h3
          className={cn(
            'font-black tracking-tight transition-all duration-300',
            featured ? 'text-3xl md:text-4xl mb-3' : 'text-2xl md:text-3xl mb-2',
          )}
        >
          {name}
        </h3>

        {productCount !== undefined && (
          <p className="text-sm font-semibold text-yellow-300 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {productCount} products
          </p>
        )}

        {/* CTA Button */}
        <button
          className={cn(
            'w-full py-3 px-4 rounded-xl',
            'bg-[#f6c90e] text-black font-black text-sm uppercase tracking-widest',
            'hover:bg-yellow-400 transform group-hover:scale-105',
            'transition-all duration-300',
            'opacity-0 group-hover:opacity-100',
          )}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `/collections/${slug}`;
          }}
        >
          Shop {name}
        </button>
      </div>
    </Link>
  );
}

interface CategoryGridProps {
  categories: Array<{name: string; slug: string; count?: number; image?: string}>;
  className?: string;
}

export function CategoryGrid({categories, className}: CategoryGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
        'auto-rows-[300px] md:auto-rows-[350px]',
        className,
      )}
    >
      {categories.map((cat, idx) => (
        <CategoryCard
          key={cat.slug}
          name={cat.name}
          slug={cat.slug}
          image={cat.image}
          productCount={cat.count}
          featured={idx === 0}
        />
      ))}
    </div>
  );
}
