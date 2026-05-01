/**
 * @file root.tsx
 * @description Root layout for the Hydrogen storefront.
 */
import {type LinksFunction, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {defer} from '@remix-run/server-runtime';
import {Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, type ShouldRevalidateFunction} from '@remix-run/react';
import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {CartProvider} from '@shopify/hydrogen-react';

import appStyles from '~/styles/app.css?url';
import {Header, Footer} from '~/components/layout';
import {CartDrawer} from '~/components/cart';
import {RecentPurchasePopup} from '~/components/product/RecentPurchasePopup';
import {useCart} from '~/hooks/useCart';

export const links: LinksFunction = () => [
  {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
  {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
  {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'},
  {rel: 'stylesheet', href: appStyles},
  {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, env, cart} = context;
  return defer({
    cart: cart.get(),
    shop: getShopAnalytics({storefront, publicStorefrontId: env.PUBLIC_STOREFRONT_ID}),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    selectedLocale: storefront.i18n,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
  });
}

export const shouldRevalidate: ShouldRevalidateFunction = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() !== nextUrl.toString()) return true;
  return false;
};

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
          <CartProvider countryCode={data.selectedLocale.country}>
            <AppLayout />
          </CartProvider>
        </Analytics.Provider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

function AppLayout() {
  const {isOpen, closeCart} = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Global Components */}
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
      <RecentPurchasePopup />
    </div>
  );
}

export function CatchBoundary() {
  return (
    <html lang="en">
      <head><title>404 – Page Not Found</title><Meta /><Links /></head>
      <body className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-neutral-200 mb-4">404</h1>
          <p className="text-xl text-neutral-500 mb-8">Page not found.</p>
          <a href="/" className="btn-primary">Back to Home</a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  return (
    <html lang="en">
      <head><title>Error – Something went wrong</title><Meta /><Links /></head>
      <body className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="text-center max-w-lg">
          <h1 className="text-4xl font-bold text-neutral-800 mb-4">Something went wrong</h1>
          <p className="text-neutral-500 mb-2">{error?.message}</p>
          <a href="/" className="btn-primary mt-6 inline-block">Back to Home</a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
