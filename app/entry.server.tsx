/**
 * @file entry.server.tsx
 * @description Remix server entry — handles SSR streaming via Hydrogen's
 * `createContentSecurityPolicy` and the Oxygen runtime.
 */
import type {AppLoadContext, EntryContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import {isbot} from 'isbot';
import * as ReactDOMServer from 'react-dom/server';
const {renderToReadableStream} = ReactDOMServer;
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    fontSrc: ["'self'", "fonts.gstatic.com", "data:"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
    scriptSrcElem: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
    imgSrc: ["'self'", "cdn.shopify.com", "data:", "lh3.googleusercontent.com", "https://*.razorpay.com"],
    connectSrc: ["'self'", "cdn.shopify.com", "*.shopify.com", "https://monorail-edge.shopifysvc.com", "https://api.razorpay.com", "https://checkout.razorpay.com"],
    frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
