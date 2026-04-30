/**
 * @file Header.tsx
 * @description Site-wide header with:
 * - Logo / brand name
 * - Desktop navigation links
 * - Predictive search trigger
 * - Cart icon with live item count (optimistic)
 * - Mobile menu toggle
 *
 * Sticky with a blur-backdrop for a premium feel.
 */
import {Link, NavLink} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {useCart} from '~/hooks';
import {PredictiveSearch} from '~/components/search';
import {MobileMenu} from './MobileMenu';
import {NAV_ITEMS} from '~/config';
import {cn} from '~/lib/utils';



export function Header() {
  const {totalQuantity, openCart} = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full',
          'bg-white/80 backdrop-blur-md',
          'border-b border-neutral-100',
          'transition-shadow duration-200',
        )}
      >
        <div className="container mx-auto h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-neutral-900"
            prefetch="intent"
          >
            <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-sm font-black">
              H
            </span>
            <span>Hydro<span className="text-brand-500">Store</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                prefetch="intent"
                className={({isActive}) =>
                  cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              type="button"
              aria-label="Open search"
              id="header-search-btn"
              onClick={() => setSearchOpen(true)}
              className="btn-ghost w-9 h-9 p-0 rounded-full"
            >
              <SearchIcon />
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label={`Cart — ${totalQuantity ?? 0} items`}
              id="header-cart-btn"
              onClick={openCart}
              className="btn-ghost relative w-9 h-9 p-0 rounded-full"
            >
              <CartIcon />
              {(totalQuantity ?? 0) > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center leading-none"
                  aria-hidden="true"
                >
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label="Open menu"
              id="header-mobile-menu-btn"
              className="btn-ghost w-9 h-9 p-0 rounded-full md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Predictive Search Overlay */}
      {searchOpen && (
        <PredictiveSearch onClose={() => setSearchOpen(false)} />
      )}

      {/* Mobile Side Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={[...NAV_ITEMS]}
      />
    </>
  );
}

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
