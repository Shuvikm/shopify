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
      <Dialog as="div" className="relative z-[150]" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-primary/20 backdrop-blur-md" aria-hidden="true" />
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-out duration-700"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in duration-500"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog.Panel className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl flex flex-col p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-16">
              <div className="flex flex-col">
                <span className="text-lg font-serif tracking-widest text-brand-primary">THE COLLECTION</span>
                <span className="text-[6px] uppercase tracking-[0.5em] text-brand-accent">Menu Selection</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-brand-primary hover:text-brand-accent transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 flex flex-col gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  prefetch="intent"
                  onClick={onClose}
                  className={({isActive}) =>
                    cn(
                      'text-xl font-serif tracking-wide transition-all duration-300',
                      isActive ? 'text-brand-accent pl-2' : 'text-brand-primary hover:pl-2'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-12 border-t border-brand-primary/5 space-y-8">
              <div className="flex flex-col gap-2">
                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">Concierge</p>
                <a href="mailto:assistance@thecollection.com" className="text-xs text-brand-primary">assistance@thecollection.com</a>
              </div>
              
              <div className="flex gap-6">
                {['IG', 'TW', 'FB'].map(social => (
                  <span key={social} className="text-[10px] tracking-widest text-brand-primary/40 hover:text-brand-accent cursor-pointer transition-colors">
                    {social}
                  </span>
                ))}
              </div>
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
