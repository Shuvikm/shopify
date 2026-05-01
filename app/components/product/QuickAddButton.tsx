/**
 * @file QuickAddButton.tsx
 * @description AJAX "Add to Cart" button with GSAP animation.
 */
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
    if (isLoading && buttonRef.current) {
      // Shrink button to circle on submit
      gsap.to(buttonRef.current, {
        width: 56,
        duration: 0.4,
        ease: 'power4.out',
      });
    }
  }, [isLoading]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok && buttonRef.current) {
      setInCart(true);
      
      // Keep it shrunk and show success
      const tl = gsap.timeline();
      tl.to(buttonRef.current, {
        backgroundColor: '#f6c90e', // Yellow like the template
        color: '#303841',
        duration: 0.2,
      })
      .to(buttonRef.current, {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });

      // Auto open cart and reset button after 1s
      const timer = setTimeout(() => {
        openCart();
        gsap.to(buttonRef.current, {
          width: '100%',
          backgroundColor: '', // Restore original
          color: '',
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => setInCart(false)
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [fetcher.state, fetcher.data, openCart]);

  return (
    <fetcher.Form method="POST" action="/cart" className="w-full">
      <input type="hidden" name="cartAction" value="ADD_TO_CART" />
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value={quantity} />

      <div className="flex justify-center">
        <button
          ref={buttonRef}
          type="submit"
          disabled={disabled || isLoading || inCart || !variantId}
          className={cn(
            'btn btn-primary relative overflow-hidden transition-colors',
            (isLoading || inCart) && 'rounded-full px-0',
            className,
          )}
        >
          {/* Success Checkmark */}
          {inCart ? (
            <span className="flex items-center justify-center w-full h-full">
              <CheckIcon />
            </span>
          ) : (
            <>
              {/* Shimmer loading overlay */}
              {isLoading && (
                <span className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
              <span className={cn('transition-opacity duration-300', isLoading && 'opacity-0')}>
                {children ?? 'Add to Cart'}
              </span>
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner />
                </span>
              )}
            </>
          )}
        </button>
      </div>
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
