/**
 * @file config/categories.ts
 * @description Centralized category definitions with images and descriptions.
 * Used by FeaturedCategories, Header navigation, and collection filtering.
 */

export interface Category {
  id: string;
  title: string;
  handle: string;
  image: string;
  emoji: string;
  description: string;
  color: string; // For visual consistency in UI
}

function buildCategoryImage(emoji: string, title: string): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#bg)" />
  <circle cx="300" cy="300" r="220" fill="#ffffff" fill-opacity="0.9" />
  <text x="300" y="360" text-anchor="middle" font-size="250">${emoji}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CATEGORIES: Category[] = [
  {
    id: 'luxury-watches',
    title: 'Luxury Watches',
    handle: 'luxury-watches',
    image: buildCategoryImage('⌚', 'Luxury Watches'),
    emoji: '⌚',
    description: 'Premium timepieces from top brands',
    color: 'bg-gold-100',
  },
  {
    id: 'running-shoes',
    title: 'Running Shoes',
    handle: 'running-shoes',
    image: buildCategoryImage('👟', 'Running Shoes'),
    emoji: '👟',
    description: 'Performance footwear for athletes',
    color: 'bg-blue-100',
  },
  {
    id: 'winter-coats',
    title: 'Winter Coats',
    handle: 'winter-coats',
    image: buildCategoryImage('🧥', 'Winter Coats'),
    emoji: '🧥',
    description: 'Warm and stylish outerwear',
    color: 'bg-slate-100',
  },
  {
    id: 'summer-dresses',
    title: 'Summer Dresses',
    handle: 'summer-dresses',
    image: buildCategoryImage('👗', 'Summer Dresses'),
    emoji: '👗',
    description: 'Light and breathable casual wear',
    color: 'bg-pink-100',
  },
  {
    id: 'sports-shorts',
    title: 'Sports Shorts',
    handle: 'sports-shorts',
    image: buildCategoryImage('🩳', 'Sports Shorts'),
    emoji: '🩳',
    description: 'Comfortable athletic wear',
    color: 'bg-green-100',
  },
  {
    id: 'bags-wallets',
    title: 'Bags & Wallets',
    handle: 'bags-wallets',
    image: buildCategoryImage('👜', 'Bags & Wallets'),
    emoji: '👜',
    description: 'Stylish carriers and storage',
    color: 'bg-purple-100',
  },
  {
    id: 'smart-home',
    title: 'Smart Home',
    handle: 'smart-home',
    image: buildCategoryImage('🏠', 'Smart Home'),
    emoji: '🏠',
    description: 'IoT devices for modern living',
    color: 'bg-cyan-100',
  },
  {
    id: 'outdoor-gear',
    title: 'Outdoor Gear',
    handle: 'outdoor-gear',
    image: buildCategoryImage('🏕️', 'Outdoor Gear'),
    emoji: '🏕️',
    description: 'Adventure and camping equipment',
    color: 'bg-amber-100',
  },
  {
    id: 'premium-tech',
    title: 'Premium Tech',
    handle: 'premium-tech',
    image: buildCategoryImage('💻', 'Premium Tech'),
    emoji: '💻',
    description: 'Latest gadgets and electronics',
    color: 'bg-indigo-100',
  },
  {
    id: 'jewellery',
    title: 'Jewellery',
    handle: 'jewellery',
    image: buildCategoryImage('💍', 'Jewellery'),
    emoji: '💍',
    description: 'Exquisite rings, necklaces & more',
    color: 'bg-rose-100',
  },
  {
    id: 'sunglasses',
    title: 'Sunglasses',
    handle: 'sunglasses',
    image: buildCategoryImage('🕶️', 'Sunglasses'),
    emoji: '🕶️',
    description: 'Eye protection with style',
    color: 'bg-orange-100',
  },
  {
    id: 'skincare',
    title: 'Skin Care',
    handle: 'skincare',
    image: buildCategoryImage('🧴', 'Skin Care'),
    emoji: '🧴',
    description: 'Natural and premium skincare products',
    color: 'bg-teal-100',
  },
];

/**
 * Get category by handle (collection name)
 * @param handle - Collection handle (e.g., 'accessories', 'footwear')
 * @returns Matching categories
 */
export function getCategoriesByHandle(handle: string): Category[] {
  return CATEGORIES.filter(cat => cat.handle === handle);
}

/**
 * Get single category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}

/**
 * Get all unique handles for filtering/navigation
 */
export function getAllHandles(): string[] {
  return Array.from(new Set(CATEGORIES.map(cat => cat.handle)));
}
