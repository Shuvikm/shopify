/**
 * @file Header.tsx
 * @description Amazon-style 2-row header with persistent search, mega-menu,
 *              account link, cart, and location indicator.
 */
import {Link, NavLink, Form, useNavigate} from '@remix-run/react';
import {useState, useRef, useEffect} from 'react';
import {useCart} from '~/hooks';
import {PredictiveSearch} from '~/components/search';
import {MobileMenu} from './MobileMenu';
import {cn} from '~/lib/utils';

const CATEGORIES = [
  'Luxury Watches', 'Designer Apparel', 'Premium Footwear', 'Accessories',
  'Winter Gear', 'Active Apparel', 'Smart Home', 'Outdoor Living',
  'Dresses', 'Coats', 'Shorts', 'Bags & Wallets',
];

const TOP_NAV = [
  {label: "Today's Deals", href: '/collections/sale'},
  {label: 'New Arrivals',  href: '/collections/new-arrivals'},
  {label: 'Best Sellers',  href: '/collections/frontpage'},
  {label: 'Gift Ideas',    href: '/collections/gifts'},
  {label: 'Track Order',   href: '/track'},
  {label: 'Customer Service', href: '/contact'},
];

export function Header() {
  const {totalQuantity, openCart} = useCart();
  const [searchOpen, setSearchOpen]   = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery]  = useState('');
  const navigate = useNavigate();
  const megaRef = useRef<HTMLDivElement>(null);

  // Close mega-menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }

  return (
    <>
      {/* ── ROW 1: Top bar (dark) ─────────────────────────────────────── */}
      <div className="bg-neutral-900 text-white text-xs">
        <div className="container mx-auto px-4 h-9 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 shrink-0" prefetch="intent">
            <span className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center text-white text-[10px] font-black">H</span>
            <span className="font-bold text-sm tracking-tight">Hydro<span className="text-brand-400">Store</span></span>
          </Link>

          {/* Deliver to */}
          <div className="hidden md:flex items-center gap-1 text-neutral-300 shrink-0">
            <span className="text-base leading-none">📍</span>
            <div>
              <p className="text-[9px] text-neutral-400 leading-none">Deliver to</p>
              <p className="font-bold text-white text-[11px] leading-none mt-0.5">India</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
            <div className="flex w-full rounded-md overflow-hidden shadow-sm ring-2 ring-transparent focus-within:ring-brand-400 transition-all">
              <div className="relative">
                <select className="h-10 px-2 bg-neutral-100 text-neutral-700 text-xs border-r border-neutral-300 rounded-l-md focus:outline-none appearance-none pr-6 cursor-pointer">
                  <option>All</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[10px]">▾</span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search HydroStore..."
                className="flex-1 h-10 px-4 text-sm text-neutral-900 bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="h-10 px-4 bg-brand-400 hover:bg-brand-500 text-white text-sm font-bold rounded-r-md transition-colors"
                aria-label="Search"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Account & Cart */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/account" className="hidden md:block text-center hover:text-brand-300 transition-colors">
              <p className="text-[9px] text-neutral-400 leading-none">Hello, Guest</p>
              <p className="font-bold text-[11px] leading-none mt-0.5">Account & Orders</p>
            </Link>

            <Link to="/collections/wishlist" className="hidden md:block text-center hover:text-brand-300 transition-colors">
              <p className="text-[9px] text-neutral-400 leading-none">Returns</p>
              <p className="font-bold text-[11px] leading-none mt-0.5">& Wishlist ♡</p>
            </Link>

            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 hover:text-brand-300 transition-colors"
              aria-label={`Cart — ${totalQuantity ?? 0} items`}
            >
              <div className="relative">
                <span className="text-2xl leading-none">🛒</span>
                {(totalQuantity ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-black flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <span className="font-bold text-[11px] hidden sm:block">Cart</span>
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-white p-1"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Category nav (slightly lighter dark) ───────────────── */}
      <div className="bg-neutral-800 text-white text-xs sticky top-0 z-40">
        <div className="container mx-auto px-4 h-9 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {/* All / Mega menu */}
          <div ref={megaRef} className="relative shrink-0">
            <button
              onClick={() => setMegaMenuOpen(o => !o)}
              className="flex items-center gap-1 px-3 h-9 font-bold hover:bg-white/10 rounded transition-colors whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All
            </button>

            {megaMenuOpen && (
              <div className="absolute left-0 top-full mt-0.5 w-64 bg-white text-neutral-900 shadow-2xl rounded-b-xl overflow-hidden z-50 border border-neutral-100">
                <div className="px-4 py-2 bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b">
                  Shop by Category
                </div>
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat}
                    to={`/collections/${cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-brand-50 hover:text-brand-600 transition-colors"
                  >
                    {cat}
                    <span className="text-neutral-300 text-xs">›</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />

          {/* Top nav links */}
          {TOP_NAV.map(item => (
            <Link
              key={item.href}
              to={item.href}
              className="px-3 h-9 flex items-center font-medium hover:bg-white/10 rounded transition-colors whitespace-nowrap shrink-0"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Predictive Search Overlay */}
      {searchOpen && (
        <PredictiveSearch onClose={() => setSearchOpen(false)} />
      )}

      {/* Mobile Side Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={[...TOP_NAV]}
      />
    </>
  );
}
