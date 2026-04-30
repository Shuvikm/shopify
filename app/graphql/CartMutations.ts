/**
 * @file CartMutations.ts
 * @description All Storefront API cart mutations + the shared CartFragment.
 *
 * These are used by:
 * - `app/lib/cart.server.ts` (server-side cart helpers)
 * - `app/routes/cart.tsx` (Remix actions)
 *
 * The `CART_QUERY_FRAGMENT` is also imported in `server.ts` so Hydrogen
 * uses the same shape when reading cart cookies.
 */

// ─── Core Fragment ─────────────────────────────────────────────────────────────

export const CART_QUERY_FRAGMENT = `#graphql
  fragment CartApiQuery on Cart {
    updatedAt
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes {
          key
          value
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          amountPerQuantity {
            amount
            currencyCode
          }
          compareAtAmountPerQuantity {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            availableForSale
            compareAtPrice {
              amount
              currencyCode
            }
            price {
              currencyCode
              amount
            }
            requiresShipping
            title
            image {
              id
              url
              altText
              width
              height
            }
            product {
              handle
              title
              id
              vendor
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
    cost {
      subtotalAmount {
        currencyCode
        amount
      }
      totalAmount {
        currencyCode
        amount
      }
      totalDutyAmount {
        currencyCode
        amount
      }
      totalTaxAmount {
        currencyCode
        amount
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;

// ─── Mutations ─────────────────────────────────────────────────────────────────

export const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate(
    $input: CartInput!
    $country: CountryCode = ZZ
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart {
        ...CartApiQuery
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_QUERY_FRAGMENT}
` as const;

export const CART_LINES_ADD_MUTATION = `#graphql
  mutation CartLinesAdd(
    $cartId: ID!
    $lines: [CartLineInput!]!
    $country: CountryCode = ZZ
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartApiQuery
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_QUERY_FRAGMENT}
` as const;

export const CART_LINES_UPDATE_MUTATION = `#graphql
  mutation CartLinesUpdate(
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
    $country: CountryCode = ZZ
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartApiQuery
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_QUERY_FRAGMENT}
` as const;

export const CART_LINES_REMOVE_MUTATION = `#graphql
  mutation CartLinesRemove(
    $cartId: ID!
    $lineIds: [ID!]!
    $country: CountryCode = ZZ
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartApiQuery
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_QUERY_FRAGMENT}
` as const;

export const CART_DISCOUNT_CODES_UPDATE_MUTATION = `#graphql
  mutation CartDiscountCodesUpdate(
    $cartId: ID!
    $discountCodes: [String!]!
    $country: CountryCode = ZZ
  ) @inContext(country: $country) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartApiQuery
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_QUERY_FRAGMENT}
` as const;

export const CART_BUYER_IDENTITY_UPDATE_MUTATION = `#graphql
  mutation CartBuyerIdentityUpdate(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
    $country: CountryCode = ZZ
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartApiQuery
      }
      userErrors {
        code
        field
        message
      }
    }
  }
  ${CART_QUERY_FRAGMENT}
` as const;

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export interface CartLine {
  id: string;
  quantity: number;
  attributes: Array<{key: string; value: string}>;
  cost: {
    totalAmount: {amount: string; currencyCode: string};
    amountPerQuantity: {amount: string; currencyCode: string};
    compareAtAmountPerQuantity: {amount: string; currencyCode: string} | null;
  };
  merchandise: {
    id: string;
    availableForSale: boolean;
    compareAtPrice: {amount: string; currencyCode: string} | null;
    price: {amount: string; currencyCode: string};
    requiresShipping: boolean;
    title: string;
    image: {
      id: string;
      url: string;
      altText: string | null;
      width: number;
      height: number;
    } | null;
    product: {handle: string; title: string; id: string; vendor: string};
    selectedOptions: Array<{name: string; value: string}>;
  };
}

export interface CartType {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {nodes: CartLine[]};
  cost: {
    subtotalAmount: {amount: string; currencyCode: string};
    totalAmount: {amount: string; currencyCode: string};
    totalDutyAmount: {amount: string; currencyCode: string} | null;
    totalTaxAmount: {amount: string; currencyCode: string} | null;
  };
  note: string | null;
  attributes: Array<{key: string; value: string}>;
  discountCodes: Array<{code: string; applicable: boolean}>;
}
