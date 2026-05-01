/**
 * @file StickyAddToCart.tsx
 * @description Floating bar that appears on scroll to keep the CTA visible.
 */
import {useEffect, useState} from 'react';
import {QuickAddButton} from './QuickAddButton';
import {formatMoney, cn} from '~/lib/utils';

export function StickyAddToCart({product}: {product: any}) {
  const [isVisible, setIsVisible] = useState(false);
  const selectedVariant = product.selectedVariant ?? product.variants.nodes[0];

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-neutral-200 p-4 transition-transform duration-300 md:hidden',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-neutral-900 truncate max-w-[150px]">
            {product.title}
          </span>
          <span className="text-sm font-black text-brand-600">
            {formatMoney(selectedVariant.price)}
          </span>
        </div>
        <QuickAddButton
          variantId={selectedVariant.id}
          quantity={1}
          className="btn-primary !py-3 !px-6"
        >
          Add to Cart
        </QuickAddButton>
      </div>
    </div>
  );
}
