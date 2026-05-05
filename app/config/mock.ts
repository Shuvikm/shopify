/**
 * @file config/mock.ts
 * @description 100+ mock products across 28 categories with matched Unsplash imagery.
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

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=1000&fit=crop&auto=format`;

export const MOCK_PRODUCTS_DATA: MockProductData[] = [
  // ── Luxury Watches ────────────────────────────────────────────────────────
  { title: 'Sovereign Chronograph',       id: 'm1',  category: 'Luxury Watches', vendor: 'Prestige Timepieces', img: U('1523275335074-a23f0bf28c0b'), price: 22500, comparePrice: 28000 },
  { title: 'Titanium Smart Watch Pro',    id: 'm2',  category: 'Luxury Watches', vendor: 'Prestige Timepieces', img: U('1546868871-7041f2a55e12'), price: 18900, comparePrice: 24000 },
  { title: 'Classic Rose Gold Watch',     id: 'm3',  category: 'Luxury Watches', vendor: 'Prestige Timepieces', img: U('1547996160-81dfa63595aa'), price: 31500, comparePrice: 38000 },
  { title: 'Minimalist Dress Watch',      id: 'm4',  category: 'Luxury Watches', vendor: 'Prestige Timepieces', img: U('1587836374828-4dbafa94cf0e'), price: 14800, comparePrice: 19500 },

  // ── Footwear ──────────────────────────────────────────────────────────────
  { title: 'Ultra-Light Running Shoes',   id: 'm5',  category: 'Footwear', vendor: 'StridePro', img: U('1542291026-7eec264c27ff'), price: 6500, comparePrice: 8500 },
  { title: 'Premium Leather Ankle Boots', id: 'm6',  category: 'Footwear', vendor: 'StridePro', img: U('1608256246200-53e635b5b65f'), price: 9800, comparePrice: 13000 },
  { title: 'Suede Chelsea Boots',         id: 'm7',  category: 'Footwear', vendor: 'StridePro', img: U('1638247025967-b4e38f787b76'), price: 8200, comparePrice: 11000 },
  { title: 'Memory Foam Sneakers',        id: 'm8',  category: 'Footwear', vendor: 'StridePro', img: U('1515955932428-81c74f32a2fa'), price: 5400, comparePrice: 7200 },
  { title: 'Designer Stiletto Heels',     id: 'm9',  category: 'Footwear', vendor: 'StridePro', img: U('1543163521-1bf539c55dd2'), price: 11500, comparePrice: 15000 },

  // ── Apparel ───────────────────────────────────────────────────────────────
  { title: 'Classic Wool Trench Coat',    id: 'm10', category: 'Apparel', vendor: 'Couture Collective', img: U('1539109136080-c5d9b5a44c27'), price: 7900, comparePrice: 10500 },
  { title: 'Bohemian Summer Dress',       id: 'm11', category: 'Apparel', vendor: 'Couture Collective', img: U('1515886657613-9f3515b0c78f'), price: 3800, comparePrice: 5200 },
  { title: 'Casual Denim Jacket',         id: 'm12', category: 'Apparel', vendor: 'Couture Collective', img: U('1523205771623-e0faa4d2813d'), price: 4500, comparePrice: 6000 },
  { title: 'Evening Cocktail Dress',      id: 'm13', category: 'Apparel', vendor: 'Couture Collective', img: U('1445205170230-053b83016050'), price: 8600, comparePrice: 11500 },
  { title: 'Cashmere Turtleneck',         id: 'm14', category: 'Apparel', vendor: 'Couture Collective', img: U('1576566588028-4147f3842f27'), price: 5200, comparePrice: 7000 },
  { title: "Men's Oxford Button Shirt",   id: 'm15', category: 'Apparel', vendor: 'Couture Collective', img: U('1596755094514-f87e34085b2c'), price: 2800, comparePrice: 3800 },

  // ── Sports & Fitness ──────────────────────────────────────────────────────
  { title: 'High-Performance Leggings',   id: 'm16', category: 'Sports & Fitness', vendor: 'PeakPerform', img: U('1506629082955-511b1aa562c8'), price: 3200, comparePrice: 4500 },
  { title: 'Breathable Sports Shorts',    id: 'm17', category: 'Sports & Fitness', vendor: 'PeakPerform', img: U('1571902943202-507ec2618e8f'), price: 1800, comparePrice: 2500 },
  { title: 'Pro Grip Yoga Mat',           id: 'm18', category: 'Sports & Fitness', vendor: 'PeakPerform', img: U('1544367567-0f2fcb009e0b'), price: 2400, comparePrice: 3200 },
  { title: 'Resistance Band Set',         id: 'm19', category: 'Sports & Fitness', vendor: 'PeakPerform', img: U('1598289431512-b97b0917affc'), price: 1500, comparePrice: 2000 },
  { title: 'Insulated Sports Bottle',     id: 'm20', category: 'Sports & Fitness', vendor: 'PeakPerform', img: U('1532938911079-1b06ac7ceec7'), price: 1200, comparePrice: 1700 },

  // ── Bags & Wallets ────────────────────────────────────────────────────────
  { title: 'Premium Leather Crossbody',   id: 'm21', category: 'Bags & Wallets', vendor: 'Leather Craft Co.', img: U('1548036161-c0d6a99e7c9f'), price: 8500, comparePrice: 11000 },
  { title: 'Slim Card Wallet',            id: 'm22', category: 'Bags & Wallets', vendor: 'Leather Craft Co.', img: U('1627123424574-724758594e93'), price: 2200, comparePrice: 3000 },
  { title: 'Canvas Tote Shopper',         id: 'm23', category: 'Bags & Wallets', vendor: 'Leather Craft Co.', img: U('1553062407-98eeb64c6a62'), price: 3500, comparePrice: 4800 },
  { title: 'Structured Office Briefcase', id: 'm24', category: 'Bags & Wallets', vendor: 'Leather Craft Co.', img: U('1491637639811-60e2756cc1c7'), price: 12800, comparePrice: 17000 },
  { title: 'Quilted Chain Shoulder Bag',  id: 'm25', category: 'Bags & Wallets', vendor: 'Leather Craft Co.', img: U('1584917865442-de89df76afd3'), price: 7200, comparePrice: 9500 },

  // ── Smart Home & Tech ─────────────────────────────────────────────────────
  { title: 'Noise-Cancelling Headphones', id: 'm26', category: 'Smart Home & Tech', vendor: 'TechNest', img: U('1505740420928-5e560c06d30e'), price: 14500, comparePrice: 19000 },
  { title: 'Smart Speaker 360',           id: 'm27', category: 'Smart Home & Tech', vendor: 'TechNest', img: U('1608043152269-423dbba4e7e1'), price: 8900, comparePrice: 12000 },
  { title: 'Wireless Fast Charging Pad',  id: 'm28', category: 'Smart Home & Tech', vendor: 'TechNest', img: U('1591370874773-6702e8f12fd8'), price: 3200, comparePrice: 4500 },
  { title: 'Smart LED Desk Lamp',         id: 'm29', category: 'Smart Home & Tech', vendor: 'TechNest', img: U('1593642632559-0c6d3fc62b89'), price: 4800, comparePrice: 6500 },

  // ── Outdoor Gear ──────────────────────────────────────────────────────────
  { title: 'All-Season Trekking Backpack',id: 'm30', category: 'Outdoor Gear', vendor: 'Summit Outfitters', img: U('1537815749002-de6a533c64db'), price: 9500, comparePrice: 13000 },
  { title: 'Waterproof Hiking Boots',     id: 'm31', category: 'Outdoor Gear', vendor: 'Summit Outfitters', img: U('1606889464198-fcb18894cf50'), price: 7800, comparePrice: 10500 },
  { title: 'Quick-Dry Windbreaker',       id: 'm32', category: 'Outdoor Gear', vendor: 'Summit Outfitters', img: U('1591369822096-ffd140ec948f'), price: 5600, comparePrice: 7500 },
  { title: 'Collapsible Trekking Poles',  id: 'm33', category: 'Outdoor Gear', vendor: 'Summit Outfitters', img: U('1476514525535-07fb3b4ae5f1'), price: 3800, comparePrice: 5200 },

  // ── Jewellery ─────────────────────────────────────────────────────────────
  { title: 'Gold Layered Chain Necklace', id: 'm34', category: 'Jewellery', vendor: 'Lumière Fine Jewels', img: U('1515562141206-eb697fd98ab4'), price: 18500, comparePrice: 24000 },
  { title: 'Diamond Stud Earrings',       id: 'm35', category: 'Jewellery', vendor: 'Lumière Fine Jewels', img: U('1535632066927-ab7c9ab60908'), price: 32000, comparePrice: 42000 },
  { title: 'Sterling Silver Cuff',        id: 'm36', category: 'Jewellery', vendor: 'Lumière Fine Jewels', img: U('1573408301185-9519f94815b4'), price: 9800, comparePrice: 13500 },
  { title: 'Sapphire Cocktail Ring',      id: 'm37', category: 'Jewellery', vendor: 'Lumière Fine Jewels', img: U('1603561591411-07134e71a2a9'), price: 45000, comparePrice: 58000 },

  // ── Sunglasses ────────────────────────────────────────────────────────────
  { title: 'Classic Aviator Sunglasses',  id: 'm38', category: 'Sunglasses', vendor: 'Vista Eyewear', img: U('1572635196237-14b3f281503f'), price: 5800, comparePrice: 8000 },
  { title: 'Oversized Square Frames',     id: 'm39', category: 'Sunglasses', vendor: 'Vista Eyewear', img: U('1508296695146-257a814070b4'), price: 4200, comparePrice: 6000 },
  { title: 'Retro Round Polarised',       id: 'm40', category: 'Sunglasses', vendor: 'Vista Eyewear', img: U('1534671971813-73d8f5e0d96c'), price: 3600, comparePrice: 5000 },

  // ── Skin Care ─────────────────────────────────────────────────────────────
  { title: 'Vitamin C Brightening Serum', id: 'm41', category: 'Skin Care', vendor: 'GlowLab', img: U('1556228578-8c89e6adf883'), price: 2800, comparePrice: 3800 },
  { title: 'Hydrating Face Moisturiser',  id: 'm42', category: 'Skin Care', vendor: 'GlowLab', img: U('1598440947619-2c35fc9aa908'), price: 1900, comparePrice: 2600 },
  { title: 'Charcoal Detox Clay Mask',    id: 'm43', category: 'Skin Care', vendor: 'GlowLab', img: U('1612817288484-6f916006741a'), price: 1500, comparePrice: 2100 },
  { title: 'SPF 50 Invisible Sunscreen',  id: 'm44', category: 'Skin Care', vendor: 'GlowLab', img: U('1620916566398-39f1143ab7be'), price: 1200, comparePrice: 1700 },

  // ── Perfumes ──────────────────────────────────────────────────────────────
  { title: 'Oud & Amber Eau de Parfum',   id: 'm45', category: 'Perfumes', vendor: 'Maison Scent', img: U('1541056344071-89b57c37e91c'), price: 7500, comparePrice: 9800 },
  { title: 'Fresh Citrus Cologne',        id: 'm46', category: 'Perfumes', vendor: 'Maison Scent', img: U('1594035910387-fea47794261f'), price: 4800, comparePrice: 6500 },
  { title: 'Rose & Jasmine EDP',          id: 'm47', category: 'Perfumes', vendor: 'Maison Scent', img: U('1608528577891-eb055944f2e7'), price: 6200, comparePrice: 8500 },

  // ── Home Decor ────────────────────────────────────────────────────────────
  { title: 'Scented Soy Candle Gift Set', id: 'm48', category: 'Home Decor', vendor: 'Living Luxe', img: U('1603905700420-5e28fa92c56d'), price: 2400, comparePrice: 3200 },
  { title: 'Handcrafted Ceramic Vase',    id: 'm49', category: 'Home Decor', vendor: 'Living Luxe', img: U('1556228453-efd6c1ff04f6'), price: 3800, comparePrice: 5200 },
  { title: 'Linen Throw Pillow Set',      id: 'm50', category: 'Home Decor', vendor: 'Living Luxe', img: U('1555041469-a586c61ea9bc'), price: 2900, comparePrice: 4000 },
  { title: 'Woven Boho Wall Hanging',     id: 'm51', category: 'Home Decor', vendor: 'Living Luxe', img: U('1586023492125-27b2c045efd7'), price: 1800, comparePrice: 2500 },

  // ── Smartphones ───────────────────────────────────────────────────────────
  { title: 'ProMax 15 Ultra Smartphone',  id: 'm52', category: 'Smartphones', vendor: 'TechNest', img: U('1511707171634-5f897ff02aa9'), price: 89900, comparePrice: 99900 },
  { title: 'Galaxy S24 Edge',             id: 'm53', category: 'Smartphones', vendor: 'TechNest', img: U('1601784551446-abff1af95c23'), price: 74900, comparePrice: 84900 },
  { title: 'Pixel 8 Pro',                 id: 'm54', category: 'Smartphones', vendor: 'TechNest', img: U('1592899677977-9c10002761d5'), price: 66900, comparePrice: 74900 },
  { title: 'Nord Pro 5G',                 id: 'm55', category: 'Smartphones', vendor: 'TechNest', img: U('1598128360-2de89d9c4e09'), price: 38900, comparePrice: 44900 },

  // ── Laptops ───────────────────────────────────────────────────────────────
  { title: 'MacBook Air M3 13"',          id: 'm56', category: 'Laptops', vendor: 'TechNest', img: U('1517336714731-489689fd1ca8'), price: 114900, comparePrice: 124900 },
  { title: 'XPS 15 OLED Creator',         id: 'm57', category: 'Laptops', vendor: 'TechNest', img: U('1496181133206-80ce9b88a853'), price: 98900, comparePrice: 109900 },
  { title: 'ThinkPad X1 Carbon Gen 12',   id: 'm58', category: 'Laptops', vendor: 'TechNest', img: U('1587614382346-0955c29b8f1e'), price: 109900, comparePrice: 124900 },
  { title: 'ROG Zephyrus Gaming Laptop',  id: 'm59', category: 'Laptops', vendor: 'TechNest', img: U('1525547719571-a2d4ac8945e2'), price: 134900, comparePrice: 154900 },

  // ── Cameras ───────────────────────────────────────────────────────────────
  { title: 'Sony Alpha 7 IV Mirrorless',  id: 'm60', category: 'Cameras', vendor: 'LensLab', img: U('1516035069371-29a1b244cc32'), price: 229900, comparePrice: 259900 },
  { title: 'Nikon Z30 Vlogging Kit',      id: 'm61', category: 'Cameras', vendor: 'LensLab', img: U('1502945015378-0d284ca2df9d'), price: 64900, comparePrice: 74900 },
  { title: 'DJI Osmo Pocket 3',           id: 'm62', category: 'Cameras', vendor: 'LensLab', img: U('1500634245200-e5245c7574ef'), price: 36900, comparePrice: 42900 },

  // ── Gaming ────────────────────────────────────────────────────────────────
  { title: 'DualSense Edge Controller',   id: 'm63', category: 'Gaming', vendor: 'GameVault', img: U('1593118247619-e2d6f056869e'), price: 19900, comparePrice: 23900 },
  { title: 'Mechanical RGB Keyboard',     id: 'm64', category: 'Gaming', vendor: 'GameVault', img: U('1595341595705-3c21d5b394a3'), price: 8900, comparePrice: 11900 },
  { title: 'Pro Gaming Headset 7.1',      id: 'm65', category: 'Gaming', vendor: 'GameVault', img: U('1599669454699-248893623440'), price: 12900, comparePrice: 16900 },
  { title: 'Switch OLED Limited Ed.',     id: 'm66', category: 'Gaming', vendor: 'GameVault', img: U('1580327332925-a4e1ab287b66'), price: 34900, comparePrice: 38900 },

  // ── Home & Kitchen ────────────────────────────────────────────────────────
  { title: 'Instant Pot 7-in-1 Duo',     id: 'm67', category: 'Home & Kitchen', vendor: 'KitchenPro', img: U('1574340930912-8fa218a8d5f5'), price: 7499, comparePrice: 9999 },
  { title: 'Cast Iron Skillet Set 3pc',   id: 'm68', category: 'Home & Kitchen', vendor: 'KitchenPro', img: U('1556909114-f6e7ad7d3136'), price: 4999, comparePrice: 6999 },
  { title: 'Digital Air Fryer XL 6L',     id: 'm69', category: 'Home & Kitchen', vendor: 'KitchenPro', img: U('1544145945-f90425340c7e'), price: 6499, comparePrice: 8499 },
  { title: 'KitchenAid Stand Mixer',      id: 'm70', category: 'Home & Kitchen', vendor: 'KitchenPro', img: U('1490645935967-10de6ba17061'), price: 38999, comparePrice: 44999 },
  { title: 'Cold-Press Slow Juicer',      id: 'm71', category: 'Home & Kitchen', vendor: 'KitchenPro', img: U('1610632380989-5ac26f9c3274'), price: 12999, comparePrice: 17999 },

  // ── Books ─────────────────────────────────────────────────────────────────
  { title: 'Atomic Habits — James Clear', id: 'm72', category: 'Books', vendor: 'PageTurner', img: U('1512820790803-83ca734da794'), price: 499, comparePrice: 699 },
  { title: 'Psychology of Money',         id: 'm73', category: 'Books', vendor: 'PageTurner', img: U('1524995997946-a1172951ad98'), price: 449, comparePrice: 599 },
  { title: 'Sapiens: A Brief History',    id: 'm74', category: 'Books', vendor: 'PageTurner', img: U('1481627834876-b7833e8f5570'), price: 549, comparePrice: 749 },
  { title: 'Deep Work — Cal Newport',     id: 'm75', category: 'Books', vendor: 'PageTurner', img: U('1544716278-ca5e3f4abd8c'), price: 399, comparePrice: 549 },

  // ── Toys & Games ─────────────────────────────────────────────────────────
  { title: 'LEGO Architecture Skyline',   id: 'm76', category: 'Toys & Games', vendor: 'PlayWorld', img: U('1558069427-a86c7f3e8a6f'), price: 4999, comparePrice: 6499 },
  { title: 'Wooden Stacking Blocks 60pc', id: 'm77', category: 'Toys & Games', vendor: 'PlayWorld', img: U('1566576912321-d58ddd7a6088'), price: 1299, comparePrice: 1799 },
  { title: 'Classic Marble Chess Set',    id: 'm78', category: 'Toys & Games', vendor: 'PlayWorld', img: U('1529480726585-ab8e69f35e0e'), price: 2499, comparePrice: 3499 },
  { title: 'UNO Flip! Party Bundle',      id: 'm79', category: 'Toys & Games', vendor: 'PlayWorld', img: U('1611996575749-79a3a250f948'), price: 799, comparePrice: 1099 },

  // ── Baby & Kids ───────────────────────────────────────────────────────────
  { title: 'Ergonomic Baby Carrier Wrap', id: 'm80', category: 'Baby & Kids', vendor: 'LittleOnes', img: U('1515488042361-ee00e0ddd4e4'), price: 3499, comparePrice: 4999 },
  { title: 'Organic Cotton Bodysuit Set', id: 'm81', category: 'Baby & Kids', vendor: 'LittleOnes', img: U('1522771739844-12a5e5f16b48'), price: 1299, comparePrice: 1799 },
  { title: 'Smart Baby Monitor 4K',       id: 'm82', category: 'Baby & Kids', vendor: 'LittleOnes', img: U('1555252333-9f8e92e65df9'), price: 8999, comparePrice: 11999 },
  { title: 'Silicone Teething Toy Set',   id: 'm83', category: 'Baby & Kids', vendor: 'LittleOnes', img: U('1534353436938-f5b26e3dd765'), price: 699, comparePrice: 999 },

  // ── Health & Wellness ─────────────────────────────────────────────────────
  { title: 'Vitamin D3 + K2 2000IU',     id: 'm84', category: 'Health & Wellness', vendor: 'GlowLab', img: U('1559757148-5c350d0d3c56'), price: 849, comparePrice: 1199 },
  { title: 'Digital BP Monitor Pro',      id: 'm85', category: 'Health & Wellness', vendor: 'GlowLab', img: U('1571019613454-1cb2f99b2d8b'), price: 2499, comparePrice: 3499 },
  { title: 'Whey Isolate Protein 2kg',    id: 'm86', category: 'Health & Wellness', vendor: 'PeakPerform', img: U('1578662996442-48f60103fc96'), price: 3799, comparePrice: 4999 },
  { title: 'Advanced Fitness Tracker',    id: 'm87', category: 'Health & Wellness', vendor: 'TechNest', img: U('1506126613408-eca07ce68773'), price: 5999, comparePrice: 7999 },

  // ── Automotive ────────────────────────────────────────────────────────────
  { title: 'Magnetic Car Phone Mount',    id: 'm88', category: 'Automotive', vendor: 'DriveTech', img: U('1568772585407-9f54ab99d69e'), price: 1299, comparePrice: 1799 },
  { title: '4K Dash Camera Front + Rear', id: 'm89', category: 'Automotive', vendor: 'DriveTech', img: U('1492144534655-ae79c964c9d7'), price: 9999, comparePrice: 13999 },
  { title: 'Car Seat Back Organiser',     id: 'm90', category: 'Automotive', vendor: 'DriveTech', img: U('1581235520704-8a1ee71e2ef0'), price: 1799, comparePrice: 2499 },

  // ── Grocery & Gourmet ─────────────────────────────────────────────────────
  { title: 'Raw Himalayan Honey 1kg',     id: 'm91', category: 'Grocery & Gourmet', vendor: 'NatureFirst', img: U('1518977822534-7049a61ee0c2'), price: 799, comparePrice: 1099 },
  { title: 'Extra Virgin Olive Oil 1L',   id: 'm92', category: 'Grocery & Gourmet', vendor: 'NatureFirst', img: U('1542838132-92c369ad36b7'), price: 1299, comparePrice: 1699 },
  { title: 'Organic Matcha Green Tea',    id: 'm93', category: 'Grocery & Gourmet', vendor: 'NatureFirst', img: U('1556909173-cf42f74c0015'), price: 1499, comparePrice: 1999 },
  { title: '72% Dark Chocolate Box',      id: 'm94', category: 'Grocery & Gourmet', vendor: 'NatureFirst', img: U('1511688878-7b4de23a2b04'), price: 599, comparePrice: 849 },

  // ── Pet Supplies ──────────────────────────────────────────────────────────
  { title: 'Interactive Puzzle Dog Toy',  id: 'm95', category: 'Pet Supplies', vendor: 'PawsFirst', img: U('1583511655826-05700d52f4d1'), price: 1299, comparePrice: 1799 },
  { title: 'Premium Cat Tree Tower',      id: 'm96', category: 'Pet Supplies', vendor: 'PawsFirst', img: U('1514888286974-6c03e2ca1dba'), price: 4999, comparePrice: 6999 },
  { title: 'Anti-Slip Stainless Bowl Set',id: 'm97', category: 'Pet Supplies', vendor: 'PawsFirst', img: U('1548767797-d8c844163b4a'), price: 799, comparePrice: 1199 },

  // ── Office Supplies ───────────────────────────────────────────────────────
  { title: 'Ergonomic Anti-Fatigue Mat',  id: 'm98', category: 'Office Supplies', vendor: 'WorkSmart', img: U('1497366216548-37526070297c'), price: 2499, comparePrice: 3499 },
  { title: 'Premium Fountain Pen Set',    id: 'm99', category: 'Office Supplies', vendor: 'WorkSmart', img: U('1558655888-8eff8a40e6ea'), price: 1999, comparePrice: 2799 },
  { title: 'Bamboo Desk Organiser',       id: 'm100', category: 'Office Supplies', vendor: 'WorkSmart', img: U('1497515114-4063bc7f5d5c'), price: 1499, comparePrice: 2099 },

  // ── Garden & Plants ───────────────────────────────────────────────────────
  { title: 'Self-Watering Planter 3-Set', id: 'm101', category: 'Garden & Plants', vendor: 'GreenThumb', img: U('1585320806297-9c560cf5d98f'), price: 1999, comparePrice: 2799 },
  { title: 'Bonsai Starter Kit',          id: 'm102', category: 'Garden & Plants', vendor: 'GreenThumb', img: U('1416879595882-3373a0480b5b'), price: 2499, comparePrice: 3499 },
  { title: 'Premium Garden Tool Set 8pc', id: 'm103', category: 'Garden & Plants', vendor: 'GreenThumb', img: U('1526397751294-331021109fbd'), price: 3499, comparePrice: 4999 },
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Luxury Watches':    'A precision-crafted timepiece blending horological heritage with modern elegance.',
  'Footwear':          'Engineered for comfort and style — designed to move with you all day.',
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
  'Smartphones':       'Stay connected with the latest smartphones — faster, smarter, and more capable.',
  'Laptops':           'Power through work, creativity, and entertainment with premium computing.',
  'Cameras':           'Professional-grade optics and sensors to capture every moment in stunning detail.',
  'Gaming':            'Level up your setup with controllers, keyboards, headsets, and consoles.',
  'Home & Kitchen':    'Appliances and cookware that make your kitchen the heart of the home.',
  'Books':             'Expand your mind with bestsellers, classics, and hidden gems.',
  'Toys & Games':      'Spark imagination and family fun with games for every age.',
  'Baby & Kids':       'Safe, soft, and sustainable essentials for your little ones.',
  'Health & Wellness': 'Invest in your wellbeing with vitamins, monitors, and fitness essentials.',
  'Automotive':        'Smart accessories to enhance every drive — from mounts to dash cams.',
  'Grocery & Gourmet': 'Handpicked, premium food and beverage products for the discerning palate.',
  'Pet Supplies':      'Keep your furry friends happy, healthy, and entertained.',
  'Office Supplies':   'Thoughtfully designed tools that make your workspace more productive.',
  'Garden & Plants':   'Bring nature indoors and outdoors with planters, tools, and botanical kits.',
};

export const MOCK_PRODUCTS = MOCK_PRODUCTS_DATA.map((p) => ({
  id: p.id,
  title: p.title,
  handle: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  vendor: p.vendor,
  description: CATEGORY_DESCRIPTIONS[p.category] ?? `A premium item from our ${p.category} collection.`,
  featuredImage: {url: p.img, altText: p.title, width: 800, height: 1000},
  priceRange:          {minVariantPrice: {amount: p.price.toString(), currencyCode: 'INR'}},
  compareAtPriceRange: {minVariantPrice: {amount: p.comparePrice.toString(), currencyCode: 'INR'}},
  variants: {nodes: [{id: `v-${p.id}`, price: {amount: p.price.toString(), currencyCode: 'INR'}, availableForSale: true}]},
  images: {nodes: [{url: p.img, altText: p.title, width: 800, height: 1000}]},
  selectedVariant: {
    id: `v-${p.id}`,
    price: {amount: p.price.toString(), currencyCode: 'INR'},
    availableForSale: true,
    image: {url: p.img, altText: p.title},
  },
}));

export const MOCK_PRODUCTS_BY_CATEGORY = MOCK_PRODUCTS_DATA.reduce<Record<string, typeof MOCK_PRODUCTS>>(
  (acc, _, i) => {
    const cat = MOCK_PRODUCTS_DATA[i].category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(MOCK_PRODUCTS[i]);
    return acc;
  },
  {},
);

export const MOCK_CATEGORIES = Array.from(new Set(MOCK_PRODUCTS_DATA.map((p) => p.category)));
