/**
 * @file useCart.ts
 * @description Client-side cart state hook.
 *
 * Wraps Hydrogen React's `useCart` with a global drawer open/close toggle.
 * Import this in components — never import `cart.server.ts` on the client.
 */
import {useCart as useHydrogenCart} from '@shopify/hydrogen-react';
import {useCallback, useSyncExternalStore} from 'react';

// Global state for cart drawer visibility
let isOpenGlobal = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return isOpenGlobal;
}

function setIsOpen(value: boolean | ((prev: boolean) => boolean)) {
  const nextValue = typeof value === 'function' ? value(isOpenGlobal) : value;
  if (isOpenGlobal !== nextValue) {
    isOpenGlobal = nextValue;
    listeners.forEach((listener) => listener());
  }
}

interface UseCartReturn extends ReturnType<typeof useHydrogenCart> {
  /** Whether the cart drawer is currently visible. */
  isOpen: boolean;
  /** Open the cart drawer. */
  openCart: () => void;
  /** Close the cart drawer. */
  closeCart: () => void;
  /** Toggle the cart drawer. */
  toggleCart: () => void;
}

/**
 * Extends Hydrogen's `useCart` with global drawer visibility state.
 *
 * @example
 * const { totalQuantity, isOpen, openCart } = useCart();
 */
export function useCart(): UseCartReturn {
  const cart = useHydrogenCart();
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    ...cart,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  };
}
