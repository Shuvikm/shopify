/**
 * @file CTASection.tsx
 * @description Call-to-Action section with urgency and value proposition
 * CRO Impact: Drives conversions, creates urgency
 */
import {Link} from '@remix-run/react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Ready to Experience Premium Quality?
        </h2>
        <p className="text-xl text-slate-300 mb-4 max-w-2xl mx-auto">
          Join 50,000+ customers who trust us for exceptional products and service.
        </p>

        {/* Urgency Message */}
        <p className="text-lg font-semibold text-blue-300 mb-8">
          🎁 New customers: Use code <span className="text-yellow-300">WELCOME10</span> for 10% off
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/collections/all"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-lg transition-colors text-lg"
          >
            Shop Now
          </Link>
          <Link
            to="/about"
            className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-10 py-4 rounded-lg transition-colors text-lg border border-white/30"
          >
            Learn Our Story
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Free Returns</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>2-Day Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>
    </section>
  );
}
