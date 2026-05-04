/**
 * @file CartLineItem.tsx
 * @description Individual line item in the cart drawer.
 *
 * Features:
 * - Product image + title + variant label
 * - Inline quantity stepper (useFetcher POST → /cart UPDATE_CART)
 * - Remove button (useFetcher POST → /cart REMOVE_CART_LINE)
 * - Optimistic UI: updates quantity immediately without full-page reload
 */
import {useFetcher} from '@remix-run/react';
import {formatMoney} from '~/lib/utils';
import type {CartLine} from '~/graphql/CartMutations';
import {useWishlist} from '~/hooks/useWishlist';
import {FALLBACK_PRODUCT_IMAGE} from '~/lib/products';

interface CartLineItemProps {
  line: CartLine;
}

export function CartLineItem({line}: CartLineItemProps) {
  const updateFetcher = useFetcher();
  const removeFetcher = useFetcher();

  const {merchandise, quantity, cost} = line;
  const {isWishlisted, toggle} = useWishlist();
  const isUpdating = updateFetcher.state !== 'idle';
  const isRemoving = removeFetcher.state !== 'idle';

  const productId = merchandise.product.id;

  function handleSaveForLater() {
    if (!isWishlisted(productId)) {
      toggle(productId);
    }
    // Remove from cart
    const formData = new FormData();
    formData.append('cartAction', 'REMOVE_CART_LINE');
    formData.append('lineId', line.id);
    removeFetcher.submit(formData, {method: 'POST', action: '/cart'});
  }

  // Optimistic quantity while fetcher is in flight
  const optimisticQuantity =
    isUpdating && updateFetcher.formData
      ? Number(updateFetcher.formData.get('quantity'))
      : quantity;

  const displayTitle = merchandise.product.title;
  const displayImage = merchandise.image?.url ?? FALLBACK_PRODUCT_IMAGE;

  return (
    <div className={`flex gap-4 transition-opacity duration-200 ${isRemoving ? 'opacity-40' : ''}`}>
      {/* Image */}
      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-neutral-50 border border-neutral-100">
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayTitle ?? ''}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
            }}
          />
        ) : (
          <div className="w-full h-full bg-neutral-100" />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <a
          href={`/products/${merchandise.product.handle}`}
          className="text-sm font-semibold text-neutral-800 hover:text-brand-600 line-clamp-2 transition-colors"
        >
          {displayTitle}
        </a>
        {/* Variant options */}
        <p className="text-xs text-neutral-500">
          {merchandise.selectedOptions
            .filter((o) => o.value !== 'Default Title')
            .map((o) => o.value)
            .join(' / ')}
        </p>

        <button
          onClick={handleSaveForLater}
          className="text-[10px] font-bold text-brand-600 hover:text-brand-700 underline uppercase tracking-tighter"
        >
          {isWishlisted(productId) ? 'Already in Wishlist' : 'Save for Later'}
        </button>

        {/* Price + controls */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-neutral-900">
            {formatMoney(cost.totalAmount)}
          </span>

          <div className="flex items-center gap-2">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-neutral-200 rounded-md text-xs overflow-hidden">
              <updateFetcher.Form method="POST" action="/cart">
                <input type="hidden" name="cartAction" value="UPDATE_CART" />
                <input type="hidden" name="lineId" value={line.id} />
                <input type="hidden" name="quantity" value={Math.max(1, optimisticQuantity - 1)} />
                <button
                  type="submit"
                  aria-label="Decrease quantity"
                  disabled={optimisticQuantity <= 1 || isUpdating}
                  className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                >
                  −
                </button>
              </updateFetcher.Form>

              <span className="w-7 text-center font-semibold text-neutral-800 select-none" aria-live="polite">
                {optimisticQuantity}
              </span>

              <updateFetcher.Form method="POST" action="/cart">
                <input type="hidden" name="cartAction" value="UPDATE_CART" />
                <input type="hidden" name="lineId" value={line.id} />
                <input type="hidden" name="quantity" value={optimisticQuantity + 1} />
                <button
                  type="submit"
                  aria-label="Increase quantity"
                  disabled={isUpdating}
                  className="w-7 h-7 flex items-center justify-center hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                >
                  +
                </button>
              </updateFetcher.Form>
            </div>

            {/* Remove */}
            <removeFetcher.Form method="POST" action="/cart">
              <input type="hidden" name="cartAction" value="REMOVE_CART_LINE" />
              <input type="hidden" name="lineId" value={line.id} />
              <button
                type="submit"
                aria-label={`Remove ${merchandise.product.title} from cart`}
                disabled={isRemoving}
                className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
              >
                <TrashIcon />
              </button>
            </removeFetcher.Form>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}
