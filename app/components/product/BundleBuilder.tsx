/**
 * @file BundleBuilder.tsx
 * @description "Build Your Own Bundle" feature.
 * Users pick 3 items to get a 20% discount.
 */
import {useState} from 'react';
import {formatMoney} from '~/lib/utils';
import {QuickAddButton} from './QuickAddButton';

export function BundleBuilder({products}: {products: any[]}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isComplete = selectedIds.length === 3;
  const subtotal = selectedIds.reduce((acc, id) => {
    const p = products.find(p => p.id === id);
    return acc + parseFloat(p?.variants.nodes[0].price.amount ?? '0');
  }, 0);

  const discount = subtotal * 0.2;
  const total = subtotal - discount;

  return (
    <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 my-24 overflow-hidden relative">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] -mr-32 -mt-32" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-xl">
            <span className="inline-block badge bg-brand-500 text-white mb-4 text-[10px] uppercase tracking-[0.2em] px-3 py-1">
              Bundle & Save
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
              BUILD YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">
                ULTIMATE KIT.
              </span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Pick any 3 items and get <span className="text-white font-bold">20% OFF</span> automatically.
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[240px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Your Bundle</span>
              <span className="text-xs font-black text-brand-400">{selectedIds.length}/3</span>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Subtotal</span>
                <span>{formatMoney({amount: subtotal.toString(), currencyCode: 'USD'})}</span>
              </div>
              <div className="flex justify-between text-sm text-green-400 font-bold">
                <span>Discount (20%)</span>
                <span>-{formatMoney({amount: discount.toString(), currencyCode: 'USD'})}</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-2 border-t border-white/10">
                <span>Total</span>
                <span>{formatMoney({amount: total.toString(), currencyCode: 'USD'})}</span>
              </div>
            </div>
            <button
              disabled={!isComplete}
              className="w-full btn btn-primary !h-14 disabled:opacity-30 disabled:grayscale transition-all"
              onClick={() => alert('Bundle added to cart! (Demo logic: in production this would trigger multiple cart additions)')}
            >
              {isComplete ? 'Add Bundle to Cart' : `Select ${3 - selectedIds.length} more`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const variant = product.variants.nodes[0];
            
            return (
              <div 
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`group relative cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-95' : 'hover:scale-[1.02]'
                }`}
              >
                <div className={`aspect-square rounded-2xl overflow-hidden border-2 transition-colors ${
                  isSelected ? 'border-brand-500 shadow-[0_0_20px_rgba(79,99,248,0.3)]' : 'border-transparent bg-white/5'
                }`}>
                  <img 
                    src={product.featuredImage?.url} 
                    alt={product.title}
                    className={`w-full h-full object-cover transition-opacity ${isSelected ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                  />
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckIcon />
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-neutral-400 truncate">{product.title}</p>
                  <p className="text-sm font-black">{formatMoney(variant.price)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}
