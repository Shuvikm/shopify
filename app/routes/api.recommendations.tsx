/**
 * @file routes/api.recommendations.tsx
 * @description Resource route for fetching product recommendations.
 */
import {type LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {dedupeProducts} from '~/lib/products';
import {withTimeout} from '~/lib/async.server';

const RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      vendor
      description
      featuredImage {
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront, session} = context;
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');
  const userId = session.get('userId');

  let products: any[] = [];

  // 1. Get recommendations for the primary product if provided
  if (productId) {
    const formattedId = productId.includes('gid://') 
      ? productId 
      : `gid://shopify/Product/${productId}`;

    try {
      const {productRecommendations} = await withTimeout(storefront.query(RECOMMENDATIONS_QUERY, {
        cache: storefront.CacheShort(),
        variables: {
          productId: formattedId,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
      }), 5000, 'primary recommendations');
      products = [...(productRecommendations || [])];
    } catch (error) {
      console.error('Error fetching primary recommendations:', error);
    }
  }

  // 2. If logged in, get recommendations based on liked items
  if (userId) {
    try {
      /*
      const {prisma} = await import('~/lib/db.server');
      const likedItems = await prisma.like.findMany({
        where: {userId},
        take: 3,
        orderBy: {createdAt: 'desc'}
      });

      for (const item of likedItems) {
        try {
          const {productRecommendations} = await withTimeout(storefront.query(RECOMMENDATIONS_QUERY, {
            cache: storefront.CacheShort(),
            variables: {
              productId: item.productId,
              country: storefront.i18n.country,
              language: storefront.i18n.language,
            },
          }), 3000, `liked recommendation ${item.productId}`);
          products = [...products, ...(productRecommendations || [])];
        } catch (e) {
          // Ignore individual failures
        }
      }
      */
    } catch (error) {

      console.error('Error fetching liked items recommendations:', error);
    }
  }

  return json({products: dedupeProducts(products)});
}

