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
      <Dialog as="div" className="relative z-[200]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/95 backdrop-blur-xl" aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transform transition ease-out duration-700"
          enterFrom="-translate-y-8 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transform transition ease-in duration-500"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="-translate-y-4 opacity-0"
        >
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="container mx-auto px-6 py-24 max-w-4xl">
              <Dialog.Panel>
                <div className="flex items-center justify-between mb-12 border-b border-brand-primary/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-1">Search</span>
                    <h2 className="text-2xl font-serif text-brand-primary">The Collection</h2>
                  </div>
                  <button 
                    onClick={handleClose}
                    className="p-2 hover:text-brand-accent transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="relative mb-16">
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by product, material, or color…"
                    className="w-full bg-transparent border-none text-3xl md:text-5xl font-serif text-brand-primary placeholder:text-neutral-200 outline-none p-0"
                    aria-label="Search"
                  />
                  {isLoading && (
                    <div className="absolute right-0 bottom-2">
                      <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                  {!results && !query && (
                    <>
                      <div className="space-y-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Trending Now</h3>
                        <div className="flex flex-col gap-4">
                          {['Minimalist Apparel', 'Handcrafted Silk', 'Bespoke Accessories', 'The Gold Edition'].map(term => (
                            <button 
                              key={term}
                              onClick={() => setQuery(term)}
                              className="text-left text-lg font-serif text-brand-primary hover:text-brand-accent transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-8">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Featured Archive</h3>
                        <div className="grid grid-cols-1 gap-6">
                          {['Apparel', 'Accessories'].map(col => (
                            <Link 
                              key={col}
                              to={`/collections/${col.toLowerCase()}`}
                              onClick={handleClose}
                              className="group flex items-center justify-between py-4 border-b border-brand-primary/5 hover:border-brand-accent transition-all"
                            >
                              <span className="text-xl font-serif text-brand-primary group-hover:text-brand-accent">{col}</span>
                              <span className="text-xs tracking-widest text-neutral-300 group-hover:translate-x-2 transition-transform">Explore →</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {results && query && (
                    <div className="col-span-full">
                      <SearchResults
                        results={results}
                        query={query}
                        onItemClick={handleClose}
                      />
                    </div>
                  )}
                </div>

                {!isLoading && query && results && results.products.length === 0 && (
                  <div className="py-24 text-center">
                    <p className="text-xl font-serif text-neutral-400 italic">"No matching selections found in our current archive."</p>
                    <button onClick={clear} className="mt-8 text-[10px] uppercase tracking-[0.3em] text-brand-accent hover:text-brand-primary">Reset Search</button>
                  </div>
                )}
              </Dialog.Panel>
            </div>
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
