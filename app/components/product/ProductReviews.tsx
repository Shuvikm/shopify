/**
 * @file ProductReviews.tsx
 * @description Amazon-style review section with rating breakdown bar chart,
 *              verified buyer cards, and helpful voting.
 */
import {useState} from 'react';
import {useFetcher} from '@remix-run/react';
import {cn} from '~/lib/utils';

export interface Review {
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
}

const MOCK_REVIEWS: Review[] = [
  {author: 'Priya S.', rating: 5, date: '12 Apr 2026', title: 'Absolutely love it!', body: 'The quality exceeded my expectations. Fast delivery, great packaging. Will definitely buy again.', verified: true},
  {author: 'Rahul M.', rating: 4, date: '05 Apr 2026', title: 'Great product, minor issue', body: 'Overall very satisfied. The material is premium. Delivery was quick. Minor size discrepancy but still wearable.', verified: true},
  {author: 'Anjali K.', rating: 5, date: '28 Mar 2026', title: 'Perfect gift!', body: 'Bought this as a gift and they loved it. Arrived in excellent condition. Highly recommend.', verified: false},
  {author: 'Vikram R.', rating: 3, date: '15 Mar 2026', title: 'Average quality for the price', body: 'Expected better at this price point. Material is decent but not premium. Still wearable though.', verified: true},
  {author: 'Meena T.', rating: 5, date: '02 Mar 2026', title: 'Excellent!', body: 'Beautiful product, exactly as shown. Very happy with this purchase. Fast delivery too!', verified: true},
];

function Stars({rating, size = 'sm'}: {rating: number; size?: 'sm'|'md'|'lg'}) {
  const cls = {sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7'}[size];
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`${cls} ${rating >= i ? 'text-yellow-400' : 'text-neutral-200'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export function ProductReviews({metaobjectFields}: {metaobjectFields?: {key: string; value: string}[]}) {
  const [helpful, setHelpful] = useState<Record<number, 'yes'|'no'|null>>({});
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== 'idle';
  const success = (fetcher.data as any)?.success;

  let reviews: Review[] = MOCK_REVIEWS;
  if (metaobjectFields) {
    const f = metaobjectFields.find(f => f.key === 'reviews_json');
    if (f) {
      try { reviews = JSON.parse(f.value); } catch {}
    }
  }

  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const displayed = showAll ? reviews : reviews.slice(0, 3);

  // Star distribution
  const dist = [5,4,3,2,1].map(star => ({
    star,
    count: reviews.filter(r => Math.round(r.rating) === star).length,
    pct: Math.round(reviews.filter(r => Math.round(r.rating) === star).length / reviews.length * 100),
  }));

  return (
    <section className="border-t border-neutral-100 py-12">
      <h2 className="text-2xl font-black text-neutral-900 mb-8">Customer Reviews</h2>

      <div className="grid md:grid-cols-3 gap-10 mb-10">
        {/* Left: Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black text-neutral-900">{avgRating.toFixed(1)}</span>
            <div>
              <Stars rating={avgRating} size="md" />
              <p className="text-xs text-neutral-500 mt-1">{reviews.length} ratings</p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="space-y-2">
            {dist.map(d => (
              <div key={d.star} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-brand-600 font-bold text-right">{d.star}★</span>
                <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                    style={{width: `${d.pct}%`}}
                  />
                </div>
                <span className="w-8 text-neutral-400">{d.pct}%</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-secondary w-full mt-4 !text-sm"
          >
            ✍️ Write a Review
          </button>
        </div>

        {/* Write Review Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-900">✕</button>
              
              {success ? (
                <div className="text-center py-10 space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-2xl font-black">Thank You!</h3>
                  <p className="text-neutral-500">Your review has been submitted for moderation.</p>
                  <button onClick={() => setShowModal(false)} className="btn btn-primary px-8">Close</button>
                </div>
              ) : (
                <fetcher.Form method="POST" action="/api/reviews" className="space-y-5">
                  <div>
                    <h3 className="text-2xl font-black text-neutral-900">Write a Review</h3>
                    <p className="text-sm text-neutral-500 mt-1">Share your experience with other customers.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <label key={s} className="cursor-pointer">
                          <input type="radio" name="rating" value={s} className="sr-only" defaultChecked={s === 5} />
                          <span className="text-2xl hover:scale-110 transition-transform block">⭐</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Your Name</label>
                      <input required name="author" type="text" placeholder="e.g. John D." className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Review Title</label>
                      <input required name="title" type="text" placeholder="e.g. Amazing quality!" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Review Details</label>
                    <textarea required name="body" rows={4} placeholder="What did you like or dislike?" className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-400 transition-colors resize-none" />
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full btn btn-primary h-14 !rounded-2xl font-black uppercase tracking-widest text-sm relative overflow-hidden"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </fetcher.Form>
              )}
            </div>
          </div>
        )}

        {/* Right: Reviews */}
        <div className="md:col-span-2 space-y-6">
          {displayed.map((review, i) => (
            <div key={i} className="border-b border-neutral-50 pb-6 last:border-0 animate-fadeIn">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Stars rating={review.rating} />
                    {review.verified && (
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm">{review.title}</h4>
                </div>
                <span className="text-[10px] text-neutral-400 shrink-0">{review.date}</span>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-3">{review.body}</p>
              <p className="text-[10px] text-neutral-500 font-bold">— {review.author}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[10px] text-neutral-400">Helpful?</span>
                <button
                  onClick={() => setHelpful(h => ({...h, [i]: h[i] === 'yes' ? null : 'yes'}))}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${helpful[i] === 'yes' ? 'bg-brand-500 text-white border-brand-500' : 'border-neutral-200 text-neutral-600 hover:border-brand-400'}`}
                >
                  👍 Yes
                </button>
                <button
                  onClick={() => setHelpful(h => ({...h, [i]: h[i] === 'no' ? null : 'no'}))}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${helpful[i] === 'no' ? 'bg-neutral-700 text-white border-neutral-700' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'}`}
                >
                  👎 No
                </button>
              </div>
            </div>
          ))}

          {reviews.length > 3 && (
            <button onClick={() => setShowAll(s => !s)} className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors">
              {showAll ? '▲ Show less' : `▼ See all ${reviews.length} reviews`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
