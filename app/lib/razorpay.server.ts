import {toMinorUnits} from './checkout';

interface RazorpayEnv {
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  PUBLIC_RAZORPAY_KEY_ID?: string;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export function getRazorpayKeyId(env: RazorpayEnv): string {
  return env.RAZORPAY_KEY_ID || env.PUBLIC_RAZORPAY_KEY_ID || '';
}

export function isRazorpayConfigured(env: RazorpayEnv): boolean {
  return Boolean(getRazorpayKeyId(env) && env.RAZORPAY_KEY_SECRET);
}

function basicAuth(keyId: string, keySecret: string): string {
  return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

export async function createRazorpayOrder({
  env,
  amount,
  currencyCode,
  receipt,
  notes,
}: {
  env: RazorpayEnv;
  amount: number;
  currencyCode: string;
  receipt: string;
  notes: Record<string, string>;
}): Promise<RazorpayOrderResponse> {
  const keyId = getRazorpayKeyId(env);
  const keySecret = env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: basicAuth(keyId, keySecret),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: toMinorUnits(amount, currencyCode),
      currency: currencyCode,
      receipt,
      notes,
      payment_capture: 1,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Razorpay order creation failed (${response.status}): ${body}`);
  }

  return response.json();
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyRazorpaySignature({
  env,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  env: RazorpayEnv;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<boolean> {
  if (!env.RAZORPAY_KEY_SECRET) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(env.RAZORPAY_KEY_SECRET),
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${razorpayOrderId}|${razorpayPaymentId}`),
  );

  return timingSafeEqual(toHex(signature), razorpaySignature);
}
