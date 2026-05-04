import {useState, useEffect} from 'react';
import {useCart} from '~/hooks/useCart';

export function AbandonedCartNotifier() {
  const {cart} = useCart();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('abandoned_cart_dismissed');
    if (isDismissed) return;

    // Check if cart has items and user has been on site for 2 minutes
    const timer = setTimeout(() => {
      const lines = (cart as any)?.lines?.nodes ?? [];
      if (lines.length > 0) {
        setIsVisible(true);
      }
    }, 120000); // 2 minutes

    return () => clearTimeout(timer);
  }, [cart]);

  const dismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('abandoned_cart_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[80] max-w-sm animate-slide-in-right">
      <div className="bg-white p-6 shadow-2xl border border-brand-primary/5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent">Reserved for You</p>
          <button onClick={dismiss} className="text-neutral-400 hover:text-brand-primary transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-serif text-brand-primary">Items still in your selection</p>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Your curated selection is waiting. Complete your order today to ensure immediate priority shipment.
          </p>
        </div>
        <button 
          onClick={dismiss}
          className="w-full py-3 bg-brand-primary text-white text-[9px] uppercase tracking-[0.25em] hover:bg-brand-accent transition-all duration-500"
        >
          Resume Selection
        </button>
      </div>
    </div>
  );
}
