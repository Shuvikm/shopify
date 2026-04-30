/**
 * @file routes/account.orders.$orderId.tsx
 * @description Order detail stub — /account/orders/:orderId
 * Redirects to Shopify's hosted order status page.
 */
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {orderId} = params;
  const shopDomain = new URL(`https://${storefront.getApiUrl()}`).hostname
    .split('/')[0];
  return Response.redirect(
    `https://${shopDomain}/account/orders/${orderId ?? ''}`,
    302,
  );
}
