/**
 * @file CartDrawer.tsx
 * @description Slide-in cart drawer using Headless UI Dialog.
 */
import {Dialog, Transition} from '@headlessui/react';
import {Link} from '@remix-run/react';
import {Fragment} from 'react';
import {useCart} from '~/hooks/useCart';
import {formatMoney} from '~/lib/utils';
import {CartLineItem} from './CartLineItem';
import {CartSummary} from './CartSummary';
import {FreeShippingBar} from './FreeShippingBar';

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
            className="fixed inset-y-0 right-0 flex flex-col bg-white shadow-drawer"
            style={{width: 'min(28rem, 100vw)'}}
          >
            <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100 shrink-0">
              <Dialog.Title className="font-semibold text-lg text-neutral-900 flex items-center gap-2">
                Cart
                {(totalQuantity ?? 0) > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Dialog.Title>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost w-8 h-8 p-0 rounded-full"
              >
                <CloseIcon />
              </button>
            </div>

            {cartLines.length === 0 ? (
              <EmptyCart onClose={onClose} />
            ) : (
              <>
                <FreeShippingBar subtotal={subtotal} />

                <ul className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
                  {cartLines.map((line) => (
                    <li key={line.id}>
                      <CartLineItem line={line} />
                    </li>
                  ))}

                  <div className="pt-8 mt-8 border-t border-neutral-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
                      You might also like
                    </p>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                      {[1, 2].map((i) => (
                        <div key={i} className="min-w-[140px] group cursor-pointer">
                          <div className="aspect-square bg-neutral-100 rounded-lg mb-2 overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-50 animate-pulse" />
                          </div>
                          <p className="text-[11px] font-bold text-neutral-800 line-clamp-1">Premium Essential</p>
                          <p className="text-[10px] text-brand-600 font-black">$45.00</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ul>

                <CartSummary cost={cost} checkoutUrl={checkoutUrl ?? '/cart'} />
              </>
            )}
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
