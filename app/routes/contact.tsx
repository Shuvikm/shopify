import {type MetaFunction} from '@remix-run/server-runtime';
import {useState} from 'react';

export const meta: MetaFunction = () => [
  {title: 'Concierge — The Collection'},
  {
    name: 'description',
    content: 'Connect with our concierge team for personalized assistance, order inquiries, or private consultations.'
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <section className="py-24 md:py-32 text-center border-b border-brand-primary/5">
        <div className="container mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-8">Personal Assistance</p>
          <h1 className="text-brand-primary mb-12 text-5xl md:text-7xl">The Concierge</h1>
          <div className="w-[1px] h-16 bg-brand-accent mx-auto" />
        </div>
      </section>

      <div className="container mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          
          {/* Contact Methods */}
          <div className="lg:col-span-5 space-y-16">
            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent">Inquiries</p>
              <h2 className="text-3xl font-serif text-brand-primary">Direct Assistance</h2>
              <p className="text-neutral-500 font-light leading-relaxed max-w-sm">
                Our team is available to assist you with selection, sizing, or any other inquiries you may have.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {[
                { label: 'Private Client Email', value: 'concierge@thecollection.com', href: 'mailto:concierge@thecollection.com' },
                { label: 'Text Messaging', value: '+1 212 555 0198', href: 'sms:+12125550198' },
                { label: 'Global Headquarters', value: '123 Avenue Montaigne, Paris', href: '#' },
              ].map((item, i) => (
                <div key={i} className="group">
                   <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-2">{item.label}</p>
                   <a href={item.href} className="text-brand-primary text-lg font-serif hover:text-brand-accent transition-colors duration-500">
                     {item.value}
                   </a>
                   <div className="w-0 group-hover:w-full h-[1px] bg-brand-accent transition-all duration-700 mt-2" />
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-brand-primary/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-6">Concierge Hours</p>
              <div className="space-y-2 text-sm text-brand-primary font-light">
                <p>Mon — Fri: 09:00 — 18:00 (GMT)</p>
                <p>Sat: 10:00 — 16:00 (GMT)</p>
                <p>Sun: By Appointment</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-12 md:p-16 shadow-2xl shadow-brand-primary/5 border border-brand-primary/5">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-fadeIn">
                <div className="w-16 h-16 rounded-full border border-brand-accent flex items-center justify-center text-brand-accent">
                  ✓
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-brand-primary mb-4">Message Received</h3>
                  <p className="text-neutral-500 font-light">A concierge will be in touch shortly.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/30 pb-1">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Full Name</label>
                    <input type="text" required className="w-full bg-transparent border-b border-brand-primary/10 py-3 focus:border-brand-accent outline-none transition-colors font-light text-brand-primary" placeholder="Enter name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Email Address</label>
                    <input type="email" required className="w-full bg-transparent border-b border-brand-primary/10 py-3 focus:border-brand-accent outline-none transition-colors font-light text-brand-primary" placeholder="Enter email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Inquiry Type</label>
                  <select className="w-full bg-transparent border-b border-brand-primary/10 py-3 focus:border-brand-accent outline-none transition-colors font-light text-brand-primary appearance-none cursor-pointer">
                    <option>Selection Advice</option>
                    <option>Order Inquiry</option>
                    <option>Private Sourcing</option>
                    <option>Corporate Gifting</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Your Message</label>
                  <textarea rows={4} required className="w-full bg-transparent border-b border-brand-primary/10 py-3 focus:border-brand-accent outline-none transition-colors font-light text-brand-primary resize-none" placeholder="How may we assist you?" />
                </div>

                <button type="submit" className="w-full py-6 bg-brand-primary text-white text-[10px] uppercase tracking-[0.4em] hover:bg-brand-accent transition-all duration-700">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
