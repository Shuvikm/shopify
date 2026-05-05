/**
 * @file server.ts
 * @description Oxygen/Remix server entrypoint.
 * Creates the Storefront client and cart handler, passing them
 * into Remix's `AppLoadContext` for use in loaders and actions.
 *
 * Note: This file runs in the Oxygen (Cloudflare Workers) runtime.
 * Global types like `Env`, `ExecutionContext` are provided by the
 * Cloudflare Workers type definitions.
 */
import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from './lib/session.server';
import {CART_QUERY_FRAGMENT} from './graphql/CartMutations';

// Extend Remix's AppLoadContext with Hydrogen-specific fields.
// These types are declared globally by the Cloudflare Workers / Oxygen runtime.
declare module '@shopify/remix-oxygen' {
  interface AppLoadContext {
    session: AppSession;
    storefront: ReturnType<typeof createHydrogenContext>['storefront'];
    cart: ReturnType<typeof createHydrogenContext>['cart'];
    waitUntil: (promise: Promise<unknown>) => void;
    env: {
      SESSION_SECRET: string;
      PUBLIC_STOREFRONT_API_TOKEN: string;
      PUBLIC_STORE_DOMAIN: string;
      PUBLIC_STOREFRONT_API_VERSION: string;
      PUBLIC_STOREFRONT_ID: string;
      PUBLIC_CHECKOUT_DOMAIN: string;
      PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
      PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
      PUBLIC_RAZORPAY_KEY_ID?: string;
      RAZORPAY_KEY_ID?: string;
      RAZORPAY_KEY_SECRET?: string;
      SENDGRID_API_KEY?: string;
      ORDER_FROM_EMAIL?: string;
      TWILIO_ACCOUNT_SID?: string;
      TWILIO_AUTH_TOKEN?: string;
      TWILIO_FROM_PHONE?: string;
      RUFLOW_ORDER_WEBHOOK_URL?: string;
      REVIEWS_WEBHOOK_URL?: string;
    };
  }
}

import {createRequestHandler} from '@shopify/remix-oxygen';

export default {
  async fetch(
    request: Request,
    env: Record<string, string>,
    executionContext: {waitUntil: (p: Promise<unknown>) => void},
  ): Promise<Response> {
    const session = await AppSession.init(request, [env.SESSION_SECRET]);

    const {storefront, cart} = createHydrogenContext({
      env: env as unknown as Parameters<typeof createHydrogenContext>[0]['env'],
      request,
      cache: await caches.open('hydrogen'),
      waitUntil: executionContext.waitUntil.bind(executionContext),
      i18n: {language: 'EN', country: 'IN'},
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session: session as any,
    });

    /**
     * Dynamic import of the Remix request handler.
     * Vite resolves this at build time to the correct server bundle.
     */
    // @ts-expect-error — build-time virtual module provided by @remix-run/dev
    const remixBuild = await import('virtual:remix/server-build');
    
    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: env.NODE_ENV || 'development',
      getLoadContext: () => ({
        env,
        cart,
        storefront,
        session,
        waitUntil: executionContext.waitUntil.bind(executionContext),
      })
    });

    return handleRequest(request);
  },
};
