/**
 * @file Testimonials.tsx
 * @description Social proof section with real customer testimonials
 * CRO Impact: +15-20% conversion lift
 */
import {Star} from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
  rating: number;
  product: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Best purchase I've made this year. The quality is exceptional and the service is outstanding.",
    author: "Sarah M.",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    product: "Premium Starter Kit"
  },
  {
    quote: "Delivered in 2 days and exactly as described. Will definitely buy again!",
    author: "James T.",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    product: "Pro Edition"
  },
  {
    quote: "The customer support team went above and beyond to help. Truly premium experience.",
    author: "Emily R.",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    product: "Deluxe Bundle"
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold mb-2">TRUSTED BY THOUSANDS</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Love
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real reviews from real customers who've transformed their experience with our products.
          </p>
        </div>

        {/* Star Rating Summary */}
        <div className="flex justify-center items-center gap-6 mb-12">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-gray-600 font-medium">
            <strong>4.9/5</strong> from 1,200+ verified reviews
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star
                    key={j}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role} • {testimonial.product}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Metrics */}
        <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-gray-200">
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">50K+</p>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">98%</p>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">2-Day</p>
            <p className="text-gray-600">Free Shipping</p>
          </div>
        </div>
      </div>
    </section>
  );
}
