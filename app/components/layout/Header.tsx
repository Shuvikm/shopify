/**
 * @file Header.tsx
 * @description Amazon-style 2-row header with persistent search, mega-menu,
 *              account link, cart, and location indicator.
 */
import {Link, useNavigate} from '@remix-run/react';
import {useState, useRef, useEffect} from 'react';
import {useCart} from '~/hooks';
import {PredictiveSearch} from '~/components/search';
import {MobileMenu} from './MobileMenu';
import {cn} from '~/lib/utils';
import {CATEGORIES} from '~/config/categories';

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-[100] transition-all duration-700',
      isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-brand-primary/5 py-4' : 'bg-transparent py-8'
    )}>
      <div className="container mx-auto px-6 flex items-center justify-between gap-8">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-brand-primary p-2 -ml-2"
          aria-label="Open navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4 8h16M4 16h16" strokeWidth="1.5" />
          </svg>
        </button>

        {/* Brand Identity */}
        <Link to="/" className="flex-1 lg:flex-none" prefetch="intent">
          <div className="flex flex-col items-center lg:items-start group">
            <span className="text-xl md:text-2xl font-serif tracking-[0.1em] text-brand-primary group-hover:text-brand-accent transition-colors duration-500">
              THE COLLECTION
            </span>
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.6em] text-brand-accent mt-1">
              Established 2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center flex-1 gap-12">
          {['Archive', 'Apparel', 'Accessories', 'About'].map((item) => (
            <Link 
              key={item}
              to={item === 'Archive' ? '/collections/all' : item === 'About' ? '/about' : `/collections/${item.toLowerCase()}`}
              className="text-[10px] uppercase tracking-[0.3em] text-brand-primary/60 hover:text-brand-primary transition-all duration-300 relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-accent transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Action Symbols */}
        <div className="flex items-center gap-4 md:gap-8 shrink-0">
          {/* Search Symbol */}
          <Link to="/search" className="text-brand-primary hover:text-brand-accent transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" strokeWidth="1.5" />
            </svg>
          </Link>

          {/* Account Symbol */}
          <Link to="/account" className="hidden md:block text-brand-primary hover:text-brand-accent transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeWidth="1.5" />
            </svg>
          </Link>

          {/* Cart Symbol */}
          <button 
            onClick={openCart}
            className="group relative flex items-center gap-3 text-brand-primary hover:text-brand-accent transition-colors duration-300"
            aria-label="Cart"
          >
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="1.5" />
              </svg>
              {(totalQuantity ?? 0) > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-brand-accent text-white text-[8px] flex items-center justify-center rounded-full animate-zoom-in">
                  {totalQuantity}
                </span>
              )}
            </div>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-medium pt-0.5">
              Selection
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={[
          {label: 'Archive', href: '/collections/all'},
          {label: 'Apparel', href: '/collections/apparel'},
          {label: 'Accessories', href: '/collections/accessories'},
          {label: 'Journal', href: '/journal'},
          {label: 'About', href: '/about'},
        ]}
      />
    </header>
  );
}
