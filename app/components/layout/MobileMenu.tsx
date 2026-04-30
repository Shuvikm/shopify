/**
 * @file MobileMenu.tsx
 * @description Accessible slide-in side menu for mobile viewports.
 * Uses Headless UI `Dialog` for focus trapping and ARIA.
 */
import {Dialog, Transition} from '@headlessui/react';
import {NavLink} from '@remix-run/react';
import {Fragment} from 'react';
import {cn} from '~/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileMenu({isOpen, onClose, navItems}: MobileMenuProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-200"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-100">
              <Dialog.Title className="font-bold text-lg text-neutral-900">
                Menu
              </Dialog.Title>
              <button
                type="button"
                aria-label="Close menu"
                id="mobile-menu-close-btn"
                onClick={onClose}
                className="btn-ghost w-8 h-8 p-0 rounded-full"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  prefetch="intent"
                  onClick={onClose}
                  className={({isActive}) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-neutral-700 hover:bg-neutral-50',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Footer CTA */}
            <div className="p-5 border-t border-neutral-100">
              <NavLink
                to="/search"
                onClick={onClose}
                className="btn btn-secondary w-full justify-center"
              >
                Search Products
              </NavLink>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
