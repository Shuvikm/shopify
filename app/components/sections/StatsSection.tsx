/**
 * @file StatsSection.tsx
 * @description Key metrics to build trust and credibility
 * CRO Impact: Social proof, builds confidence
 */
export function StatsSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              stat: '50,000+',
              label: 'Happy Customers',
              icon: '👥',
            },
            {
              stat: '4.9/5',
              label: 'Average Rating',
              icon: '⭐',
            },
            {
              stat: '98%',
              label: 'Satisfaction Rate',
              icon: '✓',
            },
            {
              stat: '24hrs',
              label: 'Average Shipping',
              icon: '🚀',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-4xl mb-3">{item.icon}</p>
              <p className="text-3xl font-bold text-blue-600 mb-2">{item.stat}</p>
              <p className="text-gray-600 text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
