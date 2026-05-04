import {useFetcher} from '@remix-run/react';
import {formatMoney} from '~/lib/utils';
import type {CartLine} from '~/graphql/CartMutations';
import {FALLBACK_PRODUCT_IMAGE} from '~/lib/products';
import {LikeButton} from '~/components/product/LikeButton';

interface CartLineItemProps {
  line: CartLine;
}

export function CartLineItem({line}: CartLineItemProps) {
  const updateFetcher = useFetcher();
  const removeFetcher = useFetcher();

  const {merchandise, quantity, cost} = line;
  const isUpdating = updateFetcher.state !== 'idle';
  const isRemoving = removeFetcher.state !== 'idle';

  const productId = merchandise.product.id;

  // Optimistic quantity while fetcher is in flight
  const optimisticQuantity =
    isUpdating && updateFetcher.formData
      ? Number(updateFetcher.formData.get('quantity'))
      : quantity;

  const displayTitle = merchandise.product.title;
  const displayImage = merchandise.image?.url ?? FALLBACK_PRODUCT_IMAGE;

  return (
    <div className={`flex items-center gap-6 py-6 border-b border-neutral-100 transition-opacity duration-200 ${isRemoving ? 'opacity-40' : ''}`}>
      {/* Image Area with yellow background on hover, like the Vue snippet */}
      <div className="w-24 h-24 shrink-0 rounded-[2rem] overflow-hidden bg-[#eee] relative group">
        <div className="absolute inset-0 bg-[#f6c90e] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={displayImage}
          alt={displayTitle ?? ''}
          className="relative z-10 w-full h-full object-contain p-2 transform rotate-[-12deg] group-hover:rotate-[-24deg] group-hover:scale-110 transition-transform duration-500"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <a
            href={`/products/${merchandise.product.handle}`}
            className="text-sm font-black text-[#303841] hover:text-[#f6c90e] line-clamp-2 transition-colors uppercase tracking-tight"
          >
            {displayTitle}
          </a>
          <LikeButton productId={productId} className="ml-4" />
        </div>
        
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
          {merchandise.selectedOptions
            .filter((o) => o.value !== 'Default Title')
            .map((o) => o.value)
            .join(' / ')}
        </p>

        {/* Price + controls */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-[#303841]">
            {formatMoney(cost.totalAmount)}
          </span>

          <div className="flex items-center gap-4 bg-neutral-50 px-3 py-1 rounded-full">
            <div className="flex items-center gap-3">
              <updateFetcher.Form method="POST" action="/cart">
                <input type="hidden" name="cartAction" value="UPDATE_CART" />
                <input type="hidden" name="lineId" value={line.id} />
                <input type="hidden" name="quantity" value={Math.max(1, optimisticQuantity - 1)} />
                <button
                  type="submit"
                  disabled={optimisticQuantity <= 1 || isUpdating}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-[#f6c90e] hover:text-white transition-all disabled:opacity-40 font-bold"
                >
                  −
                </button>
              </updateFetcher.Form>

              <span className="w-6 text-center text-sm font-black text-[#303841] select-none">
                {optimisticQuantity}
              </span>

              <updateFetcher.Form method="POST" action="/cart">
                <input type="hidden" name="cartAction" value="UPDATE_CART" />
                <input type="hidden" name="lineId" value={line.id} />
                <input type="hidden" name="quantity" value={optimisticQuantity + 1} />
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-[#f6c90e] hover:text-white transition-all disabled:opacity-40 font-bold"
                >
                  +
                </button>
              </updateFetcher.Form>
            </div>

            <div className="w-[1px] h-4 bg-neutral-200" />

            <removeFetcher.Form method="POST" action="/cart">
              <input type="hidden" name="cartAction" value="REMOVE_CART_LINE" />
              <input type="hidden" name="lineId" value={line.id} />
              <button
                type="submit"
                disabled={isRemoving}
                className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50"
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
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
