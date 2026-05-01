/**
 * @file ProductQuery.ts
 * @description GraphQL query for the Product Detail Page.
 *
 * Fetches:
 * - Core product fields (title, description, seo)
 * - Variant matrix (all 250 variants for client-side selection)
 * - First 8 media items (images / 3D models)
 * - Metaobject reference for `product_specs`
 *
 * Usage (in a Remix loader):
 *   const {product} = await storefront.query(PRODUCT_QUERY, {
 *     variables: { handle, selectedOptions, language, country },
 *   });
 */

// ─── Reusable Fragments ───────────────────────────────────────────────────────

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    sku
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    handle
    vendor
    description
    descriptionHtml
    productType
    tags
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
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
    seo {
      title
      description
    }
    images(first: 8) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    media(first: 8) {
      nodes {
        mediaContentType
        ... on MediaImage {
          id
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    # Metaobject — Product Specs (namespace: custom, key: product_specs)
    metafield(namespace: "custom", key: "product_specs") {
      reference {
        ... on Metaobject {
          id
          type
          fields {
            key
            value
            type
          }
        }
      }
    }
    # Metaobject — Product Reviews (namespace: custom, key: product_reviews)
    reviewsMetafield: metafield(namespace: "custom", key: "product_reviews") {
      reference {
        ... on Metaobject {
          id
          type
          fields {
            key
            value
            type
          }
        }
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

// ─── Main PDP Query ───────────────────────────────────────────────────────────

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

// ─── Lightweight card fragment (used in collection/search) ────────────────────

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    title
    handle
    vendor
    description
    productType
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
    featuredImage {
      id
      url
      altText
      width
      height
    }
    options {
      name
      values
    }
    variants(first: 1) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

export const NODES_QUERY = `#graphql
  query Nodes(
    $ids: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) {
      ... on Product {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface ProductVariantType {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  sku: string | null;
  selectedOptions: Array<{name: string; value: string}>;
  price: {amount: string; currencyCode: string};
  compareAtPrice: {amount: string; currencyCode: string} | null;
  image: {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
}

export interface MetaobjectField {
  key: string;
  value: string;
  type: string;
}

export interface ProductType {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  options: Array<{name: string; values: string[]}>;
  priceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
    maxVariantPrice: {amount: string; currencyCode: string};
  };
  compareAtPriceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
  seo: {title: string | null; description: string | null};
  images: {
    nodes: Array<{
      id: string;
      url: string;
      altText: string | null;
      width: number;
      height: number;
    }>;
  };
  metafield: {
    reference: {
      id: string;
      type: string;
      fields: MetaobjectField[];
    } | null;
  } | null;
  reviewsMetafield: {
    reference: {
      id: string;
      type: string;
      fields: MetaobjectField[];
    } | null;
  } | null;
  selectedVariant: ProductVariantType | null;
  variants: {nodes: ProductVariantType[]};
}
