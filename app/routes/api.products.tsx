import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const handle = url.searchParams.get('collection') || 'all';
  const limit = Number(url.searchParams.get('limit') || '12');

  try {
    const {storefront} = context;
    const {collection} = await storefront.query(
      `#graphql
        query ApiProducts($handle: String!, $first: Int!, $language: LanguageCode, $country: CountryCode)
        @inContext(language: $language, country: $country) {
          collection(handle: $handle) {
            products(first: $first) {
              nodes {
                id handle title vendor
                priceRange { minVariantPrice { amount currencyCode } }
                featuredImage { url altText }
                variants(first: 1) {
                  nodes { id availableForSale price { amount currencyCode } }
                }
              }
            }
          }
        }
      `,
      {
        cache: storefront.CacheShort(),
        variables: {
          handle,
          first: limit,
          language: storefront.i18n.language,
          country: storefront.i18n.country,
        },
      },
    );
    return json({products: collection?.products?.nodes ?? []});
  } catch (error) {
    console.error('api.products error:', error);
    return json({products: []});
  }
}
