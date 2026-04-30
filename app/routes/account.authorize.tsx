/**
 * @file routes/account.authorize.tsx
 * @description OAuth authorize callback stub — /account/authorize
 * Required by the Shopify Customer Account API OAuth flow.
 * Returns 404 until Customer Account API is fully implemented.
 */
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({}: LoaderFunctionArgs): Promise<never> {
  // When Customer Account API is integrated, handle the OAuth callback here.
  // See: https://shopify.dev/docs/storefronts/headless/hydrogen/customer-account-api
  throw new Response('Customer Account API not yet configured', {status: 404});
}
