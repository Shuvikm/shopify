/**
 * @file routes/api.recommendations.tsx
 * @description Resource route for fetching product recommendations.
 */
import {type LoaderFunctionArgs, json} from '@remix-run/server-runtime';

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
  const {storefront} = context;
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');

  if (!productId) {
    return json({products: []});
  }

  // Ensure it's a valid global ID format (gid://shopify/Product/...)
  const formattedId = productId.includes('gid://') 
    ? productId 
    : `gid://shopify/Product/${productId}`;

  try {
    const {productRecommendations} = await storefront.query(RECOMMENDATIONS_QUERY, {
      variables: {
        productId: formattedId,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    });

    return json({products: productRecommendations || []});
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return json({products: []});
  }
}
