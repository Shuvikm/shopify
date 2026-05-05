import {useState, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const fetcher = useFetcher<{ok: boolean; error?: string}>();

  const isSubmitting = fetcher.state !== 'idle';
  const submitted = fetcher.data?.ok === true;
  const serverError = fetcher.data?.ok === false ? fetcher.data.error : null;

  useEffect(() => {
    if (sessionStorage.getItem('newsletter_dismissed')) return;
    const timer = setTimeout(() => setIsVisible(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after showing success for 4 s
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(dismiss, 4000);
    return () => clearTimeout(t);
  }, [submitted]);

  function dismiss() {
    setIsVisible(false);
    sessionStorage.setItem('newsletter_dismissed', 'true');
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-brand-primary/20 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-paper p-12 md:p-16 shadow-2xl border border-brand-primary/5">
        <button
          onClick={dismiss}
          className="absolute top-6 right-6 text-brand-primary/40 hover:text-brand-primary transition-colors"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth="1.5" />
          </svg>
        </button>

        {!submitted ? (
          <div className="text-center space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-accent">Exclusive Membership</p>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-primary">Join the Inner Circle</h2>
              <p className="text-neutral-500 font-light leading-relaxed max-w-sm mx-auto">
                Receive invitations to private collections and early access to our most anticipated releases.
              </p>
            </div>

            <fetcher.Form method="POST" action="/api/newsletter" className="space-y-6">
              <div className="relative border-b border-brand-primary/10">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email Address"
                  className="w-full bg-transparent py-4 text-center text-sm font-light text-brand-primary outline-none placeholder:text-neutral-300"
                />
              </div>

              {serverError && (
                <p className="text-xs text-red-500 text-center">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-brand-primary text-white text-[10px] uppercase tracking-[0.4em] hover:bg-brand-accent transition-all duration-700 disabled:opacity-60"
              >
                {isSubmitting ? 'Sending…' : 'Request Access'}
              </button>
            </fetcher.Form>

            <p className="text-[9px] uppercase tracking-widest text-neutral-300">
              Respecting your privacy since 2026. No spam, ever.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-8 animate-fadeIn py-10">
            <div className="w-12 h-12 rounded-full border border-brand-accent mx-auto flex items-center justify-center text-brand-accent">
              ✓
            </div>
            <div>
              <h3 className="text-2xl font-serif text-brand-primary mb-4">Request Received</h3>
              <p className="text-neutral-500 font-light">An invitation will be sent to your inbox.</p>
            </div>
            <button
              onClick={dismiss}
              className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/30 pb-1"
            >
              Return to Archive
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
