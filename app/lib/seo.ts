export function getProductSchema(product: any, selectedVariant: any) {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.featuredImage?.url,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.vendor,
    },
    offers: {
      '@type': 'Offer',
      url: `https://thecollection.com/products/${product.handle}`,
      priceCurrency: selectedVariant?.price?.currencyCode || 'USD',
      price: selectedVariant?.price?.amount || product.priceRange?.minVariantPrice?.amount,
      availability: selectedVariant?.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Collection',
    url: 'https://thecollection.com',
    logo: 'https://thecollection.com/logo.png',
    sameAs: [
      'https://instagram.com/thecollection',
      'https://twitter.com/thecollection',
    ],
  };
}
