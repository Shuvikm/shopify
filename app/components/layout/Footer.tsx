/**
 * @file Footer.tsx
 * @description Site footer with navigation columns, social links, and legal.
 */
import {Link} from '@remix-run/react';

const FOOTER_LINKS = [
  {
    heading: 'Shop',
    links: [
      {label: 'All Products', href: '/collections/all'},
      {label: 'New Arrivals', href: '/collections/new-arrivals'},
      {label: 'Sale', href: '/collections/sale'},
    ],
  },
  {
    heading: 'Help',
    links: [
      {label: 'FAQ', href: '/pages/faq'},
      {label: 'Shipping & Returns', href: '/pages/shipping'},
      {label: 'Contact Us', href: '/pages/contact'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About Us', href: '/pages/about'},
      {label: 'Sustainability', href: '/pages/sustainability'},
      {label: 'Careers', href: '/pages/careers'},
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 mt-24">
      <div className="container mx-auto py-16">
        {/* Top Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-sm font-black">H</span>
              <span className="font-bold text-white text-lg">
                Hydro<span className="text-brand-400">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium headless shopping, powered by Hydrogen + Remix.
            </p>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                {col.heading}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} HydroStore. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/policies/privacy-policy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link to="/policies/terms-of-service" className="hover:text-neutral-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
