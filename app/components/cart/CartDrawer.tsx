/**
 * @file CartDrawer.tsx
 * @description Slide-in cart drawer using Headless UI Dialog.
 */
import {Dialog, Transition} from '@headlessui/react';
import {Link, useFetcher} from '@remix-run/react';
import {Fragment, useEffect} from 'react';
import {useCart} from '~/hooks/useCart';
import {formatMoney} from '~/lib/utils';
import {CartLineItem} from './CartLineItem';
import {CartSummary} from './CartSummary';
import {FreeShippingBar} from './FreeShippingBar';
import {FALLBACK_PRODUCT_IMAGE} from '~/lib/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({isOpen, onClose}: CartDrawerProps) {
  const cartCtx = useCart();
  const lines = (cartCtx as any);
  const totalQuantity = lines.totalQuantity as number | undefined;
  const checkoutUrl = lines.checkoutUrl as string | undefined;
  const cartLines: any[] = (lines.lines?.nodes as any[]) ?? [];
  const cost = lines.cost as any;
  const subtotal = cost?.subtotalAmount;

  const fetcher = useFetcher<{products: any[]}>();
  const firstProductId = cartLines[0]?.merchandise?.product?.id;

  useEffect(() => {
    // Only load recommendations if the drawer is open, we have a product to base them on,
    // and we haven't already loaded them for this specific product.
    if (isOpen && firstProductId && fetcher.state === 'idle' && !fetcher.data) {
      const rawId = firstProductId.split('/').pop();
      fetcher.load(`/api/recommendations?productId=${encodeURIComponent(rawId)}`);
    }
  }, [isOpen, firstProductId, fetcher.state, fetcher.data]);

  const recommendations = fetcher.data?.products ?? [];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Dialog.Panel
            className="fixed inset-y-0 right-0 flex flex-col bg-white shadow-drawer overflow-hidden"
            style={{width: 'min(340px, 100vw)'}}
          >
            {/* Yellow Wave Background effect */}
            <div className="absolute top-[-20%] left-[-50%] w-[300px] h-[300px] bg-[#f6c90e] rounded-full z-0 opacity-20" />
            
            <div className="relative z-10 flex flex-col h-full px-7">
              <div className="app-bar py-4">
                <img className="w-12" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1315882/pngwave.png" alt="Logo" />
              </div>
              
              <h2 className="text-2xl font-black text-[#303841] my-5">Your cart</h2>

              {cartLines.length === 0 ? (
                <div className="no-content">
                  <p className="text-sm text-[#303841]">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto scrollbar-none pb-6">
                    <div className="space-y-0">
                      {cartLines.map((line) => (
                        <CartLineItem key={line.id} line={line} />
                      ))}
                    </div>

                    <div className="pt-8 mt-8 border-t border-neutral-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                        You might also like
                      </p>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                        {fetcher.state === 'loading' ? (
                          [1, 2].map((i) => (
                            <div key={i} className="min-w-[120px] bg-neutral-50 rounded-2xl aspect-square animate-pulse" />
                          ))
                        ) : recommendations.length > 0 ? (
                          recommendations.map((product) => (
                            <Link key={product.id} to={`/products/${product.handle}`} onClick={onClose} className="min-w-[120px] group block">
                              <div className="aspect-square bg-neutral-100 rounded-2xl mb-2 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[#f6c90e] opacity-0 group-hover:opacity-10 transition-opacity" />
                                {product.featuredImage && (
                                  <img
                                    src={product.featuredImage.url}
                                    alt={product.title}
                                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                                  />
                                )}
                              </div>
                              <p className="text-[10px] font-black text-[#303841] line-clamp-1 uppercase tracking-tighter">{product.title}</p>
                            </Link>
                          ))
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="py-6 border-t border-neutral-100">
                    <CartSummary cost={cost} checkoutUrl={checkoutUrl ?? '/cart'} />
                  </div>
                </div>
              )}
            </div>
          </Dialog.Panel>

        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function EmptyCart({onClose}: {onClose: () => void}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
        <CartEmptyIcon />
      </div>
      <div>
        <p className="text-lg font-semibold text-neutral-800 mb-1">Your cart is empty</p>
        <p className="text-sm text-neutral-500">Looks like you haven't added anything yet.</p>
      </div>
      <Link
        to="/collections/all"
        onClick={onClose}
        className="btn btn-primary btn-lg"
      >
        Start Shopping
      </Link>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function CartEmptyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
