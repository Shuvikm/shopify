/**
 * @file CollectionQuery.ts
 * @description Paginated collection query with cursor-based pagination.
 * Supports Remix's `useFetcher`-based infinite scroll / "Load More" pattern.
 */
import {PRODUCT_CARD_FRAGMENT} from './ProductQuery';

export const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

export const PRODUCTS_QUERY = `#graphql
  query Products(
    $query: String
    $country: CountryCode
    $language: LanguageCode
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $first: Int
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      after: $endCursor
      query: $query
      sortKey: $sortKey
      reverse: $reverse
    ) {
      filters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
}

export interface CollectionType {
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: {title: string | null; description: string | null};
  image: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  products: {
    filters: Array<{
      id: string;
      label: string;
      type: string;
      values: Array<{
        id: string;
        label: string;
        count: number;
        input: string;
      }>;
    }>;
    nodes: import('./ProductQuery').ProductType[];
    pageInfo: PageInfo;
  };
}
