import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {getStoredOrder} from '~/lib/orders.server';
import {formatMoney} from '~/lib/utils';

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data?.order ? `Order ${data.order.orderNumber} - HydroStore` : 'Order - HydroStore'},
];

export async function loader({params, context}: LoaderFunctionArgs) {
  const order = getStoredOrder(context.session, params.orderId);
  if (!order) throw new Response('Order not found', {status: 404});
  return json({order});
}

export default function OrderDetail() {
  const {order} = useLoaderData<typeof loader>();

  return (
    <div className="bg-neutral-50 min-h-screen py-10">
      <div className="container mx-auto px-6 max-w-4xl space-y-6">
        <Link to="/account/orders" className="text-sm font-bold text-brand-600 hover:underline">Back to orders</Link>

        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Order</p>
              <h1 className="text-3xl font-black text-neutral-900 mt-1">{order.orderNumber}</h1>
              <p className="text-sm text-neutral-500 mt-2">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
            </div>
            <div className="flex gap-2">
              <a href={`/account/orders/${order.id}/invoice.pdf`} className="btn btn-secondary">Invoice PDF</a>
              <Link to={`/track?order=${encodeURIComponent(order.orderNumber)}`} className="btn btn-primary">Track</Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <section className="md:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6">
            <h2 className="font-black text-neutral-900 mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.variantId}-${item.quantity}`} className="flex items-center gap-4 border-b border-neutral-50 pb-4 last:border-0 last:pb-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-neutral-50" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-neutral-100" />
                  )}
                  <div className="flex-1">
                    <Link to={`/products/${item.handle}`} className="font-bold text-neutral-900 hover:text-brand-600">{item.title}</Link>
                    <p className="text-xs text-neutral-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-neutral-900">{formatMoney({amount: item.lineTotal, currencyCode: item.currencyCode})}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="bg-white rounded-2xl border border-neutral-100 p-6 h-fit">
            <h2 className="font-black text-neutral-900 mb-4">Summary</h2>
            <div className="space-y-2 text-sm">
              <Line label="Subtotal" value={formatMoney({amount: order.totals.subtotal, currencyCode: order.totals.currencyCode})} />
              <Line label="Discount" value={`-${formatMoney({amount: order.totals.discount, currencyCode: order.totals.currencyCode})}`} />
              <Line label="Tax" value={formatMoney({amount: order.totals.tax, currencyCode: order.totals.currencyCode})} />
              <Line label="Shipping" value={order.totals.shipping === 0 ? 'Free' : formatMoney({amount: order.totals.shipping, currencyCode: order.totals.currencyCode})} />
              <div className="border-t border-neutral-100 pt-3 mt-3 flex justify-between font-black">
                <span>Total</span>
                <span className="text-brand-600">{formatMoney({amount: order.totals.total, currencyCode: order.totals.currencyCode})}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Line({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between text-neutral-500">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
