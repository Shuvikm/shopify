export const COUPONS: Record<string, number> = {
  HYDRO10: 10,
  HYDRO20: 20,
  SAVE50: 50,
  SAVE100: 100,
};

export interface CheckoutCostLike {
  subtotalAmount?: {amount?: string | null; currencyCode?: string | null} | null;
  totalAmount?: {amount?: string | null; currencyCode?: string | null} | null;
  totalTaxAmount?: {amount?: string | null; currencyCode?: string | null} | null;
}

export interface CheckoutTotals {
  currencyCode: string;
  subtotal: number;
  discount: number;
  taxableAmount: number;
  shipping: number;
  cgst: number;
  sgst: number;
  tax: number;
  total: number;
}

function parseAmount(value: string | null | undefined): number {
  const amount = Number.parseFloat(value ?? '0');
  return Number.isFinite(amount) ? amount : 0;
}

export function normalizeCoupon(code: string | null | undefined): string {
  return (code ?? '').trim().toUpperCase();
}

export function getCouponDiscount(code: string | null | undefined): number {
  return COUPONS[normalizeCoupon(code)] ?? 0;
}

export function calculateCheckoutTotals(
  cost: CheckoutCostLike | null | undefined,
  couponCode?: string | null,
): CheckoutTotals {
  const subtotal = parseAmount(cost?.subtotalAmount?.amount);
  const discount = Math.min(getCouponDiscount(couponCode), subtotal);
  const taxableAmount = Math.max(0, subtotal - discount);
  const shipping = taxableAmount === 0 || taxableAmount >= 5000 ? 0 : 99;
  const cgst = Math.round(taxableAmount * 0.09);
  const sgst = Math.round(taxableAmount * 0.09);
  const tax = cgst + sgst;
  const total = taxableAmount + tax + shipping;

  return {
    currencyCode: cost?.subtotalAmount?.currencyCode ?? cost?.totalAmount?.currencyCode ?? 'INR',
    subtotal,
    discount,
    taxableAmount,
    shipping,
    cgst,
    sgst,
    tax,
    total,
  };
}

export function toMinorUnits(amount: number, currencyCode: string): number {
  const zeroDecimalCurrencies = new Set(['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF']);
  const multiplier = zeroDecimalCurrencies.has(currencyCode.toUpperCase()) ? 1 : 100;
  return Math.round(amount * multiplier);
}
