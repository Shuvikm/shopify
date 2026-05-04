import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {getStoredOrders} from '~/lib/orders.server';
import {formatMoney} from '~/lib/utils';

export const meta: MetaFunction = () => [
  {title: 'Your Orders - HydroStore'},
];

export async function loader({context}: LoaderFunctionArgs) {
  return json({orders: getStoredOrders(context.session)});
}

export default function OrdersIndex() {
  const {orders} = useLoaderData<typeof loader>();

  return (
    <div className="bg-neutral-50 min-h-screen py-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-neutral-900">Your Orders</h1>
            <p className="text-neutral-500 text-sm mt-1">Track orders, download invoices, and review purchases.</p>
          </div>
          <Link to="/collections/all" className="btn btn-secondary">Shop again</Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center">
            <h2 className="text-xl font-black text-neutral-900">No orders yet</h2>
            <p className="text-neutral-500 mt-2">Orders paid through Razorpay will appear here.</p>
            <Link to="/collections/all" className="btn btn-primary mt-6">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order.id} to={`/account/orders/${order.id}`} className="block bg-white rounded-2xl border border-neutral-100 p-5 hover:border-brand-200 hover:shadow-sm transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-400">Order {order.orderNumber}</p>
                    <h2 className="font-black text-neutral-900 mt-1">{order.items.length} item{order.items.length === 1 ? '' : 's'}</h2>
                    <p className="text-sm text-neutral-500 mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-black text-brand-600">{formatMoney({amount: order.totals.total, currencyCode: order.totals.currencyCode})}</p>
                    <p className="text-xs text-neutral-500 mt-1">{order.status.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
