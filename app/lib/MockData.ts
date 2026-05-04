export const MOCK_PRODUCTS = [
  {
    id: 'gid://shopify/Product/1',
    title: 'The Sovereign Chronograph',
    handle: 'sovereign-chronograph',
    vendor: 'The Collection',
    description: 'A masterpiece of precision engineering and timeless aesthetic. Featuring a sapphire crystal face and hand-stitched Italian leather strap.',
    featuredImage: { url: '/mock_watch_1.webp', altText: 'Sovereign Chronograph', width: 800, height: 1000 },
    priceRange: { minVariantPrice: { amount: '1250.0', currencyCode: 'USD' } },
    compareAtPriceRange: { minVariantPrice: { amount: '1500.0', currencyCode: 'USD' } },
    variants: { nodes: [{ id: 'gid://shopify/ProductVariant/1', availableForSale: true, price: { amount: '1250.0', currencyCode: 'USD' } }] }
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Cashmere Overshirt',
    handle: 'cashmere-overshirt',
    vendor: 'The Collection',
    description: 'Exquisite Mongolian cashmere blended with silk for a drape that defines effortless luxury. A versatile staple for the modern wardrobe.',
    featuredImage: { url: '/mock_apparel_1.webp', altText: 'Cashmere Overshirt', width: 800, height: 1000 },
    priceRange: { minVariantPrice: { amount: '450.0', currencyCode: 'USD' } },
    variants: { nodes: [{ id: 'gid://shopify/ProductVariant/2', availableForSale: true, price: { amount: '450.0', currencyCode: 'USD' } }] }
  },
  {
    id: 'gid://shopify/Product/3',
    title: 'Monolith Weekender',
    handle: 'monolith-weekender',
    vendor: 'The Collection',
    description: 'Sculpted from full-grain vegetable-tanned leather. The Monolith is designed to age beautifully through every journey.',
    featuredImage: { url: '/mock_bag_1.webp', altText: 'Monolith Weekender', width: 800, height: 1000 },
    priceRange: { minVariantPrice: { amount: '890.0', currencyCode: 'USD' } },
    variants: { nodes: [{ id: 'gid://shopify/ProductVariant/3', availableForSale: true, price: { amount: '890.0', currencyCode: 'USD' } }] }
  },
  {
    id: 'gid://shopify/Product/4',
    title: 'Silk Boundary Scarf',
    handle: 'silk-boundary-scarf',
    vendor: 'The Collection',
    description: 'Hand-rolled edges and a custom geometric print. 100% pure Mulberry silk for a soft, luminous finish.',
    featuredImage: { url: '/mock_accessory_1.webp', altText: 'Silk Scarf', width: 800, height: 1000 },
    priceRange: { minVariantPrice: { amount: '180.0', currencyCode: 'USD' } },
    variants: { nodes: [{ id: 'gid://shopify/ProductVariant/4', availableForSale: true, price: { amount: '180.0', currencyCode: 'USD' } }] }
  },
  {
    id: 'gid://shopify/Product/5',
    title: 'Aura Glass Decanter',
    handle: 'aura-glass-decanter',
    vendor: 'The Collection',
    description: 'Mouth-blown lead-free crystal. An aerodynamic silhouette designed to aerate your finest vintages with grace.',
    featuredImage: { url: '/mock_home_1.webp', altText: 'Aura Decanter', width: 800, height: 1000 },
    priceRange: { minVariantPrice: { amount: '320.0', currencyCode: 'USD' } },
    variants: { nodes: [{ id: 'gid://shopify/ProductVariant/5', availableForSale: true, price: { amount: '320.0', currencyCode: 'USD' } }] }
  }
  // ... more products can be added here
];
