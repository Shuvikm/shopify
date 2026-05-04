import {Link} from '@remix-run/react';

interface Category {
  title: string;
  handle: string;
  image: string;
  description?: string;
}

export function CategoryCard({category}: {category: Category}) {
  return (
    <Link 
      to={`/collections/${category.handle}`}
      prefetch="intent"

      className="group relative overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/5] flex flex-col justify-end p-6"
    >
      <img 
        src={category.image} 
        alt={category.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <h3 className="text-white text-xl font-bold mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {category.title}
        </h3>
        {category.description && (
          <p className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-1">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
