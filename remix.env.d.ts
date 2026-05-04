import type {HydrogenSession} from '@shopify/hydrogen';

/**
 * Declare all environment variables expected by the Oxygen runtime.
 * These are injected at build time and available in loaders via `context.env`.
 */
interface Env {
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
}
