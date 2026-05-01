/**
 * @file hooks/useWishlist.ts
 * @description localStorage-backed wishlist hook.
 */
import {useState, useEffect, useCallback} from 'react';

const KEY = 'hs-wishlist';

export function useWishlist() {
  const [ids, setIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids));
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  }, []);

  const isWishlisted = useCallback((id: string) => ids.includes(id), [ids]);

  return {ids, toggle, isWishlisted};
}
