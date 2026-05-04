/**
 * @file USPSection.tsx
 * @description Unique Selling Propositions - What makes us different
 * CRO Impact: Reduces friction, builds confidence
 */
import {CheckCircle} from 'lucide-react';

export function USPSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Fast Shipping',
              desc: 'Free 2-day shipping on orders over $50. Most orders ship same day.',
            },
            {
              icon: '🔐',
              title: 'Secure & Trusted',
              desc: 'SSL encrypted checkout. 98% customer satisfaction. ISO 27001 certified.',
            },
            {
              icon: '💯',
              title: '100% Quality',
              desc: 'Every product tested before shipping. Highest standards guaranteed.',
            },
            {
              icon: '↩️',
              title: 'Easy Returns',
              desc: '60-day hassle-free returns. Prepaid return labels. No questions asked.',
            },
          ].map((usp, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <p className="text-5xl mb-4">{usp.icon}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{usp.title}</h3>
              <p className="text-gray-600 text-sm">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
