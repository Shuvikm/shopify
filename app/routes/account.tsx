/**
 * @file routes/account.tsx
 * @description Customer account stub — /account
 *
 * Fully implementing customer accounts requires the Shopify Customer Account API
 * (a separate API from the Storefront API). This stub redirects to Shopify's
 * hosted account page until the Customer Account API is wired up.
 *
 * To implement fully, see:
 * https://shopify.dev/docs/storefronts/headless/hydrogen/customer-account-api
 */
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  // Redirect to Shopify's hosted account page
  const shopDomain = new URL(`https://${storefront.getApiUrl()}`).hostname
    .replace(/\/api\/.*/, '')
    .split('/')[0];

  return Response.redirect(`https://${shopDomain}/account`, 302);
}
