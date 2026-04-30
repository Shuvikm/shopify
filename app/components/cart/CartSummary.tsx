/**
 * @file CartSummary.tsx
 * @description Cart subtotal, tax note, and checkout button.
 */
import {formatMoney} from '~/lib/utils';

interface CartSummaryCost {
  subtotalAmount?: {amount: string; currencyCode: string};
  totalAmount?: {amount: string; currencyCode: string};
  totalTaxAmount?: {amount: string; currencyCode: string} | null;
}

interface CartSummaryProps {
  cost: CartSummaryCost | null | undefined;
  checkoutUrl: string;
}

export function CartSummary({cost, checkoutUrl}: CartSummaryProps) {
  return (
    <div className="shrink-0 border-t border-neutral-100 px-5 py-5 space-y-4 bg-white">
      {/* Subtotal row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-500">Subtotal</span>
        <span className="font-semibold text-neutral-900">
          {cost?.subtotalAmount
            ? formatMoney(cost.subtotalAmount)
            : '—'}
        </span>
      </div>

      {/* Tax note */}
      <p className="text-xs text-neutral-400">
        Taxes and shipping calculated at checkout.
      </p>

      {/* Checkout CTA */}
      <a
        href={checkoutUrl}
        id="cart-checkout-btn"
        className="btn btn-primary btn-lg w-full justify-center"
      >
        Checkout →
      </a>

      {/* Continue Shopping */}
      <a
        href="/collections/all"
        className="block text-center text-sm text-neutral-500 hover:text-brand-600 transition-colors"
      >
        Continue Shopping
      </a>
    </div>
  );
}
