/**
 * @file checkout.success.tsx
 * @description Amazon-style order confirmation page with detailed invoice,
 *              estimated delivery, and tracking link.
 */
import {Link} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Order Confirmed — HydroStore'},
];

const MOCK_ITEMS = [
  {title: 'Luxury Chronograph Watch',  qty: 1, price: 14900},
  {title: 'Designer Silk Scarf',       qty: 2, price: 4200},
];

function useCountdown(hrs: number) {
  const [s, setS] = useState(hrs * 3600);
  useEffect(() => { const t = setInterval(() => setS(x => Math.max(0, x-1)), 1000); return () => clearInterval(t); }, []);
  const h = String(Math.floor(s/3600)).padStart(2,'0');
  const m = String(Math.floor((s%3600)/60)).padStart(2,'0');
  const sec = String(s%60).padStart(2,'0');
  return `${h}:${m}:${sec}`;
}

export default function CheckoutSuccessPage() {
  const orderId = `#HS-${Date.now().toString(36).toUpperCase()}`;
  const date = new Date().toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'});
  const deliveryDate = new Date(Date.now() + 4*24*60*60*1000).toLocaleDateString('en-IN', {weekday:'long', day:'numeric', month:'long'});
  const subtotal = MOCK_ITEMS.reduce((a,i) => a + i.price * i.qty, 0);
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const grand = subtotal + cgst + sgst;
  const timeLeft = useCountdown(24);

  return (
    <div className="min-h-screen bg-neutral-50 py-10">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">

        {/* Success Header */}
        <div className="bg-emerald-600 text-white rounded-2xl p-8 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-black mb-1">Order Confirmed! 🎉</h1>
          <p className="text-emerald-100 text-sm">Thank you for shopping with HydroStore.</p>
          <p className="text-white font-bold mt-3 text-lg">{orderId}</p>
          <p className="text-emerald-200 text-xs mt-1">{date}</p>
        </div>

        {/* Delivery estimate */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl shrink-0">📦</div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-0.5">Estimated Delivery</p>
              <p className="font-black text-neutral-900 text-lg">{deliveryDate}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Express delivery — 4 business days</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Time to confirm:</p>
              <span className="text-xl font-black text-red-600 tabular-nums">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-50 flex items-center justify-between">
            <p className="font-black text-neutral-900">Invoice</p>
            <button className="text-xs font-bold text-brand-600 hover:underline">Download PDF</button>
          </div>

          <div className="p-6 space-y-4">
            {MOCK_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-neutral-50 last:border-0">
                <img src={`https://picsum.photos/id/${i+1}/80/80`} alt={item.title} className="w-14 h-14 object-cover rounded-lg bg-neutral-50" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-neutral-800">{item.title}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Qty: {item.qty}</p>
                </div>
                <p className="font-bold text-neutral-900">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
              </div>
            ))}

            <div className="space-y-2 pt-2 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>CGST (9%)</span>
                <span>₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>SGST (9%)</span>
                <span>₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between font-black text-neutral-900 text-base border-t border-neutral-100 pt-3">
                <span>Total Paid</span>
                <span className="text-brand-600">₹{grand.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3 mt-4">
              <span className="text-emerald-500 text-xl">✉️</span>
              <div>
                <p className="text-sm font-black text-emerald-800">Invoice & Confirmation Sent</p>
                <p className="text-xs text-emerald-700 mt-0.5">A detailed invoice has been sent to your email and an SMS tracking link to your phone number.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/track" className="btn btn-secondary !h-12 !rounded-xl font-black text-xs uppercase tracking-widest">
            Track Order
          </Link>
          <Link to="/" className="btn btn-primary !h-12 !rounded-xl font-black text-xs uppercase tracking-widest">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
