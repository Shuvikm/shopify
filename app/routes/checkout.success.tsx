/**
 * @file checkout.success.tsx
 * @description Order confirmation page backed by the verified Razorpay order.
 */
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {getLatestOrder, getStoredOrder} from '~/lib/orders.server';
import {formatMoney} from '~/lib/utils';

export const meta: MetaFunction = () => [
  {title: 'Order Confirmed - HydroStore'},
];

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const order = getStoredOrder(context.session, url.searchParams.get('orderId')) ?? getLatestOrder(context.session);
  return json({order});
}

export default function CheckoutSuccessPage() {
  const {order} = useLoaderData<typeof loader>();

  if (!order) {
    return (
      <div className="min-h-screen bg-neutral-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center bg-white rounded-2xl border border-neutral-100 p-10">
          <h1 className="text-3xl font-black text-neutral-900">No recent order found</h1>
          <p className="text-neutral-500 mt-3">Completed orders will appear here after Razorpay verification succeeds.</p>
          <Link to="/collections/all" className="btn btn-primary mt-8">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <div className="bg-emerald-600 text-white rounded-2xl p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-black mb-1">Order Confirmed</h1>
          <p className="text-emerald-100 text-sm">Thank you for shopping with HydroStore.</p>
          <p className="text-white font-bold mt-3 text-lg">{order.orderNumber}</p>
          <p className="text-emerald-200 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-0.5">Estimated Delivery</p>
              <p className="font-black text-neutral-900 text-lg">{order.tracking.estimatedDelivery}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Tracking number {order.tracking.trackingNumber}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-50 flex items-center justify-between">
            <p className="font-black text-neutral-900">Invoice</p>
            <a href={`/account/orders/${order.id}/invoice.pdf`} className="text-xs font-bold text-brand-600 hover:underline">Download PDF</a>
          </div>

          <div className="p-6 space-y-4">
            {order.items.map((item) => (
              <div key={`${item.variantId}-${item.quantity}`} className="flex items-center gap-4 py-3 border-b border-neutral-50 last:border-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-14 h-14 object-cover rounded-lg bg-neutral-50" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-neutral-100" />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-neutral-800">{item.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-neutral-900">{formatMoney({amount: item.lineTotal, currencyCode: item.currencyCode})}</p>
              </div>
            ))}

            <div className="space-y-2 pt-2 text-sm">
              <SummaryLine label="Subtotal" value={formatMoney({amount: order.totals.subtotal, currencyCode: order.totals.currencyCode})} />
              <SummaryLine label="Discount" value={`-${formatMoney({amount: order.totals.discount, currencyCode: order.totals.currencyCode})}`} />
              <SummaryLine label="Tax" value={formatMoney({amount: order.totals.tax, currencyCode: order.totals.currencyCode})} />
              <SummaryLine label="Shipping" value={order.totals.shipping === 0 ? 'Free' : formatMoney({amount: order.totals.shipping, currencyCode: order.totals.currencyCode})} />
              <div className="flex justify-between font-black text-neutral-900 text-base border-t border-neutral-100 pt-3">
                <span>Total Paid</span>
                <span className="text-brand-600">{formatMoney({amount: order.totals.total, currencyCode: order.totals.currencyCode})}</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3 mt-4">
              <div>
                <p className="text-sm font-black text-emerald-800">Confirmation queued</p>
                <p className="text-xs text-emerald-700 mt-0.5">Email, SMS, and workflow notifications are sent asynchronously when the configured providers are available.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to={`/track?order=${encodeURIComponent(order.orderNumber)}`} className="btn btn-secondary !h-12 !rounded-xl font-black text-xs uppercase tracking-widest">
            Track Order
          </Link>
          <Link to="/account/orders" className="btn btn-primary !h-12 !rounded-xl font-black text-xs uppercase tracking-widest">
            Order History
          </Link>
        </div>
      </div>
    </div>
  );
}

function SummaryLine({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between text-neutral-500">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
