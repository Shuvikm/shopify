import {Link} from '@remix-run/react';

const FOOTER_LINKS = [
  {
    heading: 'Shop',
    links: [
      {label: 'All Products', href: '/collections/all'},
      {label: 'New Arrivals', href: '/collections/new-arrivals'},
      {label: 'Best Sellers', href: '/collections/frontpage'},
      {label: "Today's Deals", href: '/collections/sale'},
    ],
  },
  {
    heading: 'Help',
    links: [
      {label: 'Track My Order', href: '/track'},
      {label: 'Contact Us', href: '/contact'},
      {label: 'Shipping & Returns', href: '/pages/shipping-returns'},
      {label: 'FAQ', href: '/faq'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'About Us', href: '/pages/about-us'},
      {label: 'Privacy Policy', href: '/pages/privacy-policy'},
      {label: 'Terms of Service', href: '/pages/terms-of-service'},
      {label: 'Sustainability', href: '/pages/sustainability'},
    ],
  },
];

const TRUST_BADGES = [
  {icon: '🔒', label: 'SSL Secure'},
  {icon: '✅', label: 'Verified Store'},
  {icon: '↩️', label: '30-Day Returns'},
  {icon: '🚚', label: 'Free Shipping ₹5K+'},
];

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 mt-24">
      {/* Trust bar */}
      <div className="border-b border-neutral-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs font-medium text-neutral-300">
                <span className="text-base">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-16 pb-16 border-b border-neutral-800">
          {/* Brand */}
          <div className="max-w-md space-y-6">
            <Link to="/" className="inline-block">
              <div className="flex flex-col">
                <span className="text-xl font-serif tracking-[0.1em] text-white">THE COLLECTION</span>
                <span className="text-[7px] uppercase tracking-[0.6em] text-brand-accent mt-1">Established 2026</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Curated luxury goods from around the world. Delivered with care. Built for those who appreciate timeless elegance and sustainable craftsmanship.
            </p>
            <div className="flex gap-3">
              {['IG', 'TW', 'FB', 'YT'].map((social) => (
                <div key={social} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-accent transition-colors cursor-pointer text-white text-[10px] font-black">
                  {social}
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full max-w-sm">
            <h3 className="text-white text-sm font-black uppercase tracking-widest mb-2">Stay in the loop</h3>
            <p className="text-xs mb-5">Join 10,000+ customers. Exclusive drops, early access, zero spam.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-accent transition-colors placeholder:text-neutral-600"
                placeholder="your@email.com"
              />
              <button type="submit" className="btn btn-primary !px-5 !rounded-lg !py-3">Join</button>
            </form>
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">{col.heading}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm hover:text-white transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
          <p>© {new Date().getFullYear()} The Collection. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Powered by Shopify Hydrogen</span>
            <span>Built for Speed ⚡</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
