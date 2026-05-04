/**
 * @file routes/track.tsx
 * @description Order tracking page backed by verified Razorpay orders stored
 * in the customer session.
 */
import {type ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {useActionData, Form, useNavigation, useSearchParams} from '@remix-run/react';
import {findOrderForTracking} from '~/lib/orders.server';

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const orderNumber = String(formData.get('orderNumber') ?? '').trim();
  const emailOrPhone = String(formData.get('email') ?? '').trim();

  if (!orderNumber || !emailOrPhone) {
    return json({success: false, error: 'Please enter both your order number and email or phone.'}, {status: 400});
  }

  const order = findOrderForTracking({
    session: context.session,
    orderNumber,
    emailOrPhone,
  });

  if (!order) {
    return json({success: false, error: 'No matching order was found for those details.'}, {status: 404});
  }

  return json({
    success: true,
    error: null,
    tracking: {
      orderNumber: order.orderNumber,
      carrier: order.tracking.carrier,
      trackingNumber: order.tracking.trackingNumber,
      status: order.status,
      estimatedDelivery: order.tracking.estimatedDelivery,
      events: order.tracking.events,
    },
  });
}

export default function TrackOrderPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const isSubmitting = navigation.state === 'submitting';

  const tracking = actionData && 'tracking' in actionData ? actionData.tracking : null;

  return (
    <div className="min-h-screen bg-neutral-50 py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4">
            Track Your <span className="text-brand-600">Order</span>
          </h1>
          <p className="text-neutral-500">
            Enter your order details to see shipping updates.
          </p>
        </div>

        {!tracking ? (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100">
            <Form method="post" className="space-y-6">
              {actionData && !actionData.success && 'error' in actionData && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                  {actionData.error}
                </div>
              )}

              <div>
                <label htmlFor="orderNumber" className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  defaultValue={searchParams.get('order') ?? ''}
                  placeholder="e.g. HS-ABC12345"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">
                  Email or Phone
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="name@example.com or +919999999999"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary !h-14 !text-lg !rounded-xl relative overflow-hidden transition-all shadow-xl shadow-brand-500/20"
              >
                {isSubmitting ? 'Searching...' : 'Track Package'}
              </button>
            </Form>
          </div>
        ) : (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100 animate-fade-in-up">
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-neutral-100">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">
                  Order {tracking.orderNumber}
                </p>
                <h2 className="text-2xl font-black text-brand-600">
                  {tracking.status.replace(/_/g, ' ')}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">
                  Est. Delivery
                </p>
                <p className="font-bold text-neutral-900">
                  {tracking.estimatedDelivery}
                </p>
              </div>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
              {tracking.events.map((event, index) => (
                <div key={`${event.title}-${index}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-brand-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-[19px] md:left-1/2 animate-zoom-in"
                    style={{ animationDelay: `${(index + 1) * 150}ms`, opacity: 0 }}
                  >
                    {index === 0 ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full opacity-50" />
                    )}
                  </div>

                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] pl-4 md:pl-0 md:group-odd:pr-8 md:group-even:pl-8">
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 hover:border-brand-200 hover:shadow-md transition-all">
                      <p className="text-xs text-brand-600 font-bold mb-1">{event.time}</p>
                      <h4 className="font-black text-neutral-900">{event.title}</h4>
                      <p className="text-sm text-neutral-500">{event.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-100 text-center">
              <p className="text-sm text-neutral-500 mb-4">
                Shipped via {tracking.carrier} ({tracking.trackingNumber})
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-xs font-black uppercase tracking-widest text-brand-600 border-b-2 border-brand-200 pb-1 hover:border-brand-600 transition-all"
              >
                Track Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
