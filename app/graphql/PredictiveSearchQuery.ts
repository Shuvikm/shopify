/**
 * @file PredictiveSearchQuery.ts
 * @description Storefront API predictive search query.
 * Fetches products and collections matching a partial query string.
 * Called via the `/api/predictive-search` resource route (debounced, 300 ms).
 */

export const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      query: $query
      limit: $limit
      limitScope: $limitScope
      types: $types
    ) {
      products {
        id
        title
        handle
        vendor
        trackingParameters
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
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
      collections {
        id
        title
        handle
        trackingParameters
        image {
          url
          altText
          width
          height
        }
      }
      pages {
        id
        title
        handle
        trackingParameters
      }
      articles {
        id
        title
        handle
        trackingParameters
        image {
          url
          altText
        }
        author {
          name
        }
      }
    }
  }
` as const;

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export interface PredictiveSearchProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  trackingParameters: string | null;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
  featuredImage: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
      price: {amount: string; currencyCode: string};
    }>;
  };
}

export interface PredictiveSearchCollection {
  id: string;
  title: string;
  handle: string;
  trackingParameters: string | null;
  image: {url: string; altText: string | null; width: number; height: number} | null;
}

export interface PredictiveSearchPage {
  id: string;
  title: string;
  handle: string;
  trackingParameters: string | null;
}

export interface PredictiveSearchArticle {
  id: string;
  title: string;
  handle: string;
  trackingParameters: string | null;
  image: {url: string; altText: string | null} | null;
  author: {name: string};
}

export interface PredictiveSearchResult {
  products: PredictiveSearchProduct[];
  collections: PredictiveSearchCollection[];
  pages: PredictiveSearchPage[];
  articles: PredictiveSearchArticle[];
}
