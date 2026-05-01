/**
 * @file RecentPurchasePopup.tsx
 * @description Mocked social proof notification ("Someone recently bought...").
 */
import {useEffect, useState} from 'react';
import {formatMoney} from '~/lib/utils';
import gsap from 'gsap';

export function RecentPurchasePopup() {
  const [purchase, setPurchase] = useState<any>(null);
  
  const mockPurchases = [
    {name: 'Alex from London', product: 'Hydro Snowboard', time: '2 mins ago'},
    {name: 'Sarah from New York', product: 'Premium Binding', time: '15 mins ago'},
    {name: 'Hiroshi from Tokyo', product: 'Tech Essentials Kit', time: '5 mins ago'},
  ];

  useEffect(() => {
    const showPopup = () => {
      const randomPurchase = mockPurchases[Math.floor(Math.random() * mockPurchases.length)];
      setPurchase(randomPurchase);
      
      // Animate in
      gsap.fromTo('#recent-purchase-popup', 
        {x: -100, opacity: 0}, 
        {x: 0, opacity: 1, duration: 0.8, ease: 'power4.out'}
      );

      // Animate out after 5s
      setTimeout(() => {
        gsap.to('#recent-purchase-popup', {
          x: -100, 
          opacity: 0, 
          duration: 0.8, 
          ease: 'power4.in',
          onComplete: () => setPurchase(null)
        });
      }, 5000);
    };

    // Show after 10s
    const initialTimeout = setTimeout(showPopup, 10000);
    
    // Repeat every 30s
    const interval = setInterval(showPopup, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!purchase) return null;

  return (
    <div 
      id="recent-purchase-popup"
      className="fixed bottom-6 left-6 z-50 bg-white rounded-2xl shadow-2xl p-4 border border-neutral-100 flex items-center gap-4 max-w-[320px] pointer-events-none"
    >
      <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-xl">🛍️</span>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Recent Purchase</p>
        <p className="text-xs font-bold text-neutral-800">
          <span className="text-brand-600">{purchase.name}</span> bought a <span className="underline">{purchase.product}</span>
        </p>
        <p className="text-[10px] text-neutral-400 mt-1">{purchase.time}</p>
      </div>
    </div>
  );
}
