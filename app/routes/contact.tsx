/**
 * @file routes/contact.tsx
 * @description Contact page with a premium form and brand info.
 */
import type {MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => [{title: 'Contact Us | HydroStore'}];

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
        {/* Info */}
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-none">
            LET'S <br />
            <span className="text-brand-600">TALK.</span>
          </h1>
          <p className="text-lg text-neutral-500 leading-relaxed">
            Have a question about an order or just want to say hi? <br />
            We'd love to hear from you.
          </p>
          
          <div className="space-y-6 pt-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Email</p>
              <p className="text-xl font-bold text-neutral-900 underline">support@hydrostore.com</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Office</p>
              <p className="text-lg font-bold text-neutral-900">123 Hydrogen St, San Francisco, CA</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:w-1/2 bg-neutral-50 rounded-3xl p-8 md:p-12">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-600">First Name</label>
                <input type="text" className="input bg-white border-transparent shadow-sm" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-600">Last Name</label>
                <input type="text" className="input bg-white border-transparent shadow-sm" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-600">Email Address</label>
              <input type="email" className="input bg-white border-transparent shadow-sm" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-600">Message</label>
              <textarea rows={5} className="input bg-white border-transparent shadow-sm resize-none" placeholder="How can we help?" />
            </div>
            <button type="submit" className="w-full btn btn-primary !h-14 !text-lg shadow-xl shadow-brand-500/20 active:scale-95 transition-transform">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
