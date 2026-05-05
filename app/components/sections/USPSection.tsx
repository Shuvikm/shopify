export function USPSection() {
  const usps = [
    {icon: '⚡', title: 'Fast Delivery', desc: 'Free shipping on orders over ₹5,000. Same-day dispatch on most items.'},
    {icon: '🔐', title: 'Secure Checkout', desc: 'SSL encrypted & Razorpay protected. Your data is always safe.'},
    {icon: '💯', title: '100% Authentic', desc: 'Every product quality-checked before dispatch. Zero compromise.'},
    {icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns. No questions asked. Prepaid labels.'},
  ];

  return (
    <section className="py-16 bg-white border-b border-neutral-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {usps.map((usp) => (
            <div key={usp.title} className="text-center space-y-3">
              <p className="text-4xl">{usp.icon}</p>
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest">{usp.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
