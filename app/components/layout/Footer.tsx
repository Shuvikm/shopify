/**
 * @file Footer.tsx
 * @description Site footer with newsletter signup, social links, and legal info.
 */
import {Link} from '@remix-run/react';

const FOOTER_LINKS = [
  {
    heading: 'Shop',
    links: [
      {label: 'All Products', href: '/collections/all'},
      {label: 'Featured', href: '/collections/frontpage'},
      {label: 'New Arrivals', href: '/collections/new-arrivals'},
    ],
  },
  {
    heading: 'Help',
    links: [
      {label: 'Track My Order', href: '/track'},
      {label: 'Contact Us', href: '/contact'},
      {label: 'Shipping & Returns', href: '/pages/shipping-returns'},
      {label: 'Privacy Policy', href: '/pages/privacy-policy'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About Us', href: '/pages/about-us'},
      {label: 'Sustainability', href: '/pages/sustainability'},
      {label: 'Terms of Service', href: '/pages/terms-of-service'},
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 mt-24">
      <div className="container mx-auto px-6 py-16">
        {/* Top Row: Newsletter + Info */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-16 pb-16 border-b border-neutral-800">
          <div className="max-w-md space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white text-sm font-black">H</span>
              <span className="font-bold text-white text-lg tracking-tighter">
                Hydro<span className="text-brand-400">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Elevate your daily essentials with our curated selection of premium tools and lifestyle gear. Designed for the modern visionary.
            </p>
            <div className="flex gap-4">
              <SocialIcon platform="Instagram" />
              <SocialIcon platform="Twitter" />
              <SocialIcon platform="LinkedIn" />
            </div>
          </div>

          <div className="w-full max-w-sm">
            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-4">Stay in the loop</h3>
            <p className="text-xs mb-6">Join 10,000+ visionaries. Get exclusive early access and weekly drops.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors" 
                placeholder="email@example.com"
              />
              <button className="btn btn-primary !px-6 !rounded-lg">Join</button>
            </form>
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm font-medium hover:text-white transition-colors duration-150"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-20 pt-8 border-t border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
          <p>© {new Date().getFullYear()} HydroStore. Engineered for Precision.</p>
          <div className="flex gap-6">
            <span className="text-neutral-500">Shopify Hydrogen</span>
            <span className="text-neutral-500">Built for Speed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({platform}: {platform: string}) {
  return (
    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-500 transition-colors cursor-pointer text-white">
      <span className="text-[10px] font-black uppercase">{platform[0]}</span>
    </div>
  );
}
