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
  color: string;
}

function emojiSvg(emoji: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f1f5f9"/><stop offset="100%" stop-color="#cbd5e1"/></linearGradient></defs><rect width="600" height="600" fill="url(#bg)"/><circle cx="300" cy="300" r="220" fill="#ffffff" fill-opacity="0.9"/><text x="300" y="360" text-anchor="middle" font-size="250">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CATEGORIES: Category[] = [
  // ── Fashion & Accessories ──────────────────────────────────────────────────
  {
    id: 'luxury-watches',
    title: 'Luxury Watches',
    handle: 'luxury-watches',
    image: '/category_luxury_watches_1777624154800.png',
    emoji: '⌚',
    description: 'Premium timepieces from top brands',
    color: 'bg-amber-100',
  },
  {
    id: 'jewellery',
    title: 'Jewellery',
    handle: 'jewellery',
    image: '/category_jewellery_1777624566155.png',
    emoji: '💍',
    description: 'Exquisite rings, necklaces & more',
    color: 'bg-rose-100',
  },
  {
    id: 'sunglasses',
    title: 'Sunglasses',
    handle: 'sunglasses',
    image: '/category_sunglasses_1777624588168.png',
    emoji: '🕶️',
    description: 'Eye protection with style',
    color: 'bg-orange-100',
  },
  {
    id: 'bags-wallets',
    title: 'Bags & Wallets',
    handle: 'bags-wallets',
    image: '/category_bags_wallets_1777624504769.png',
    emoji: '👜',
    description: 'Stylish carriers and storage',
    color: 'bg-purple-100',
  },

  // ── Clothing ───────────────────────────────────────────────────────────────
  {
    id: 'summer-dresses',
    title: 'Summer Dresses',
    handle: 'summer-dresses',
    image: '/category_summer_dresses_1777624240455.png',
    emoji: '👗',
    description: 'Light and breathable casual wear',
    color: 'bg-pink-100',
  },
  {
    id: 'winter-coats',
    title: 'Winter Coats',
    handle: 'winter-coats',
    image: '/category_winter_coats_1777624214972.png',
    emoji: '🧥',
    description: 'Warm and stylish outerwear',
    color: 'bg-slate-100',
  },

  // ── Footwear ───────────────────────────────────────────────────────────────
  {
    id: 'running-shoes',
    title: 'Running Shoes',
    handle: 'running-shoes',
    image: '/category_running_shoes_1777624191674.png',
    emoji: '👟',
    description: 'Performance footwear for athletes',
    color: 'bg-blue-100',
  },

  // ── Sports & Fitness ───────────────────────────────────────────────────────
  {
    id: 'sports-fitness',
    title: 'Sports & Fitness',
    handle: 'sports-fitness',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=400&fit=crop&auto=format',
    emoji: '🏋️',
    description: 'Gear and apparel for peak performance',
    color: 'bg-green-100',
  },
  {
    id: 'sports-shorts',
    title: 'Sports Shorts',
    handle: 'sports-shorts',
    image: '/category_sports_shorts_1777624481154.png',
    emoji: '🩳',
    description: 'Comfortable athletic wear',
    color: 'bg-lime-100',
  },

  // ── Outdoor & Adventure ────────────────────────────────────────────────────
  {
    id: 'outdoor-gear',
    title: 'Outdoor Gear',
    handle: 'outdoor-gear',
    image: '/category_outdoor_gear_1777624545261.png',
    emoji: '🏕️',
    description: 'Adventure and camping equipment',
    color: 'bg-amber-100',
  },

  // ── Technology ─────────────────────────────────────────────────────────────
  {
    id: 'smart-home',
    title: 'Smart Home',
    handle: 'smart-home',
    image: '/category_smart_home_1777624524697.png',
    emoji: '🏠',
    description: 'IoT devices for modern living',
    color: 'bg-cyan-100',
  },
  {
    id: 'premium-tech',
    title: 'Premium Tech',
    handle: 'premium-tech',
    image: '/category_premium_tech_1777624267216.png',
    emoji: '💻',
    description: 'Latest gadgets and electronics',
    color: 'bg-indigo-100',
  },

  // ── Beauty & Wellness ──────────────────────────────────────────────────────
  {
    id: 'skincare',
    title: 'Skin Care',
    handle: 'skincare',
    image: '/category_skincare_1777624346725.png',
    emoji: '🧴',
    description: 'Natural and premium skincare products',
    color: 'bg-teal-100',
  },
  {
    id: 'perfumes',
    title: 'Perfumes',
    handle: 'perfumes',
    image: 'https://images.unsplash.com/photo-1541056344071-89b57c37e91c?w=400&h=400&fit=crop&auto=format',
    emoji: '🌸',
    description: 'Artisan fragrances for every mood',
    color: 'bg-fuchsia-100',
  },

  // ── Home & Living ──────────────────────────────────────────────────────────
  {
    id: 'home-decor',
    title: 'Home Decor',
    handle: 'home-decor',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop&auto=format',
    emoji: '🕯️',
    description: 'Curated pieces for beautiful spaces',
    color: 'bg-yellow-100',
  },
];

/** Fallback emoji SVG — used by FeaturedCategories onError handler. */
export function getCategoryFallbackSvg(emoji: string): string {
  return emojiSvg(emoji);
}

export function getCategoriesByHandle(handle: string): Category[] {
  return CATEGORIES.filter((cat) => cat.handle === handle);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

export function getAllHandles(): string[] {
  return Array.from(new Set(CATEGORIES.map((cat) => cat.handle)));
}
