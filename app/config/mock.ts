/**
 * @file config/mock.ts
 * @description Shared mock data for demonstration purposes.
 */

export const MOCK_IMAGES = [
  'https://picsum.photos/id/1/800/1000',
  'https://picsum.photos/id/2/800/1000',
  'https://picsum.photos/id/21/800/1000',
  'https://picsum.photos/id/26/800/1000',
  'https://picsum.photos/id/30/800/1000',
  'https://picsum.photos/id/42/800/1000',
  'https://picsum.photos/id/54/800/1000',
  'https://picsum.photos/id/64/800/1000',
];

export const MOCK_PRODUCTS_DATA = [
  {title: 'Luxury Chronograph Watch',    id: 'm1',  category: 'Accessories'},
  {title: 'Ultra-Light Running Shoes',   id: 'm2',  category: 'Footwear'},
  {title: 'Classic Wool Trench Coat',    id: 'm3',  category: 'Apparel'},
  {title: 'Bohemian Summer Dress',       id: 'm4',  category: 'Apparel'},
  {title: 'Breathable Sports Shorts',    id: 'm5',  category: 'Apparel'},
  {title: 'Premium Leather Boots',       id: 'm6',  category: 'Footwear'},
  {title: 'Designer Silk Scarf',         id: 'm7',  category: 'Accessories'},
  {title: 'Casual Denim Jacket',         id: 'm8',  category: 'Apparel'},
  {title: 'Titanium Smart Watch',        id: 'm9',  category: 'Accessories'},
  {title: 'Memory Foam Sneakers',        id: 'm10', category: 'Footwear'},
  {title: 'Evening Cocktail Dress',      id: 'm11', category: 'Apparel'},
  {title: 'High-Performance Leggings',   id: 'm12', category: 'Apparel'},
  {title: 'Vintage Leather Belt',        id: 'm13', category: 'Accessories'},
  {title: 'Winter Parka Coat',           id: 'm14', category: 'Winter'},
  {title: 'Quick-Dry Board Shorts',      id: 'm15', category: 'Apparel'},
  {title: 'Suede Chelsea Boots',         id: 'm16', category: 'Footwear'},
];

export const MOCK_PRODUCTS = MOCK_PRODUCTS_DATA.map((p, i) => {
  const images = [
    '/category_luxury_watches_1777624154800.png',
    '/category_running_shoes_1777624191674.png',
    '/category_winter_coats_1777624214972.png',
    '/category_summer_dresses_1777624240455.png',
    '/category_sports_shorts_1777624481154.png',
    '/category_bags_wallets_1777624504769.png',
    '/category_smart_home_1777624524697.png',
    '/category_outdoor_gear_1777624545261.png',
    '/category_premium_tech_1777624267216.png',
    '/category_jewellery_1777624566155.png',
    '/category_sunglasses_1777624588168.png',
    '/category_skincare_1777624346725.png',
  ];
  const img = images[i % images.length];

  return {
    id: p.id,
    title: p.title,
    handle: p.title.toLowerCase().replace(/\s+/g, '-'),
    vendor: 'HydroStore Premium',
    description: `Elevate your style with our ${p.title}. This premium item from our ${p.category} collection is designed for those who demand both style and performance.`,
    featuredImage: {url: img, altText: p.title, width: 800, height: 1000},
    priceRange:        {minVariantPrice: {amount: (3500 + i * 1200).toString(), currencyCode: 'INR'}},
    compareAtPriceRange:{minVariantPrice: {amount: (5500 + i * 1200).toString(), currencyCode: 'INR'}},
    variants: {nodes: [{id: `v-${p.id}`, price: {amount: (3500 + i * 1200).toString(), currencyCode: 'INR'}, availableForSale: true}]},
    // PDP specific fields
    images: {nodes: [{url: img, altText: p.title, width: 800, height: 1000}]},
    selectedVariant: {
      id: `v-${p.id}`, 
      price: {amount: (3500 + i * 1200).toString(), currencyCode: 'INR'}, 
      availableForSale: true, 
      image: {url: img, altText: p.title}
    },
  };
});
