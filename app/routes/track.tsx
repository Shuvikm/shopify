/**
 * @file routes/track.tsx
 * @description Premium Order Tracking Page.
 */
import {type ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {useActionData, Form, useNavigation} from '@remix-run/react';
import {useEffect, useRef} from 'react';

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const orderNumber = formData.get('orderNumber');
  const email = formData.get('email');

  // Basic validation
  if (!orderNumber || !email) {
    return json({error: 'Please enter both your Order Number and Email Address.'}, {status: 400});
  }

  // Simulate an API delay for the premium "searching" effect
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return mocked tracking data
  return json({
    success: true,
    tracking: {
      orderNumber,
      carrier: 'FedEx',
      trackingNumber: 'FX1234567890',
      status: 'IN_TRANSIT',
      estimatedDelivery: 'Tomorrow by 8:00 PM',
      events: [
        {time: 'Today, 8:42 AM', title: 'Out for Delivery', location: 'Local Distribution Center'},
        {time: 'Yesterday, 11:30 PM', title: 'Arrived at Facility', location: 'Regional Hub'},
        {time: '2 days ago, 4:15 PM', title: 'Package Shipped', location: 'Fulfillment Center'},
        {time: '2 days ago, 9:00 AM', title: 'Order Confirmed', location: 'Online Store'},
      ]
    }
  });
}

export default function TrackOrderPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (actionData?.success && resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        {opacity: 0, y: 40},
        {opacity: 1, y: 0, duration: 0.8, ease: 'power4.out'}
      );
      
      gsap.fromTo(
        '.tracking-dot',
        {scale: 0},
        {scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)', delay: 0.3}
      );
    }
  }, [actionData]);

  return (
    <div className="min-h-screen bg-neutral-50 py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4">
            TRACK YOUR <span className="text-brand-600">ORDER.</span>
          </h1>
          <p className="text-neutral-500">
            Enter your order details below to see real-time shipping updates.
          </p>
        </div>

        {!actionData?.success ? (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100">
            <Form method="post" className="space-y-6">
              {actionData?.error && (
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
                  placeholder="e.g. #1024"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-neutral-500 mb-2">
                  Email Address
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary !h-14 !text-lg !rounded-xl relative overflow-hidden transition-all shadow-xl shadow-brand-500/20"
              >
                {isSubmitting ? 'SEARCHING...' : 'TRACK PACKAGE'}
              </button>
            </Form>
          </div>
        ) : (
          <div ref={resultRef} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-neutral-100">
            <div className="flex justify-between items-start mb-8 pb-8 border-b border-neutral-100">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">
                  Order {actionData.tracking?.orderNumber}
                </p>
                <h2 className="text-2xl font-black text-brand-600">
                  {actionData.tracking?.status.replace('_', ' ')}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-1">
                  Est. Delivery
                </p>
                <p className="font-bold text-neutral-900">
                  {actionData.tracking?.estimatedDelivery}
                </p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-7 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
              {actionData.tracking?.events.map((event: any, index: number) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icon */}
                  <div className="tracking-dot flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-brand-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute -left-[19px] md:left-1/2">
                    {index === 0 ? (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full opacity-50" />
                    )}
                  </div>
                  
                  {/* Content */}
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
                Shipped via {actionData.tracking?.carrier} ({actionData.tracking?.trackingNumber})
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="text-xs font-black uppercase tracking-widest text-brand-600 border-b-2 border-brand-200 pb-1 hover:border-brand-600 transition-all"
              >
                Track Another Order →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
