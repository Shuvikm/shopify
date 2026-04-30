/**
 * @file shopify.server.ts
 * @description Creates the typed Storefront API client.
 * Import and use ONLY inside Remix loaders/actions (server-side).
 * Never import this in a component file.
 */
import {createStorefrontClient, type StorefrontClient} from '@shopify/hydrogen';

export type {StorefrontClient};

/**
 * Initialise the Storefront client from env variables.
 * Typically called inside `server.ts` via `createHydrogenContext`.
 * Exported for use in standalone scripts/tests.
 */
export function createShopifyClient(env: {
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STOREFRONT_API_VERSION: string;
}) {
  return createStorefrontClient({
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    storeDomain: env.PUBLIC_STORE_DOMAIN,
    storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION,
  });
}
