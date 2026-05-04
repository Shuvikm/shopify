/**
 * @file config/mock.ts
 * @description Shared mock data organized by category with matched imagery.
 */

interface MockProductData {
  title: string;
  id: string;
  category: string;
  vendor: string;
  img: string;
  price: number;
  comparePrice: number;
}

export const MOCK_PRODUCTS_DATA: MockProductData[] = [
  // ── Luxury Watches ──────────────────────────────────────────────────────────
  {
    title: 'Sovereign Chronograph',
    id: 'm1', category: 'Luxury Watches', vendor: 'Prestige Timepieces',
    img: 'https://images.unsplash.com/photo-1523275335074-a23f0bf28c0b?w=800&h=1000&fit=crop&auto=format',
    price: 22500, comparePrice: 28000,
  },
  {
    title: 'Titanium Smart Watch Pro',
    id: 'm2', category: 'Luxury Watches', vendor: 'Prestige Timepieces',
    img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=1000&fit=crop&auto=format',
    price: 18900, comparePrice: 24000,
  },
  {
    title: 'Classic Rose Gold Watch',
    id: 'm3', category: 'Luxury Watches', vendor: 'Prestige Timepieces',
    img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&h=1000&fit=crop&auto=format',
    price: 31500, comparePrice: 38000,
  },
  {
    title: 'Minimalist Dress Watch',
    id: 'm4', category: 'Luxury Watches', vendor: 'Prestige Timepieces',
    img: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=1000&fit=crop&auto=format',
    price: 14800, comparePrice: 19500,
  },

  // ── Footwear ─────────────────────────────────────────────────────────────────
  {
    title: 'Ultra-Light Running Shoes',
    id: 'm5', category: 'Footwear', vendor: 'StridePro Athletics',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop&auto=format',
    price: 6500, comparePrice: 8500,
  },
  {
    title: 'Premium Leather Ankle Boots',
    id: 'm6', category: 'Footwear', vendor: 'StridePro Athletics',
    img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&h=1000&fit=crop&auto=format',
    price: 9800, comparePrice: 13000,
  },
  {
    title: 'Suede Chelsea Boots',
    id: 'm7', category: 'Footwear', vendor: 'StridePro Athletics',
    img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&h=1000&fit=crop&auto=format',
    price: 8200, comparePrice: 11000,
  },
  {
    title: 'Memory Foam Sneakers',
    id: 'm8', category: 'Footwear', vendor: 'StridePro Athletics',
    img: 'https://images.unsplash.com/photo-1515955932428-81c74f32a2fa?w=800&h=1000&fit=crop&auto=format',
    price: 5400, comparePrice: 7200,
  },
  {
    title: 'Designer Stiletto Heels',
    id: 'm9', category: 'Footwear', vendor: 'StridePro Athletics',
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&h=1000&fit=crop&auto=format',
    price: 11500, comparePrice: 15000,
  },

  // ── Apparel ──────────────────────────────────────────────────────────────────
  {
    title: 'Classic Wool Trench Coat',
    id: 'm10', category: 'Apparel', vendor: 'Couture Collective',
    img: 'https://images.unsplash.com/photo-1539109136080-c5d9b5a44c27?w=800&h=1000&fit=crop&auto=format',
    price: 7900, comparePrice: 10500,
  },
  {
    title: 'Bohemian Summer Dress',
    id: 'm11', category: 'Apparel', vendor: 'Couture Collective',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&auto=format',
    price: 3800, comparePrice: 5200,
  },
  {
    title: 'Casual Denim Jacket',
    id: 'm12', category: 'Apparel', vendor: 'Couture Collective',
    img: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&h=1000&fit=crop&auto=format',
    price: 4500, comparePrice: 6000,
  },
  {
    title: 'Evening Cocktail Dress',
    id: 'm13', category: 'Apparel', vendor: 'Couture Collective',
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop&auto=format',
    price: 8600, comparePrice: 11500,
  },
  {
    title: 'Cashmere Turtleneck Sweater',
    id: 'm14', category: 'Apparel', vendor: 'Couture Collective',
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&auto=format',
    price: 5200, comparePrice: 7000,
  },
  {
    title: "Men's Oxford Button Shirt",
    id: 'm15', category: 'Apparel', vendor: 'Couture Collective',
    img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop&auto=format',
    price: 2800, comparePrice: 3800,
  },

  // ── Sports & Fitness ─────────────────────────────────────────────────────────
  {
    title: 'High-Performance Leggings',
    id: 'm16', category: 'Sports & Fitness', vendor: 'PeakPerform',
    img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop&auto=format',
    price: 3200, comparePrice: 4500,
  },
  {
    title: 'Breathable Sports Shorts',
    id: 'm17', category: 'Sports & Fitness', vendor: 'PeakPerform',
    img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=1000&fit=crop&auto=format',
    price: 1800, comparePrice: 2500,
  },
  {
    title: 'Pro Grip Yoga Mat',
    id: 'm18', category: 'Sports & Fitness', vendor: 'PeakPerform',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop&auto=format',
    price: 2400, comparePrice: 3200,
  },
  {
    title: 'Resistance Band Set',
    id: 'm19', category: 'Sports & Fitness', vendor: 'PeakPerform',
    img: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=1000&fit=crop&auto=format',
    price: 1500, comparePrice: 2000,
  },
  {
    title: 'Insulated Sports Water Bottle',
    id: 'm20', category: 'Sports & Fitness', vendor: 'PeakPerform',
    img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=1000&fit=crop&auto=format',
    price: 1200, comparePrice: 1700,
  },

  // ── Bags & Wallets ───────────────────────────────────────────────────────────
  {
    title: 'Premium Leather Crossbody',
    id: 'm21', category: 'Bags & Wallets', vendor: 'Leather Craft Co.',
    img: 'https://images.unsplash.com/photo-1548036161-c0d6a99e7c9f?w=800&h=1000&fit=crop&auto=format',
    price: 8500, comparePrice: 11000,
  },
  {
    title: 'Slim Card Wallet',
    id: 'm22', category: 'Bags & Wallets', vendor: 'Leather Craft Co.',
    img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=1000&fit=crop&auto=format',
    price: 2200, comparePrice: 3000,
  },
  {
    title: 'Canvas Tote Shopper',
    id: 'm23', category: 'Bags & Wallets', vendor: 'Leather Craft Co.',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop&auto=format',
    price: 3500, comparePrice: 4800,
  },
  {
    title: 'Structured Office Briefcase',
    id: 'm24', category: 'Bags & Wallets', vendor: 'Leather Craft Co.',
    img: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=800&h=1000&fit=crop&auto=format',
    price: 12800, comparePrice: 17000,
  },
  {
    title: 'Quilted Chain Shoulder Bag',
    id: 'm25', category: 'Bags & Wallets', vendor: 'Leather Craft Co.',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop&auto=format',
    price: 7200, comparePrice: 9500,
  },

  // ── Smart Home & Tech ────────────────────────────────────────────────────────
  {
    title: 'Wireless Noise-Cancelling Headphones',
    id: 'm26', category: 'Smart Home & Tech', vendor: 'TechNest',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop&auto=format',
    price: 14500, comparePrice: 19000,
  },
  {
    title: 'Smart Speaker 360',
    id: 'm27', category: 'Smart Home & Tech', vendor: 'TechNest',
    img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=1000&fit=crop&auto=format',
    price: 8900, comparePrice: 12000,
  },
  {
    title: 'Wireless Fast Charging Pad',
    id: 'm28', category: 'Smart Home & Tech', vendor: 'TechNest',
    img: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=800&h=1000&fit=crop&auto=format',
    price: 3200, comparePrice: 4500,
  },
  {
    title: 'Smart LED Desk Lamp',
    id: 'm29', category: 'Smart Home & Tech', vendor: 'TechNest',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=1000&fit=crop&auto=format',
    price: 4800, comparePrice: 6500,
  },

  // ── Outdoor Gear ─────────────────────────────────────────────────────────────
  {
    title: 'All-Season Trekking Backpack',
    id: 'm30', category: 'Outdoor Gear', vendor: 'Summit Outfitters',
    img: 'https://images.unsplash.com/photo-1537815749002-de6a533c64db?w=800&h=1000&fit=crop&auto=format',
    price: 9500, comparePrice: 13000,
  },
  {
    title: 'Waterproof Hiking Boots',
    id: 'm31', category: 'Outdoor Gear', vendor: 'Summit Outfitters',
    img: 'https://images.unsplash.com/photo-1606889464198-fcb18894cf50?w=800&h=1000&fit=crop&auto=format',
    price: 7800, comparePrice: 10500,
  },
  {
    title: 'Quick-Dry Windbreaker',
    id: 'm32', category: 'Outdoor Gear', vendor: 'Summit Outfitters',
    img: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&h=1000&fit=crop&auto=format',
    price: 5600, comparePrice: 7500,
  },
  {
    title: 'Collapsible Trekking Poles',
    id: 'm33', category: 'Outdoor Gear', vendor: 'Summit Outfitters',
    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=1000&fit=crop&auto=format',
    price: 3800, comparePrice: 5200,
  },

  // ── Jewellery ────────────────────────────────────────────────────────────────
  {
    title: 'Gold Layered Chain Necklace',
    id: 'm34', category: 'Jewellery', vendor: 'Lumière Fine Jewels',
    img: 'https://images.unsplash.com/photo-1515562141206-eb697fd98ab4?w=800&h=1000&fit=crop&auto=format',
    price: 18500, comparePrice: 24000,
  },
  {
    title: 'Diamond Stud Earrings',
    id: 'm35', category: 'Jewellery', vendor: 'Lumière Fine Jewels',
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=1000&fit=crop&auto=format',
    price: 32000, comparePrice: 42000,
  },
  {
    title: 'Sterling Silver Cuff Bracelet',
    id: 'm36', category: 'Jewellery', vendor: 'Lumière Fine Jewels',
    img: 'https://images.unsplash.com/photo-1573408301185-9519f94815b4?w=800&h=1000&fit=crop&auto=format',
    price: 9800, comparePrice: 13500,
  },
  {
    title: 'Sapphire Cocktail Ring',
    id: 'm37', category: 'Jewellery', vendor: 'Lumière Fine Jewels',
    img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=1000&fit=crop&auto=format',
    price: 45000, comparePrice: 58000,
  },

  // ── Sunglasses ───────────────────────────────────────────────────────────────
  {
    title: 'Classic Aviator Sunglasses',
    id: 'm38', category: 'Sunglasses', vendor: 'Vista Eyewear',
    img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1000&fit=crop&auto=format',
    price: 5800, comparePrice: 8000,
  },
  {
    title: 'Oversized Square Frames',
    id: 'm39', category: 'Sunglasses', vendor: 'Vista Eyewear',
    img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&h=1000&fit=crop&auto=format',
    price: 4200, comparePrice: 6000,
  },
  {
    title: 'Retro Round Polarised',
    id: 'm40', category: 'Sunglasses', vendor: 'Vista Eyewear',
    img: 'https://images.unsplash.com/photo-1534671971813-73d8f5e0d96c?w=800&h=1000&fit=crop&auto=format',
    price: 3600, comparePrice: 5000,
  },

  // ── Skin Care ────────────────────────────────────────────────────────────────
  {
    title: 'Vitamin C Brightening Serum',
    id: 'm41', category: 'Skin Care', vendor: 'GlowLab',
    img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=1000&fit=crop&auto=format',
    price: 2800, comparePrice: 3800,
  },
  {
    title: 'Hydrating Face Moisturiser',
    id: 'm42', category: 'Skin Care', vendor: 'GlowLab',
    img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=1000&fit=crop&auto=format',
    price: 1900, comparePrice: 2600,
  },
  {
    title: 'Charcoal Detox Clay Mask',
    id: 'm43', category: 'Skin Care', vendor: 'GlowLab',
    img: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=1000&fit=crop&auto=format',
    price: 1500, comparePrice: 2100,
  },
  {
    title: 'SPF 50 Invisible Sunscreen',
    id: 'm44', category: 'Skin Care', vendor: 'GlowLab',
    img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=1000&fit=crop&auto=format',
    price: 1200, comparePrice: 1700,
  },

  // ── Perfumes & Fragrances ────────────────────────────────────────────────────
  {
    title: 'Oud & Amber Eau de Parfum',
    id: 'm45', category: 'Perfumes', vendor: 'Maison Scent',
    img: 'https://images.unsplash.com/photo-1541056344071-89b57c37e91c?w=800&h=1000&fit=crop&auto=format',
    price: 7500, comparePrice: 9800,
  },
  {
    title: 'Fresh Citrus Cologne',
    id: 'm46', category: 'Perfumes', vendor: 'Maison Scent',
    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=1000&fit=crop&auto=format',
    price: 4800, comparePrice: 6500,
  },
  {
    title: 'Rose & Jasmine EDP',
    id: 'm47', category: 'Perfumes', vendor: 'Maison Scent',
    img: 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&h=1000&fit=crop&auto=format',
    price: 6200, comparePrice: 8500,
  },

  // ── Home Decor ───────────────────────────────────────────────────────────────
  {
    title: 'Scented Soy Candle Gift Set',
    id: 'm48', category: 'Home Decor', vendor: 'Living Luxe',
    img: 'https://images.unsplash.com/photo-1603905700420-5e28fa92c56d?w=800&h=1000&fit=crop&auto=format',
    price: 2400, comparePrice: 3200,
  },
  {
    title: 'Handcrafted Ceramic Vase',
    id: 'm49', category: 'Home Decor', vendor: 'Living Luxe',
    img: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=1000&fit=crop&auto=format',
    price: 3800, comparePrice: 5200,
  },
  {
    title: 'Linen Throw Pillow Set',
    id: 'm50', category: 'Home Decor', vendor: 'Living Luxe',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop&auto=format',
    price: 2900, comparePrice: 4000,
  },
  {
    title: 'Woven Boho Wall Hanging',
    id: 'm51', category: 'Home Decor', vendor: 'Living Luxe',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=1000&fit=crop&auto=format',
    price: 1800, comparePrice: 2500,
  },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Luxury Watches':    'A precision-crafted timepiece that blends horological heritage with modern elegance.',
  'Footwear':          'Engineered for comfort and style, designed to move with you all day.',
  'Apparel':           'Premium fabrics and expert tailoring for an effortlessly polished look.',
  'Sports & Fitness':  'Performance gear built to support your active lifestyle and fitness goals.',
  'Bags & Wallets':    'Thoughtfully designed storage that marries function with refined aesthetics.',
  'Smart Home & Tech': 'Cutting-edge technology to elevate your everyday spaces and routines.',
  'Outdoor Gear':      'Durable equipment crafted for those who seek adventure beyond the city.',
  'Jewellery':         'Meticulously set stones and fine metals that capture light and compliment every look.',
  'Sunglasses':        'Precision optics wrapped in frames that define your personal style.',
  'Skin Care':         'Science-backed formulas that reveal your skin\'s natural radiance.',
  'Perfumes':          'Artisanal fragrances blended to evoke emotion and leave a lasting impression.',
  'Home Decor':        'Curated pieces that transform any room into a sanctuary of warmth and character.',
};

export const MOCK_PRODUCTS = MOCK_PRODUCTS_DATA.map((p) => ({
  id: p.id,
  title: p.title,
  handle: p.title.toLowerCase().replace(/\s+/g, '-').replace(/[''']/g, ''),
  vendor: p.vendor,
  description: CATEGORY_DESCRIPTIONS[p.category] ?? `A premium item from our ${p.category} collection.`,
  featuredImage: {url: p.img, altText: p.title, width: 800, height: 1000},
  priceRange:         {minVariantPrice: {amount: p.price.toString(), currencyCode: 'INR'}},
  compareAtPriceRange:{minVariantPrice: {amount: p.comparePrice.toString(), currencyCode: 'INR'}},
  variants: {nodes: [{id: `v-${p.id}`, price: {amount: p.price.toString(), currencyCode: 'INR'}, availableForSale: true}]},
  images: {nodes: [{url: p.img, altText: p.title, width: 800, height: 1000}]},
  selectedVariant: {
    id: `v-${p.id}`,
    price: {amount: p.price.toString(), currencyCode: 'INR'},
    availableForSale: true,
    image: {url: p.img, altText: p.title},
  },
}));

/** Products grouped by category — useful for category-level pages. */
export const MOCK_PRODUCTS_BY_CATEGORY = MOCK_PRODUCTS_DATA.reduce<Record<string, typeof MOCK_PRODUCTS>>(
  (acc, _, i) => {
    const cat = MOCK_PRODUCTS_DATA[i].category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(MOCK_PRODUCTS[i]);
    return acc;
  },
  {},
);

/** All distinct category names in the mock data set. */
export const MOCK_CATEGORIES = Array.from(new Set(MOCK_PRODUCTS_DATA.map((p) => p.category)));
