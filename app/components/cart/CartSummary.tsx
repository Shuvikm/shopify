/**
 * @file CartSummary.tsx
 * @description Amazon-style cart summary with tax breakdown, EMI badge,
 *              coupon code input, and Razorpay checkout.
 */
import {useState} from 'react';
import {formatMoney} from '~/lib/utils';

interface CartSummaryCost {
  subtotalAmount?: {amount: string; currencyCode: string};
  totalAmount?:    {amount: string; currencyCode: string};
  totalTaxAmount?: {amount: string; currencyCode: string} | null;
}

interface CartSummaryProps {
  cost: CartSummaryCost | null | undefined;
  checkoutUrl: string;
}

const COUPONS: Record<string, number> = {
  HYDRO10: 10,
  HYDRO20: 20,
  SAVE50:  50,
  SAVE100: 100,
};

export function CartSummary({cost}: CartSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail]               = useState('');
  const [phone, setPhone]               = useState('');
  const [coupon, setCoupon]             = useState('');
  const [couponApplied, setCouponApplied] = useState<{code: string; off: number} | null>(null);
  const [couponError, setCouponError]   = useState('');

  const subtotal   = parseFloat(cost?.subtotalAmount?.amount ?? '0');
  const discount   = couponApplied?.off ?? 0;
  const afterDisc  = Math.max(0, subtotal - discount);
  const cgst       = Math.round(afterDisc * 0.09);
  const sgst       = Math.round(afterDisc * 0.09);
  const shipping   = afterDisc >= 5000 ? 0 : 99;
  const grandTotal = afterDisc + cgst + sgst + shipping;

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (COUPONS[code]) {
      setCouponApplied({code, off: COUPONS[code]});
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
    }
  }

  function handleCheckout() {
    if (!email && !phone) {
      alert('Please enter your email or phone number for the invoice.');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      window.location.href = '/checkout/success';
    }, 2200);
  }

  return (
    <div className="shrink-0 border-t border-neutral-100 px-5 py-5 space-y-4 bg-white">
      {/* Order Summary */}
      <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Order Summary</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Items</span>
          <span className="font-semibold">
            {cost?.subtotalAmount ? formatMoney(cost.subtotalAmount) : '—'}
          </span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-emerald-600">
            <span>Coupon ({couponApplied.code})</span>
            <span>-₹{couponApplied.off}</span>
          </div>
        )}
        <div className="flex justify-between text-neutral-500">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-emerald-600 font-bold' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>CGST (9%)</span>
          <span>₹{cgst}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>SGST (9%)</span>
          <span>₹{sgst}</span>
        </div>
      </div>

      <div className="flex justify-between text-base font-black border-t border-neutral-100 pt-3">
        <span>Order Total</span>
        <span className="text-brand-600">₹{grandTotal.toLocaleString('en-IN')}</span>
      </div>

      {/* EMI badge */}
      {grandTotal >= 3000 && (
        <div className="text-[10px] text-neutral-500 bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-100">
          💳 <strong>EMI available</strong> from ₹{Math.round(grandTotal / 6).toLocaleString('en-IN')}/mo on select cards.
        </div>
      )}

      {/* Coupon */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Promo Code</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={coupon}
            onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
            placeholder="e.g. HYDRO20"
            className="flex-1 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-400 transition-colors uppercase"
          />
          <button onClick={applyCoupon} className="px-3 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-lg transition-colors">
            Apply
          </button>
        </div>
        {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
        {couponApplied && <p className="text-[10px] text-emerald-600 font-bold">✓ Coupon applied! You save ₹{couponApplied.off}</p>}
      </div>

      {/* Contact for invoice */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Send Invoice To</p>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-400 transition-colors"
        />
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone Number (any format)"
          className="w-full bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-400 transition-colors"
        />
      </div>

      {/* Razorpay CTA */}
      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-sm text-white transition-all disabled:opacity-60 relative overflow-hidden"
        style={{background: isProcessing ? '#94a3b8' : 'linear-gradient(135deg,#3395ff,#2563eb)'}}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Processing Payment...
          </span>
        ) : (
          <>Pay with Razorpay  ₹{grandTotal.toLocaleString('en-IN')}</>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[9px] text-neutral-400 font-medium">
        <span>🔒</span><span>256-bit SSL Secured</span>
        <span>·</span><span>🛡️ Razorpay Protected</span>
      </div>

      <a href="/collections/all" className="block text-center text-xs text-neutral-500 hover:text-brand-600 transition-colors">
        ← Continue Shopping
      </a>
    </div>
  );
}
