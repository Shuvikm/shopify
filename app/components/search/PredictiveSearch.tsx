/**
 * @file PredictiveSearch.tsx
 * @description Full-screen search overlay with predictive results.
 *
 * Architecture:
 * - Opens as a modal (Headless UI Dialog) over the page
 * - Uses `usePredictiveSearch` hook for 300 ms debounced fetches
 * - Shows products and collections in separate sections
 * - Keyboard: Escape closes, Enter navigates to /search?q=...
 */
import {Dialog, Transition} from '@headlessui/react';
import {useNavigate} from '@remix-run/react';
import {Fragment, useEffect, useRef} from 'react';
import {usePredictiveSearch} from '~/hooks/usePredictiveSearch';
import {SearchResults} from './SearchResults';

interface PredictiveSearchProps {
  onClose: () => void;
}

export function PredictiveSearch({onClose}: PredictiveSearchProps) {
  const navigate = useNavigate();
  const {query, setQuery, results, isLoading, clear} = usePredictiveSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when overlay opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    clear();
    onClose();
  }

  function handleClose() {
    clear();
    onClose();
  }

  return (
    <Transition show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Search Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 -translate-y-4"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div className="fixed inset-x-0 top-0 z-10">
            <Dialog.Panel className="bg-white shadow-2xl max-w-2xl mx-auto mt-4 rounded-2xl overflow-hidden">
              {/* Search Input */}
              <form onSubmit={handleSubmit} role="search" aria-label="Search products">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
                  <SearchIcon />
                  <input
                    ref={inputRef}
                    id="predictive-search-input"
                    type="search"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products, collections…"
                    autoComplete="off"
                    className="flex-1 text-base text-neutral-900 placeholder:text-neutral-400 bg-transparent outline-none"
                    aria-label="Search query"
                    aria-autocomplete="list"
                    aria-expanded={!!results}
                    aria-controls="predictive-search-results"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => {clear(); inputRef.current?.focus();}}
                      className="text-neutral-400 hover:text-neutral-700 transition-colors"
                      aria-label="Clear search"
                    >
                      <ClearIcon />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-neutral-400 hover:text-neutral-700 transition-colors text-sm font-medium"
                    aria-label="Close search"
                  >
                    Esc
                  </button>
                </div>
              </form>

              {/* Results */}
              <div
                id="predictive-search-results"
                role="listbox"
                aria-label="Search results"
                className="max-h-[60vh] overflow-y-auto scrollbar-thin"
              >
                {isLoading && (
                  <div className="flex items-center justify-center py-10 text-neutral-400 gap-2 text-sm">
                    <LoadingSpinner />
                    Searching…
                  </div>
                )}
                {!isLoading && results && (
                  <SearchResults
                    results={results}
                    query={query}
                    onItemClick={handleClose}
                  />
                )}
                {!isLoading && !results && !query && (
                  <div className="px-5 py-8 text-center text-sm text-neutral-400">
                    Start typing to search…
                  </div>
                )}
                {!isLoading && query && results &&
                  results.products.length === 0 &&
                  results.collections.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-neutral-500">
                    No results for <strong>"{query}"</strong>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="w-4 h-4 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
