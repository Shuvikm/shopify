/**
 * Premium GSAP-animated Add-to-Cart button.
 *
 * Uses useFetcher to POST to /cart so Remix auto-revalidates all loaders
 * (including root) after the action completes — CartProvider gets fresh data.
 */
import {useFetcher} from '@remix-run/react';
import {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import {useCart} from '~/hooks/useCart';
import {cn} from '~/lib/utils';
import gsap from 'gsap';

const CIRCLE_PX = 46;

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
  const {openCart} = useCart();
  const fetcher = useFetcher<{ok: boolean; error?: string}>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const timerRef = useRef<number | null>(null);

  const collapse = useCallback(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {width: CIRCLE_PX, borderRadius: CIRCLE_PX, duration: 0.8, ease: 'power4.inOut'});
  }, []);

  const expand = useCallback(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {width: '100%', borderRadius: CIRCLE_PX, duration: 0.8, ease: 'power4.inOut'});
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // React to fetcher state transitions
  useEffect(() => {
    if (fetcher.state === 'submitting' && phase === 'idle') {
      setPhase('loading');
      collapse();
    }

    if (fetcher.state === 'idle' && phase === 'loading') {
      if (fetcher.data?.ok === false) {
        expand();
        setPhase('error');
        timerRef.current = window.setTimeout(() => setPhase('idle'), 2500);
      } else if (fetcher.data?.ok === true) {
        setPhase('success');
        timerRef.current = window.setTimeout(() => {
          openCart();
          expand();
          timerRef.current = window.setTimeout(() => setPhase('idle'), 850);
        }, 900);
      }
    }
  }, [fetcher.state, fetcher.data, phase, collapse, expand, openCart]);

  function handleClick() {
    if (phase !== 'idle' || !variantId || disabled) return;
    const form = new FormData();
    form.append('cartAction', 'ADD_TO_CART');
    form.append('variantId', variantId);
    form.append('quantity', String(quantity));
    fetcher.submit(form, {method: 'POST', action: '/cart'});
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={disabled || phase !== 'idle' || !variantId}
      aria-label={phase === 'success' ? 'Added to cart' : 'Add to cart'}
      className={cn(
        'relative h-[46px] overflow-hidden',
        'flex items-center justify-center',
        'font-black text-[13px] uppercase tracking-[0.12em]',
        'rounded-[100px]',
        'shadow-[0_3px_6px_rgba(0,0,0,0.20)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.18)]',
        'transition-[box-shadow,background-color] duration-200',
        'select-none whitespace-nowrap cursor-pointer',
        'disabled:cursor-not-allowed',
        phase === 'error' ? 'bg-red-500 text-white' : 'bg-[#f6c90e] text-[#303841]',
        disabled && 'opacity-40',
        className,
      )}
      style={{width: '100%', padding: '0 20px'}}
    >
      <span className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-150', phase !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100')}>
        {children ?? 'ADD TO CART'}
      </span>
      <span className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-150', phase === 'loading' ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
        <SpinnerIcon />
      </span>
      <span className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-150', phase === 'success' ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
        <CheckIcon />
      </span>
      <span className={cn('absolute inset-0 flex items-center justify-center transition-opacity duration-150 text-[11px] font-black', phase === 'error' ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
        Try again
      </span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-[#303841]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="w-5 h-5 animate-spin text-[#303841]" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
