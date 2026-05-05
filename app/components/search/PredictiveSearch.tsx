/**
 * @file PredictiveSearch.tsx
 * @description Full-screen search overlay with predictive results.
 */
import {Dialog, Transition} from '@headlessui/react';
import {Link, useNavigate} from '@remix-run/react';
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
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/97 backdrop-blur-xl" aria-hidden="true" />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-out duration-300"
          enterFrom="-translate-y-4 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transform transition ease-in duration-200"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="-translate-y-2 opacity-0"
        >
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="container mx-auto px-6 pt-16 pb-10 max-w-3xl">
              <Dialog.Panel>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 border-b border-brand-primary/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-1">Search</span>
                    <h2 className="text-lg font-serif text-brand-primary">The Collection</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:text-brand-accent transition-colors"
                    aria-label="Close search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" />
                    </svg>
                  </button>
                </div>

                {/* Search input */}
                <form onSubmit={handleSubmit} className="relative mb-8">
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by product, material, or color…"
                    className="w-full bg-transparent border-none text-2xl md:text-3xl font-serif text-brand-primary placeholder:text-neutral-300 outline-none p-0 leading-tight"
                    aria-label="Search"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-brand-primary/10" />
                  {isLoading && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </form>

                {/* Results or defaults */}
                {!query ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Trending Now</h3>
                      <div className="flex flex-col gap-3">
                        {['Minimalist Apparel', 'Handcrafted Silk', 'Bespoke Accessories', 'The Gold Edition'].map(term => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="text-left text-base font-serif text-brand-primary hover:text-brand-accent transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Browse Collections</h3>
                      <div className="flex flex-col gap-0">
                        {['Apparel', 'Accessories', 'All Products'].map(col => (
                          <Link
                            key={col}
                            to={col === 'All Products' ? '/collections/all' : `/collections/${col.toLowerCase()}`}
                            onClick={handleClose}
                            className="group flex items-center justify-between py-3 border-b border-brand-primary/5 hover:border-brand-accent transition-all"
                          >
                            <span className="text-base font-serif text-brand-primary group-hover:text-brand-accent">{col}</span>
                            <span className="text-xs tracking-widest text-neutral-300 group-hover:translate-x-1 transition-transform">→</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : results ? (
                  <SearchResults results={results} query={query} onItemClick={handleClose} />
                ) : null}

                {/* No results */}
                {!isLoading && query && results && results.products.length === 0 && results.collections.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-lg font-serif text-neutral-400 italic">No results found for "{query}"</p>
                    <button onClick={clear} className="mt-6 text-[10px] uppercase tracking-[0.3em] text-brand-accent hover:text-brand-primary transition-colors">
                      Clear Search
                    </button>
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
