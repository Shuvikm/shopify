import {type MetaFunction} from '@remix-run/server-runtime';
import {useState} from 'react';
import {Link} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Assistance — The Collection'},
  {
    name: 'description',
    content: 'Find answers to common inquiries regarding our collections, shipping, and bespoke services.'
  },
];

const FAQ_ITEMS = [
  {
    category: 'Shipment & Logistics',
    items: [
      { q: 'What are your shipping standards?', a: 'We provide complimentary express delivery on all orders. Each piece is meticulously packed in our signature archival box and shipped via our global logistics partners.' },
      { q: 'Do you offer international delivery?', a: 'Yes, we ship to over 50 countries worldwide. International shipments are fully insured and include all necessary customs documentation for a seamless experience.' },
    ]
  },
  {
    category: 'The Selection',
    items: [
      { q: 'How do I ensure the perfect fit?', a: 'Our sizing is tailored to international standards. We provide detailed measurements for every piece in our sizing guide, or you may consult with our concierge team.' },
      { q: 'Are your materials sustainable?', a: 'Sustainability is core to our ethos. We source only traceable, high-integrity materials from partners who share our commitment to environmental stewardship.' },
    ]
  },
  {
    category: 'Security & Assurance',
    items: [
      { q: 'Is my transaction secure?', a: 'All transactions are processed through enterprise-grade encryption. We support all major payment methods, including Razorpay for local markets, ensuring total security.' },
      { q: 'What is your return policy?', a: 'We offer a 30-day return window for items in their original, pristine condition. Our concierge team will assist you with every step of the process.' },
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="bg-paper min-h-screen">
      {/* Header */}
      <section className="py-24 md:py-32 text-center border-b border-brand-primary/5">
        <div className="container mx-auto px-6">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-8">Client Services</p>
          <h1 className="text-brand-primary mb-12">Common Inquiries</h1>
          <div className="w-[1px] h-16 bg-brand-accent mx-auto" />
        </div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <div className="space-y-24">
          {FAQ_ITEMS.map((section, sIdx) => (
            <div key={sIdx} className="space-y-8">
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-brand-accent border-b border-brand-primary/5 pb-4">
                {section.category}
              </h2>
              <div className="divide-y divide-brand-primary/5">
                {section.items.map((item, iIdx) => {
                  const id = `${sIdx}-${iIdx}`;
                  const isOpen = openIndex === id;
                  return (
                    <div key={iIdx} className="py-8 group">
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : id)}
                        className="w-full flex items-center justify-between text-left group"
                      >
                        <span className="text-xl font-serif text-brand-primary group-hover:text-brand-accent transition-colors duration-500">
                          {item.q}
                        </span>
                        <span className={`text-brand-accent transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
                          +
                        </span>
                      </button>
                      <div className={`overflow-hidden transition-all duration-700 ${isOpen ? 'max-h-[300px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-neutral-500 font-light leading-relaxed max-w-2xl">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-32 bg-white border-t border-brand-primary/5 text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h3 className="text-brand-primary mb-8 font-serif">Still seeking assistance?</h3>
          <p className="text-neutral-500 font-light mb-12">Our concierge team is available for personalized support.</p>
          <Link 
            to="/contact" 
            className="inline-flex px-12 py-5 bg-brand-primary text-white text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent transition-all duration-700"
          >
            Contact Concierge
          </Link>
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_ITEMS.flatMap(s => s.items).map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
