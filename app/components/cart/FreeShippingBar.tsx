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
    <div className="px-5 py-4 border-b border-neutral-100 bg-brand-50/30">
      <div className="flex justify-between items-end mb-2">
        <p className="text-xs font-bold text-neutral-800 uppercase tracking-widest">
          {remaining > 0 ? (
            <>
              You're <span className="text-brand-600">{formatMoney({amount: remaining.toString(), currencyCode: subtotal?.currencyCode ?? 'INR'})}</span> away from <span className="text-brand-600 underline">Free Shipping</span>!
            </>
          ) : (
            <span className="text-green-600 flex items-center gap-1">
              🎉 Congrats! You've unlocked <b>Free Shipping</b>
            </span>
          )}
        </p>
        <span className="text-[10px] font-black text-neutral-400">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-brand-500 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(79,99,248,0.5)]"
          style={{width: `${progress}%`}}
        />
      </div>
    </div>
  );
}
