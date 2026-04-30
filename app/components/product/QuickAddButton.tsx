/**
 * @file QuickAddButton.tsx
 * @description AJAX "Add to Cart" button using Remix's `useFetcher`.
 *
 * How it works:
 * 1. Submits a POST to `/cart` (the cart Remix action) with `variantId` + `quantity`.
 * 2. The server-side action calls `addToCart()` and returns the updated cart.
 * 3. While the fetch is in-flight, shows an optimistic loading state.
 * 4. On success, opens the cart drawer.
 *
 * This component is reused on:
 * - PDP (inside `ProductForm`)
 * - Product cards (hover Quick-Add)
 */
import {useFetcher} from '@remix-run/react';
import {useEffect, type ReactNode} from 'react';
import {useCart} from '~/hooks/useCart';
import {cn} from '~/lib/utils';

interface QuickAddButtonProps {
  variantId: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function QuickAddButton({
  variantId,
  quantity = 1,
  disabled = false,
  className,
  children,
}: QuickAddButtonProps) {
  const fetcher = useFetcher<{ok: boolean}>();
  const {openCart} = useCart();

  const isLoading =
    fetcher.state === 'submitting' || fetcher.state === 'loading';

  // Open the cart drawer once the item has been added
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      openCart();
    }
  }, [fetcher.state, fetcher.data, openCart]);

  return (
    <fetcher.Form method="POST" action="/cart">
      {/* Hidden fields — the cart action reads these */}
      <input type="hidden" name="cartAction" value="ADD_TO_CART" />
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value={quantity} />

      <button
        type="submit"
        id={`quick-add-${variantId}`}
        disabled={disabled || isLoading || !variantId}
        aria-label={isLoading ? 'Adding to cart…' : 'Add to cart'}
        aria-busy={isLoading}
        className={cn(
          'btn btn-primary relative overflow-hidden',
          isLoading && 'cursor-wait',
          className,
        )}
      >
        {/* Shimmer loading overlay */}
        {isLoading && (
          <span
            className="absolute inset-0 bg-white/20 animate-pulse"
            aria-hidden="true"
          />
        )}
        <span className={cn('transition-opacity', isLoading && 'opacity-0')}>
          {children ?? 'Add to Cart'}
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm">
            <LoadingSpinner />
            Adding…
          </span>
        )}
      </button>
    </fetcher.Form>
  );
}

function LoadingSpinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
