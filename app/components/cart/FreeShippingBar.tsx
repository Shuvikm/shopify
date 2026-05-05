/**
 * @file FreeShippingBar.tsx
 * @description Dynamic progress bar showing how much more to spend for free shipping.
 */
import {formatMoney} from '~/lib/utils';

export function FreeShippingBar({subtotal}: {subtotal: any}) {
  const threshold = 5000; // ₹5000 for free shipping
  const amount = parseFloat(subtotal?.amount ?? '0');
  const remaining = Math.max(0, threshold - amount);
  const progress = Math.min(100, (amount / threshold) * 100);

  return (
    <div className="px-5 py-5 border-b border-neutral-100 bg-neutral-50/50 backdrop-blur-sm">
      <div className="flex justify-between items-end mb-3">
        <p className="text-[10px] font-black text-neutral-800 uppercase tracking-[0.15em]">
          {remaining > 0 ? (
            <>
              Add <span className="text-brand-accent font-black">{formatMoney({amount: remaining.toString(), currencyCode: subtotal?.currencyCode ?? 'INR'})}</span> for <span className="underline decoration-[#f6c90e] decoration-2 underline-offset-4">Free Shipping</span>
            </>
          ) : (
            <span className="text-emerald-600 flex items-center gap-2">
              <SparkleIcon /> Unlocked Free Shipping
            </span>
          )}
        </p>
        <span className="text-[10px] font-black text-neutral-400 tabular-nums">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-neutral-200/50 rounded-full overflow-hidden p-[1px]">
        <div 
          className="h-full bg-gradient-to-r from-[#f6c90e] via-[#fce16a] to-[#f6c90e] rounded-full transition-all duration-1000 ease-out relative group"
          style={{width: `${progress}%`}}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <div className="absolute top-0 right-0 h-full w-2 bg-white/40 blur-sm" />
        </div>
      </div>
    </div>

  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

