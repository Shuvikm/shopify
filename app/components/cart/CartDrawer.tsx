/**
 * @file CartDrawer.tsx
 * @description Slide-in cart drawer with liked-item aware recommendations.
 * When items are liked (hearted), a "Because you liked…" section replaces the
 * generic "You might also like" row and seeds the recommendation API with the
 * liked product IDs for a tighter signal.
 */
import {Dialog, Transition} from '@headlessui/react';
import {Link, useFetcher} from '@remix-run/react';
import {Fragment, useEffect, useMemo} from 'react';
import {useCart} from '~/hooks/useCart';
import {useWishlist} from '~/hooks/useWishlist';
import {formatMoney} from '~/lib/utils';
import {CartLineItem} from './CartLineItem';
import {CartSummary} from './CartSummary';
import {FreeShippingBar} from './FreeShippingBar';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({isOpen, onClose}: CartDrawerProps) {
  const cartCtx = useCart() as any;
  const totalQuantity: number = cartCtx.totalQuantity ?? 0;
  const checkoutUrl: string = cartCtx.checkoutUrl ?? '/cart';
  const cartLines: any[] = cartCtx.lines?.nodes ?? [];
  const cost = cartCtx.cost;

  const {isWishlisted} = useWishlist();

  // Separate liked vs un-liked lines so we can route recommendations correctly
  const likedLines = useMemo(
    () => cartLines.filter((l) => isWishlisted(l.merchandise?.product?.id)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartLines, isWishlisted],
  );

  const hasLikedItems = likedLines.length > 0;

  // Build recommendation URL — seed with liked IDs first, fall back to first cart item
  const recParams = useMemo(() => {
    const params = new URLSearchParams();
    const primaryLine = likedLines[0] ?? cartLines[0];
    if (!primaryLine) return null;

    const toRawId = (gid: string) => (gid?.includes('/') ? gid.split('/').pop()! : gid);
    params.set('productId', toRawId(primaryLine.merchandise?.product?.id ?? ''));

    // Pass extra liked IDs so the algorithm can diversify
    likedLines.slice(1).forEach((l) => {
      params.append('likedId', toRawId(l.merchandise?.product?.id ?? ''));
    });

    if (hasLikedItems && cartLines.length > likedLines.length) {
      // Also include first non-liked cart item as a diversity signal
      const nonLiked = cartLines.find((l) => !isWishlisted(l.merchandise?.product?.id));
      if (nonLiked) params.append('likedId', toRawId(nonLiked.merchandise?.product?.id ?? ''));
    }

    return params.toString();
  }, [likedLines, cartLines, hasLikedItems, isWishlisted]);

  const fetcher = useFetcher<{products: any[]; source?: string}>();

  useEffect(() => {
    if (isOpen && recParams && fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load(`/api/recommendations?${recParams}`);
    }
  }, [isOpen, recParams, fetcher]);

  // Re-fetch when liked items change so recommendations update live
  const likedKey = likedLines.map((l) => l.id).join(',');
  useEffect(() => {
    if (isOpen && recParams && fetcher.state === 'idle') {
      fetcher.load(`/api/recommendations?${recParams}`);
    }
    // only re-run when the set of liked items changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedKey]);

  const recommendations: any[] = fetcher.data?.products ?? [];
  const recLoading = fetcher.state === 'loading';

  // Label for the liked item used as the primary seed
  const likedProductName = likedLines[0]?.merchandise?.product?.title ?? null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0"
          leave="ease-in duration-200" leaveFrom="translate-x-0" leaveTo="translate-x-full"
        >
          <Dialog.Panel
            className="fixed inset-y-0 right-0 flex flex-col bg-white shadow-2xl overflow-hidden"
            style={{width: 'min(400px, 100vw)'}}
          >
            {/* Decorative blob */}
            <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 bg-[#f6c90e] rounded-full opacity-10 blur-3xl" />

            <div className="relative flex flex-col h-full">
              {/* ── Header ────────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
                <Dialog.Title className="text-lg font-black text-neutral-900 flex items-center gap-2">
                  Your Cart
                  {totalQuantity > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                      {totalQuantity}
                    </span>
                  )}
                </Dialog.Title>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
                  aria-label="Close cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* ── Body ──────────────────────────────────────────────── */}
              {cartLines.length === 0 ? (
                <EmptyCart onClose={onClose} />
              ) : (
                <>
                  <FreeShippingBar subtotal={cost?.subtotalAmount} />

                  <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-2">
                    {/* Cart lines */}
                    <div className="divide-y divide-neutral-100">
                      {cartLines.map((line) => (
                        <div key={line.id} className="py-4">
                          <CartLineItem line={line} />
                        </div>
                      ))}
                    </div>

                    {/* ── Liked items callout ──────────────────────────── */}
                    {hasLikedItems && (
                      <div className="mt-4 mb-2 px-3 py-2.5 bg-rose-50 rounded-xl flex items-center gap-2 border border-rose-100">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-rose-500 stroke-rose-500 shrink-0" strokeWidth="1.5">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <p className="text-[11px] font-bold text-rose-700 leading-snug">
                          {likedLines.length === 1
                            ? `You liked "${likedLines[0].merchandise.product.title}" — see more below`
                            : `You liked ${likedLines.length} items — see related picks below`}
                        </p>
                      </div>
                    )}

                    {/* ── Recommendations ─────────────────────────────── */}
                    <div className="mt-5 mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                        {hasLikedItems && likedProductName
                          ? `Because you liked "${likedProductName.split(' ').slice(0, 3).join(' ')}…"`
                          : 'You might also like'}
                      </p>

                      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
                        {recLoading
                          ? [1, 2, 3].map((i) => (
                              <div key={i} className="shrink-0 w-[110px]">
                                <div className="aspect-square rounded-xl bg-neutral-100 animate-pulse mb-1.5" />
                                <div className="h-2.5 w-3/4 bg-neutral-100 rounded animate-pulse mb-1" />
                                <div className="h-2.5 w-1/2 bg-neutral-100 rounded animate-pulse" />
                              </div>
                            ))
                          : recommendations.length > 0
                          ? recommendations.slice(0, 6).map((product) => {
                              const variant = product.variants?.nodes?.[0];
                              return (
                                <Link
                                  key={product.id}
                                  to={`/products/${product.handle}`}
                                  onClick={onClose}
                                  className="shrink-0 w-[110px] group block"
                                  prefetch="intent"
                                >
                                  {/* Image */}
                                  <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-1.5 relative">
                                    {product.featuredImage ? (
                                      <img
                                        src={product.featuredImage.url}
                                        alt={product.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-neutral-200" />
                                    )}
                                    {/* Liked badge if this recommendation is also in wishlist */}
                                    {isWishlisted(product.id) && (
                                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white" strokeWidth="0">
                                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] font-bold text-neutral-800 line-clamp-2 leading-tight mb-0.5">
                                    {product.title}
                                  </p>
                                  {variant && (
                                    <p className="text-[10px] font-black text-rose-500">
                                      {formatMoney(variant.price)}
                                    </p>
                                  )}
                                </Link>
                              );
                            })
                          : (
                              <p className="text-[11px] text-neutral-400 py-2">
                                Continue shopping to see recommendations.
                              </p>
                            )}
                      </div>
                    </div>
                  </div>

                  {/* ── Footer / Summary ──────────────────────────────── */}
                  <div className="shrink-0 border-t border-neutral-100 px-6 py-4">
                    <CartSummary cost={cost} checkoutUrl={checkoutUrl} />
                  </div>
                </>
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
      <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center">
        <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-bold text-neutral-800 mb-1">Your cart is empty</p>
        <p className="text-sm text-neutral-500">Add items you love and like them to see recommendations.</p>
      </div>
      <Link to="/collections/all" onClick={onClose} className="btn btn-primary btn-lg">
        Start Shopping
      </Link>
    </div>
  );
}
