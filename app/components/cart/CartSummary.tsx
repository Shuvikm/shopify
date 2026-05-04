/**
 * @file CartSummary.tsx
 * @description Cart totals, coupon validation, and Razorpay checkout flow.
 */
import {useState} from 'react';
import {calculateCheckoutTotals, COUPONS, normalizeCoupon} from '~/lib/checkout';
import {formatMoney} from '~/lib/utils';

interface CartSummaryCost {
  subtotalAmount?: {amount?: string | null; currencyCode?: string | null} | null;
  totalAmount?: {amount?: string | null; currencyCode?: string | null} | null;
  totalTaxAmount?: {amount?: string | null; currencyCode?: string | null} | null;
}

interface CartSummaryProps {
  cost: CartSummaryCost | null | undefined;
  checkoutUrl: string;
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {email?: string; contact?: string};
  notes: Record<string, string>;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal: {ondismiss: () => void};
  theme: {color: string};
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Razorpay checkout script failed to load.'));
      document.body.appendChild(script);
    });
  }

  return razorpayScriptPromise;
}

async function readJson(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error ?? data?.message ?? 'Checkout request failed.');
  }
  return data;
}

export function CartSummary({cost, checkoutUrl}: CartSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [message, setMessage] = useState<{type: 'error' | 'success'; text: string} | null>(null);

  const totals = calculateCheckoutTotals(cost, couponApplied);
  const hasSubtotal = totals.subtotal > 0;

  function applyCoupon() {
    const code = normalizeCoupon(coupon);
    if (COUPONS[code]) {
      setCouponApplied(code);
      setMessage({type: 'success', text: `Coupon ${code} applied.`});
    } else {
      setCouponApplied(null);
      setMessage({type: 'error', text: 'Invalid coupon code.'});
    }
  }

  async function verifyPayment(payload: {
    merchantOrderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const response = await fetch('/api/razorpay/verify', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    return readJson(response);
  }

  async function handleCheckout() {
    setMessage(null);

    if (!hasSubtotal) {
      setMessage({type: 'error', text: 'Your cart is empty.'});
      return;
    }

    if (!email.trim() && !phone.trim()) {
      setMessage({type: 'error', text: 'Enter an email or phone number for order updates.'});
      return;
    }

    setIsProcessing(true);

    try {
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
          couponCode: couponApplied,
        }),
      });
      const order = await readJson(orderResponse);

      await loadRazorpayScript();
      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is unavailable. Please refresh and try again.');
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'HydroStore',
        description: `Order ${order.orderNumber}`,
        order_id: order.razorpayOrderId,
        prefill: {email: email.trim(), contact: phone.trim()},
        notes: {orderId: order.merchantOrderId, orderNumber: order.orderNumber},
        theme: {color: '#4f63f8'},
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (paymentResponse) => {
          try {
            const verified = await verifyPayment({
              merchantOrderId: order.merchantOrderId,
              ...paymentResponse,
            });
            window.location.href = `/checkout/success?orderId=${encodeURIComponent(verified.orderId)}`;
          } catch (error) {
            setIsProcessing(false);
            setMessage({type: 'error', text: error instanceof Error ? error.message : 'Payment verification failed.'});
          }
        },
      });

      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      setMessage({type: 'error', text: error instanceof Error ? error.message : 'Checkout could not be started.'});
    }
  }

  return (
    <div className="shrink-0 border-t border-neutral-100 px-5 py-5 space-y-4 bg-white">
      <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Order Summary</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Items</span>
          <span className="font-semibold">
            {cost?.subtotalAmount ? formatMoney(cost.subtotalAmount) : 'Rs. 0.00'}
          </span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-emerald-600">
            <span>Coupon ({couponApplied})</span>
            <span>-{formatMoney({amount: totals.discount, currencyCode: totals.currencyCode})}</span>
          </div>
        )}
        <div className="flex justify-between text-neutral-500">
          <span>Shipping</span>
          <span className={totals.shipping === 0 ? 'text-emerald-600 font-bold' : ''}>
            {totals.shipping === 0 ? 'Free' : formatMoney({amount: totals.shipping, currencyCode: totals.currencyCode})}
          </span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>CGST (9%)</span>
          <span>{formatMoney({amount: totals.cgst, currencyCode: totals.currencyCode})}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>SGST (9%)</span>
          <span>{formatMoney({amount: totals.sgst, currencyCode: totals.currencyCode})}</span>
        </div>
      </div>

      <div className="flex justify-between text-base font-black border-t border-neutral-100 pt-3">
        <span>Order Total</span>
        <span className="text-brand-600">{formatMoney({amount: totals.total, currencyCode: totals.currencyCode})}</span>
      </div>

      {totals.total >= 3000 && (
        <div className="text-[10px] text-neutral-500 bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-100">
          <strong>EMI available</strong> from {formatMoney({amount: Math.round(totals.total / 6), currencyCode: totals.currencyCode})}/mo on select cards.
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Promo Code</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={coupon}
            onChange={(event) => {
              setCoupon(event.target.value);
              setMessage(null);
            }}
            placeholder="e.g. HYDRO20"
            className="flex-1 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-400 transition-colors uppercase"
          />
          <button type="button" onClick={applyCoupon} className="px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg transition-colors">
            Apply
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Send Invoice To</p>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="w-full bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-400 transition-colors"
        />
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Phone number with country code"
          className="w-full bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-400 transition-colors"
        />
      </div>

      {message && (
        <div className={`rounded-lg px-3 py-2 text-xs font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
          {message.text}
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isProcessing || !hasSubtotal}
        className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-sm text-white transition-all disabled:opacity-60 relative overflow-hidden"
        style={{background: isProcessing ? '#94a3b8' : 'linear-gradient(135deg,#3395ff,#2563eb)'}}
      >
        {isProcessing ? 'Processing Payment...' : `Pay with Razorpay ${formatMoney({amount: totals.total, currencyCode: totals.currencyCode})}`}
      </button>

      <div className="flex items-center justify-center gap-2 text-[9px] text-neutral-400 font-medium">
        <span>SSL secured</span>
        <span>|</span>
        <span>Razorpay protected</span>
      </div>

      <a href={checkoutUrl} className="block text-center text-xs text-neutral-500 hover:text-brand-600 transition-colors">
        Continue with Shopify checkout
      </a>
    </div>
  );
}
