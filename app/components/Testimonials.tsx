const TESTIMONIALS = [
  {
    quote: "Exceptional quality. The packaging alone feels premium — exactly what I expected from a luxury store.",
    author: "Priya S.",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    product: "Luxury Watch",
  },
  {
    quote: "Delivered in 2 days, exactly as described. The leather is gorgeous. Will definitely buy again!",
    author: "Rahul T.",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    product: "Italian Leather Bag",
  },
  {
    quote: "Customer support went above and beyond. The product quality matches the premium price point.",
    author: "Emily R.",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    product: "Cashmere Collection",
  },
];

function StarRow({count}: {count: number}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-4 h-4 ${i <= count ? 'text-yellow-400' : 'text-neutral-200'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 bg-neutral-50 border-y border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-4">Social Proof</p>
          <h2 className="text-brand-primary mb-4">Loved by Thousands</h2>
          <div className="flex items-center justify-center gap-3">
            <StarRow count={5} />
            <p className="text-sm text-neutral-500 font-medium">4.9 / 5 from 2,400+ verified reviews</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300">
              <StarRow count={t.rating} />
              <p className="text-neutral-700 mt-4 mb-6 leading-relaxed text-sm italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.author} loading="lazy" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-neutral-900">{t.author}</p>
                  <p className="text-xs text-neutral-400">{t.role} · {t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8 border-t border-neutral-200 pt-12">
          {[
            {stat: '50K+', label: 'Happy Customers'},
            {stat: '98%', label: 'Satisfaction Rate'},
            {stat: '₹5K+', label: 'Free Shipping Threshold'},
          ].map(({stat, label}) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-brand-primary mb-1">{stat}</p>
              <p className="text-xs text-neutral-500 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
