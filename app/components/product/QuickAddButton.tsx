import {useFetcher} from '@remix-run/react';
import {useEffect, useRef, useState, type ReactNode} from 'react';
import {useCart} from '~/hooks/useCart';
import {cn} from '~/lib/utils';
import gsap from 'gsap';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [inCart, setInCart] = useState(false);

  const isLoading = fetcher.state === 'submitting' || fetcher.state === 'loading';

  useEffect(() => {
    if (buttonRef.current) {
      if (isLoading || inCart) {
        gsap.to(buttonRef.current, {
          width: 56,
          borderRadius: 100,
          duration: 0.6,
          ease: 'power4.inOut',
        });
      } else {
        gsap.to(buttonRef.current, {
          width: '100%',
          borderRadius: 16,
          duration: 0.6,
          ease: 'power4.inOut',
        });
      }
    }
  }, [isLoading, inCart]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      setInCart(true);
      const timer = setTimeout(() => {
        openCart();
        setInCart(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [fetcher.state, fetcher.data, openCart]);

  return (
    <fetcher.Form method="POST" action="/cart" className="w-full flex justify-center">
      <input type="hidden" name="cartAction" value="ADD_TO_CART" />
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value={quantity} />

      <button
        ref={buttonRef}
        type="submit"
        disabled={disabled || isLoading || inCart || !variantId}
        className={cn(
          'h-14 font-black text-[11px] uppercase tracking-[0.2em] relative overflow-hidden transition-colors flex items-center justify-center',
          inCart ? 'bg-green-500 text-white' : 'bg-[#f6c90e] text-black hover:bg-[#f6c90e]/90',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        style={{ width: '100%', borderRadius: 16 }}
      >
        {inCart ? (
          <CheckIcon />
        ) : isLoading ? (
          <LoadingSpinner />
        ) : (
          <span className="whitespace-nowrap px-4">
            {children ?? 'ADD TO CART'}
          </span>
        )}
      </button>
    </fetcher.Form>
  );
}


function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
