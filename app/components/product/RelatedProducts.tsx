import {useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';
import {ProductCard, ProductCardSkeleton} from './ProductCard';
import {cn} from '~/lib/utils';

interface RelatedProductsProps {
  productId?: string;
  heading?: string;
  className?: string;
}

export function RelatedProducts({productId, heading = "You May Also Like", className}: RelatedProductsProps) {
  const fetcher = useFetcher<{products: any[]}>();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const url = productId 
      ? `/api/recommendations?productId=${productId}` 
      : '/api/recommendations';
    fetcher.load(url);
  }, [productId]);

  useEffect(() => {
    if (fetcher.data?.products) {
      setProducts(fetcher.data.products);
    }
  }, [fetcher.data]);

  if (fetcher.state === 'loading' && products.length === 0) {
    return (
      <section className={cn("py-12", className)}>
        <h2 className="text-sm font-black uppercase tracking-widest mb-8 px-6">{heading}</h2>
        <div className="flex gap-6 overflow-x-auto px-6 pb-6 no-scrollbar">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="min-w-[280px]">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className={cn("py-12", className)}>
      <div className="flex items-center justify-between mb-8 px-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-[#303841]">{heading}</h2>
        <div className="flex gap-2">
           <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400 opacity-50 cursor-not-allowed">←</div>
           <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-[#303841] hover:bg-[#f6c90e] hover:border-transparent transition-all cursor-pointer">→</div>
        </div>
      </div>
      
      <div className="flex gap-6 overflow-x-auto px-6 pb-6 no-scrollbar snap-x">
        {products.map((product) => (
          <div key={product.id} className="min-w-[280px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
