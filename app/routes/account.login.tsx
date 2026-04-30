/**
 * @file routes/account.login.tsx
 * @description Customer login stub — /account/login
 * Redirects to Shopify's hosted login page.
 */
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const shopDomain = new URL(`https://${storefront.getApiUrl()}`).hostname
    .split('/')[0];
  return Response.redirect(`https://${shopDomain}/account/login`, 302);
}
