/**
 * @file graphql/index.ts
 * @description Barrel re-export for all GraphQL queries and fragments.
 */
// Product
export {
  PRODUCT_QUERY,
  PRODUCT_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
} from './ProductQuery';
export type {ProductType, ProductVariantType, MetaobjectField} from './ProductQuery';

// Collection
export {COLLECTION_QUERY} from './CollectionQuery';
export type {CollectionType, PageInfo} from './CollectionQuery';

// Search
export {PREDICTIVE_SEARCH_QUERY} from './PredictiveSearchQuery';
export type {
  PredictiveSearchResult,
  PredictiveSearchProduct,
  PredictiveSearchCollection,
} from './PredictiveSearchQuery';

// Cart
export {
  CART_QUERY_FRAGMENT,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
  CART_BUYER_IDENTITY_UPDATE_MUTATION,
} from './CartMutations';
export type {CartLine, CartType} from './CartMutations';
