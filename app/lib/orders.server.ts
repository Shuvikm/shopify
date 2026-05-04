import type {CartLine} from '~/graphql/CartMutations';
import {calculateCheckoutTotals, type CheckoutTotals} from './checkout';
import type {AppSession} from './session.server';

const SESSION_ORDERS_KEY = 'hydrostore_orders';
const SESSION_PENDING_ORDER_KEY = 'hydrostore_pending_order';
const MAX_SESSION_ORDERS = 12;

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'PAYMENT_FAILED';

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  handle: string;
  variantTitle: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currencyCode: string;
}

export interface TrackingEvent {
  time: string;
  title: string;
  location: string;
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  customer: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items: OrderItem[];
  totals: CheckoutTotals;
  payment: {
    provider: 'razorpay';
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };
  tracking: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    events: TrackingEvent[];
  };
}

interface CartLike {
  id?: string | null;
  lines?: {nodes?: CartLine[] | null} | null;
  cost?: Parameters<typeof calculateCheckoutTotals>[0];
}

function readJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function getStoredOrders(session: AppSession): StoredOrder[] {
  return readJson<StoredOrder[]>(session.get(SESSION_ORDERS_KEY), []);
}

export function getLatestOrder(session: AppSession): StoredOrder | null {
  return getStoredOrders(session)[0] ?? null;
}

export function getStoredOrder(session: AppSession, orderId: string | null | undefined): StoredOrder | null {
  if (!orderId) return null;
  const normalized = orderId.replace(/^#/, '').toLowerCase();
  return (
    getStoredOrders(session).find((order) => {
      return (
        order.id.toLowerCase() === normalized ||
        order.orderNumber.replace(/^#/, '').toLowerCase() === normalized
      );
    }) ?? null
  );
}

export function saveStoredOrder(session: AppSession, order: StoredOrder): void {
  const orders = getStoredOrders(session).filter((existing) => existing.id !== order.id);
  session.set(SESSION_ORDERS_KEY, JSON.stringify([order, ...orders].slice(0, MAX_SESSION_ORDERS)));
}

export function getPendingOrder(session: AppSession): StoredOrder | null {
  return readJson<StoredOrder | null>(session.get(SESSION_PENDING_ORDER_KEY), null);
}

export function savePendingOrder(session: AppSession, order: StoredOrder): void {
  session.set(SESSION_PENDING_ORDER_KEY, JSON.stringify(order));
}

export function clearPendingOrder(session: AppSession): void {
  session.unset(SESSION_PENDING_ORDER_KEY);
}

function orderNumberFromId(id: string): string {
  return `HS-${id.slice(-8).toUpperCase()}`;
}

function moneyToNumber(amount: string | null | undefined): number {
  const value = Number.parseFloat(amount ?? '0');
  return Number.isFinite(value) ? value : 0;
}

function lineToItem(line: CartLine): OrderItem {
  const merchandise = line.merchandise;
  const unitPrice = moneyToNumber(merchandise.price?.amount);
  const lineTotal = moneyToNumber(line.cost?.totalAmount?.amount) || unitPrice * line.quantity;

  return {
    productId: merchandise.product.id,
    variantId: merchandise.id,
    title: merchandise.product.title,
    handle: merchandise.product.handle,
    variantTitle: merchandise.title,
    imageUrl: merchandise.image?.url ?? null,
    quantity: line.quantity,
    unitPrice,
    lineTotal,
    currencyCode: merchandise.price?.currencyCode ?? line.cost?.totalAmount?.currencyCode ?? 'INR',
  };
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function buildTracking(status: OrderStatus, createdAt: string): StoredOrder['tracking'] {
  const created = new Date(createdAt);
  const estimated = addDays(created, 4).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const events: TrackingEvent[] = [
    {
      time: created.toLocaleString('en-IN', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}),
      title: 'Order confirmed',
      location: 'HydroStore checkout',
    },
  ];

  if (status !== 'PENDING_PAYMENT' && status !== 'PAYMENT_FAILED') {
    events.unshift({
      time: addDays(created, 1).toLocaleString('en-IN', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}),
      title: 'Preparing for dispatch',
      location: 'Fulfillment center',
    });
  }

  return {
    carrier: 'HydroStore Logistics',
    trackingNumber: `HSL${created.getTime().toString().slice(-10)}`,
    estimatedDelivery: estimated,
    events,
  };
}

export function createPendingOrder({
  cart,
  razorpayOrderId,
  customer,
  couponCode,
}: {
  cart: CartLike;
  razorpayOrderId: string;
  customer: StoredOrder['customer'];
  couponCode?: string | null;
}): StoredOrder {
  const createdAt = new Date().toISOString();
  const id = crypto.randomUUID();
  const lines = Array.isArray(cart.lines?.nodes) ? cart.lines.nodes : [];

  return {
    id,
    orderNumber: orderNumberFromId(id),
    createdAt,
    updatedAt: createdAt,
    status: 'PENDING_PAYMENT',
    paymentStatus: 'pending',
    customer,
    items: lines.map(lineToItem),
    totals: calculateCheckoutTotals(cart.cost, couponCode),
    payment: {
      provider: 'razorpay',
      razorpayOrderId,
    },
    tracking: buildTracking('PENDING_PAYMENT', createdAt),
  };
}

export function markOrderPaid(
  order: StoredOrder,
  payment: {
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
): StoredOrder {
  const updatedAt = new Date().toISOString();
  return {
    ...order,
    updatedAt,
    status: 'CONFIRMED',
    paymentStatus: 'paid',
    payment: {
      ...order.payment,
      ...payment,
    },
    tracking: buildTracking('CONFIRMED', order.createdAt),
  };
}

export function findOrderForTracking({
  session,
  orderNumber,
  emailOrPhone,
}: {
  session: AppSession;
  orderNumber: string;
  emailOrPhone: string;
}): StoredOrder | null {
  const normalizedOrder = orderNumber.replace(/^#/, '').trim().toLowerCase();
  const normalizedContact = emailOrPhone.trim().toLowerCase();

  return (
    getStoredOrders(session).find((order) => {
      const matchesOrder =
        order.orderNumber.replace(/^#/, '').toLowerCase() === normalizedOrder ||
        order.id.toLowerCase() === normalizedOrder;
      const matchesContact =
        order.customer.email?.toLowerCase() === normalizedContact ||
        order.customer.phone?.toLowerCase() === normalizedContact;
      return matchesOrder && matchesContact;
    }) ?? null
  );
}
