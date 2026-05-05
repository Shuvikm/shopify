/**
 * @file routes/api.recommendations.tsx
 * @description Resource route for product recommendations.
 * Accepts ?productId=X&likedId=Y&likedId=Z from CartDrawer.
 * Fetches Shopify recommendations for each unique seed ID (capped at 3 API calls),
 * scores each result by how many sources recommend it, and returns the top 8.
 */
import {type LoaderFunctionArgs, json} from '@remix-run/server-runtime';
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
      featuredImage {
        url
        altText
        width
        height
      }
      variants(first: 1) {
        nodes {
          id
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

function toGid(id: string): string {
  return id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;
}

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);

  const productId = url.searchParams.get('productId');
  const likedIds = url.searchParams.getAll('likedId');

  // Build ordered seed list: primary first, then liked IDs, deduplicated
  const seen = new Set<string>();
  const seeds: string[] = [];
  for (const raw of [productId, ...likedIds]) {
    if (!raw) continue;
    const gid = toGid(raw);
    if (!seen.has(gid)) {
      seen.add(gid);
      seeds.push(gid);
    }
  }

  if (seeds.length === 0) {
    return json({products: []});
  }

  // Cap API calls at 3 to stay within latency budget
  const querySeeds = seeds.slice(0, 3);

  const results = await Promise.allSettled(
    querySeeds.map((gid) =>
      withTimeout(
        storefront.query(RECOMMENDATIONS_QUERY, {
          cache: storefront.CacheShort(),
          variables: {
            productId: gid,
            country: storefront.i18n.country,
            language: storefront.i18n.language,
          },
        }),
        5000,
        `recommendations ${gid}`,
      ),
    ),
  );

  // Score each recommended product by frequency across all sources
  const scoreMap = new Map<string, {product: any; score: number}>();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    const recs: any[] = result.value?.productRecommendations ?? [];
    for (const product of recs) {
      if (!product?.id) continue;
      const entry = scoreMap.get(product.id);
      if (entry) {
        entry.score += 1;
      } else {
        scoreMap.set(product.id, {product, score: 1});
      }
    }
  }

  // Exclude the seed products themselves from results
  for (const gid of querySeeds) scoreMap.delete(gid);

  const ranked = Array.from(scoreMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((e) => e.product);

  return json({products: ranked});
}
