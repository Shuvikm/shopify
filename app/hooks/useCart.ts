/**
 * @file useCart.ts
 * @description Client-side cart state hook.
 *
 * Wraps Hydrogen React's `useCart` with a drawer open/close toggle.
 * Import this in components — never import `cart.server.ts` on the client.
 */
import {useCart as useHydrogenCart} from '@shopify/hydrogen-react';
import {useCallback, useState} from 'react';

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
 * Extends Hydrogen's `useCart` with drawer visibility state.
 *
 * @example
 * const { totalQuantity, isOpen, openCart } = useCart();
 */
export function useCart(): UseCartReturn {
  const cart = useHydrogenCart();
  const [isOpen, setIsOpen] = useState(false);

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
