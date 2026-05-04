import {useEffect, useState} from 'react';
import {QuickAddButton} from './QuickAddButton';
import {formatMoney, cn} from '~/lib/utils';

export function StickyAddToCart({product}: {product: any}) {
  const [isVisible, setIsVisible] = useState(false);
  const selectedVariant = product.selectedVariant ?? product.variants?.nodes?.[0];
  const price = selectedVariant?.price ?? product.priceRange?.minVariantPrice;

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the main buy section (approx 600px)
      setIsVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[60] bg-paper/80 backdrop-blur-xl border-t border-brand-primary/5 p-4 md:py-3 transition-all duration-700 ease-in-out transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      )}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between gap-6">
        <div className="hidden sm:flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 overflow-hidden">
             {product.featuredImage && (
               <img src={product.featuredImage.url} alt="" className="w-full h-full object-cover" />
             )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-brand-accent mb-0.5">
              Selection
            </span>
            <span className="text-sm font-serif text-brand-primary truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8 ml-auto">
          <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400">
              Total Investment
            </span>
            <span className="text-lg font-light text-brand-primary">
              {price ? formatMoney(price) : ''}
            </span>
          </div>
          
          <QuickAddButton
            variantId={selectedVariant?.id ?? ''}
            quantity={1}
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            className="bg-brand-primary text-white px-10 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-accent transition-all duration-500 shadow-xl shadow-brand-primary/10"
          >
            {selectedVariant?.availableForSale ? 'Secure Your Order' : 'Sold Out'}
          </QuickAddButton>
        </div>
      </div>
    </div>
  );
}
