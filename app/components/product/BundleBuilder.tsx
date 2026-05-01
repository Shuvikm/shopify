/**
 * @file BundleBuilder.tsx
 * @description Advanced "Build Your Own Bundle" with high-end animations.
 */
import {useState, useEffect, useRef} from 'react';
import {formatMoney} from '~/lib/utils';
import {QuickAddButton} from './QuickAddButton';
import gsap from 'gsap';

export function BundleBuilder({products}: {products: any[]}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const waveRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (waveRef.current) {
      gsap.to(waveRef.current, {
        skewY: '4deg',
        duration: 8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

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
    <div className="relative overflow-hidden min-h-[800px] flex items-center justify-center py-24 px-6 rounded-[3rem] my-12 bg-white">
      {/* Background Animated Wave - Matching User's Template */}
      <div 
        ref={waveRef}
        className="absolute inset-0 bg-[#f6c90e] -z-10 origin-center scale-[3] skew-y-[-8deg] translate-y-[20%]"
      />

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-start relative z-10">
        {/* Left: Product Picker */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_80px_80px_rgba(0,0,0,0.07)] h-[650px] overflow-y-auto scrollbar-none relative">
          <div className="sticky top-0 bg-white/80 backdrop-blur-md py-4 mb-8 z-20 flex justify-between items-center border-b border-neutral-100">
            <h2 className="text-2xl font-black text-[#303841]">Pick Items</h2>
            <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png" className="w-10" alt="logo" />
          </div>

          <div className="grid grid-cols-1 gap-12">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              const variant = product.variants.nodes[0];
              
              return (
                <div key={product.id} className="group">
                  <div 
                    className="rounded-[2rem] h-[380px] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                    style={{backgroundColor: isSelected ? '#f6c90e' : '#f3f4f6'}}
                  >
                    <img 
                      src={product.featuredImage?.url} 
                      alt={product.title}
                      className="w-4/5 drop-shadow-[0_30px_20px_rgba(0,0,0,0.2)] rotate-[-24deg] -ml-4 transition-transform duration-500 group-hover:rotate-[-12deg]"
                    />
                  </div>
                  <h3 className="text-xl font-black text-[#303841] mt-6 leading-tight">{product.title}</h3>
                  <p className="text-sm text-neutral-400 mt-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-lg font-black text-[#303841]">{formatMoney(variant.price)}</span>
                    <button 
                      onClick={() => toggleProduct(product.id)}
                      className={`btn !rounded-full !px-8 !h-12 !text-xs font-black transition-all ${
                        isSelected 
                          ? 'bg-[#303841] text-white' 
                          : 'bg-[#f6c90e] text-[#303841] shadow-lg hover:brightness-110'
                      }`}
                    >
                      {isSelected ? 'SELECTED' : 'ADD TO BUNDLE'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Cart/Summary */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_80px_80px_rgba(0,0,0,0.07)] h-[650px] flex flex-col relative overflow-hidden">
          <div className="sticky top-0 bg-white/80 backdrop-blur-md py-4 mb-8 z-20 flex justify-between items-center border-b border-neutral-100">
            <h2 className="text-2xl font-black text-[#303841]">Your Bundle</h2>
            <span className="bg-[#f6c90e] text-[#303841] px-3 py-1 rounded-full text-xs font-black">
              {selectedIds.length}/3
            </span>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-none space-y-8">
            {selectedIds.length === 0 ? (
              <p className="text-neutral-400 text-sm italic">Your bundle is empty.</p>
            ) : (
              selectedIds.map(id => {
                const p = products.find(i => i.id === id);
                return (
                  <div key={id} className="flex gap-6 animate-fadeIn">
                    <div className="w-24 h-24 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
                      <img src={p.featuredImage?.url} className="w-[120%] rotate-[-28deg] -translate-y-4 drop-shadow-xl" alt="" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#303841]">{p.title}</h4>
                      <p className="text-lg font-black text-[#303841] mt-1">{formatMoney(p.variants.nodes[0].price)}</p>
                      <button 
                        onClick={() => toggleProduct(id)}
                        className="text-[10px] font-black uppercase text-red-500 mt-2 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-8 border-t border-neutral-100 mt-8 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Subtotal</span>
              <span className="font-bold">{formatMoney({amount: subtotal.toString(), currencyCode: 'USD'})}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600 font-bold">
              <span>Bundle Discount (20%)</span>
              <span>-{formatMoney({amount: discount.toString(), currencyCode: 'USD'})}</span>
            </div>
            <div className="flex justify-between text-2xl font-black text-[#303841] pt-2">
              <span>Total</span>
              <span>{formatMoney({amount: total.toString(), currencyCode: 'USD'})}</span>
            </div>
            <button
              disabled={!isComplete}
              className="w-full btn bg-[#303841] text-white !h-16 !rounded-2xl font-black mt-4 disabled:opacity-20 transition-all shadow-xl"
            >
              {isComplete ? 'ADD BUNDLE TO CART' : `SELECT ${3 - selectedIds.length} MORE`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
