/**
 * @file ProductReviews.tsx
 * @description Mocked reviews section for the PDP.
 */
export function ProductReviews() {
  const reviews = [
    {
      author: 'Alex M.',
      rating: 5,
      date: '2 days ago',
      title: 'Absolutely worth it!',
      body: 'The quality is top-notch. I was surprised at how fast it arrived. Highly recommend!',
    },
    {
      author: 'Sarah K.',
      rating: 4,
      date: '1 week ago',
      title: 'Great experience',
      body: 'Very satisfied with the product. The variant selector was easy to use on my phone.',
    },
  ];

  return (
    <div className="border-t border-neutral-100 py-16 md:py-24">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3">
          <h2 className="text-3xl font-black text-neutral-900 mb-4">Customer Reviews</h2>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-400 text-xl">
              {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <span className="font-bold text-neutral-900">4.8 out of 5</span>
          </div>
          <p className="text-sm text-neutral-500">Based on 124 reviews</p>
          <button className="btn btn-secondary w-full mt-8">Write a Review</button>
        </div>
        
        <div className="md:w-2/3 space-y-10">
          {reviews.map((review, i) => (
            <div key={i} className="border-b border-neutral-50 pb-8 last:border-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-900">{review.author}</span>
                  <div className="flex text-yellow-400 text-sm">
                    {'★★★★★'.split('').map((s, j) => (
                      <span key={j} className={j < review.rating ? '' : 'text-neutral-200'}>{s}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-neutral-400">{review.date}</span>
              </div>
              <h4 className="font-bold text-neutral-800 mb-2">{review.title}</h4>
              <p className="text-neutral-600 text-sm leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
