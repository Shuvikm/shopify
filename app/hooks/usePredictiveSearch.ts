/**
 * @file usePredictiveSearch.ts
 * @description Debounced predictive search hook using Remix's `useFetcher`.
 *
 * Makes a GET request to `/api/predictive-search?q=<query>` after a
 * configurable delay. Returns typed results and loading state.
 *
 * @example
 * const { query, setQuery, results, isLoading } = usePredictiveSearch();
 */
import {useFetcher} from '@remix-run/react';
import {useEffect, useRef, useState} from 'react';
import type {PredictiveSearchResult} from '~/graphql/PredictiveSearchQuery';

interface UsePredictiveSearchOptions {
  /** Debounce delay in ms. Default: 300 */
  debounceMs?: number;
}

interface UsePredictiveSearchReturn {
  /** Current query string. */
  query: string;
  /** Update the query (triggers debounced fetch). */
  setQuery: (value: string) => void;
  /** Typed search results, or null if no query. */
  results: PredictiveSearchResult | null;
  /** True while a fetch is in progress. */
  isLoading: boolean;
  /** Clear the query and results. */
  clear: () => void;
}

export function usePredictiveSearch(
  options: UsePredictiveSearchOptions = {},
): UsePredictiveSearchReturn {
  const {debounceMs = 300} = options;

  const fetcher = useFetcher<{result: PredictiveSearchResult}>();
  const [query, setQueryState] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Update state and schedule a debounced API call. */
  function setQuery(value: string) {
    setQueryState(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim()) return;

    timerRef.current = setTimeout(() => {
      fetcher.load(`/api/predictive-search?q=${encodeURIComponent(value)}`);
    }, debounceMs);
  }

  function clear() {
    setQueryState('');
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const results: PredictiveSearchResult | null =
    query.trim() && fetcher.data ? fetcher.data.result : null;

  const isLoading =
    fetcher.state === 'loading' || fetcher.state === 'submitting';

  return {query, setQuery, results, isLoading, clear};
}
