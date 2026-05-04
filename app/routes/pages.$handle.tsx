/**
 * @file routes/pages.$handle.tsx
 * @description Dynamic page route for legal, info, and policy pages.
 * Falls back to rich static content for known handles when Shopify doesn't
 * have the page configured yet.
 */
import {json} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {PAGE_QUERY} from '~/graphql/PageQuery';

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data?.page?.title ?? 'Page'},
];

const STATIC_PAGES: Record<string, {title: string; contentHtml: string}> = {
  'shipping-returns': {
    title: 'Shipping & Returns',
    contentHtml: `
      <h2>Shipping Policy</h2>
      <p>We ship across India via trusted courier partners. All orders are processed within 1–2 business days of payment confirmation.</p>
      <h3>Delivery Timelines</h3>
      <ul>
        <li><strong>Metro cities</strong> (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata) — 2–4 business days</li>
        <li><strong>Tier-2 & Tier-3 cities</strong> — 4–7 business days</li>
        <li><strong>Remote / rural locations</strong> — 7–10 business days</li>
      </ul>
      <h3>Shipping Charges</h3>
      <ul>
        <li>Free standard shipping on all orders above ₹5,000.</li>
        <li>Orders below ₹5,000 attract a flat shipping fee of ₹149.</li>
        <li>Express next-day delivery (select cities): ₹299 flat fee.</li>
      </ul>
      <h3>Order Tracking</h3>
      <p>Once your order ships you will receive an SMS and email with your AWB (tracking) number. You can also track your order at any time via our <a href="/track">Track My Order</a> page.</p>

      <h2>Returns & Exchanges</h2>
      <p>We want you to love every item you receive. If something isn't right, we'll make it right.</p>
      <h3>Return Window</h3>
      <p>You may initiate a return or exchange within <strong>15 days</strong> of delivery for most items. Items must be unused, unwashed, and in their original packaging with all tags attached.</p>
      <h3>Non-Returnable Items</h3>
      <ul>
        <li>Intimates, swimwear, and pierced jewellery (for hygiene reasons)</li>
        <li>Personalised or custom-made items</li>
        <li>Items marked "Final Sale" at time of purchase</li>
        <li>Skincare and beauty products that have been opened</li>
      </ul>
      <h3>How to Initiate a Return</h3>
      <ol>
        <li>Email us at <strong>returns@hydrostore.in</strong> with your order number and reason for return.</li>
        <li>We'll send you a prepaid return label within 24 hours.</li>
        <li>Pack the item securely and drop it off at the nearest courier point.</li>
        <li>Refunds are processed within 5–7 business days of us receiving the item.</li>
      </ol>
      <h3>Refund Method</h3>
      <p>Refunds are credited to the original payment method. Store credit is also available if preferred, and is processed instantly.</p>
    `,
  },

  'privacy-policy': {
    title: 'Privacy Policy',
    contentHtml: `
      <p><em>Last updated: May 2026</em></p>
      <p>HydroStore ("we", "our", "us") is committed to protecting your personal information and your right to privacy. This policy describes how we collect, use, and share your data when you visit or make a purchase from our store.</p>

      <h2>Information We Collect</h2>
      <p>When you visit our site, we automatically collect certain information about your device, including your browser type, IP address, time zone, and some cookies. As you browse the store, we also collect information about the individual web pages or products you view.</p>
      <p>When you make a purchase or attempt to make a purchase, we collect the following personal information:</p>
      <ul>
        <li>Name, billing address, shipping address, email address, and phone number</li>
        <li>Payment information (credit / debit card numbers, UPI IDs) — processed securely via Razorpay and never stored on our servers</li>
        <li>Order history and preferences</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To fulfil and deliver your orders</li>
        <li>To communicate with you about your orders, returns, and account</li>
        <li>To send you marketing communications (only if you opt in)</li>
        <li>To improve and optimise our website using analytics</li>
        <li>To comply with applicable legal obligations</li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>We share your personal data only with:</p>
      <ul>
        <li><strong>Logistics partners</strong> — to deliver your orders (name, address, phone)</li>
        <li><strong>Payment processors</strong> — Razorpay, for secure transaction processing</li>
        <li><strong>Analytics providers</strong> — Google Analytics (anonymised data)</li>
      </ul>
      <p>We do not sell, rent, or trade your personal information to third parties.</p>

      <h2>Cookies</h2>
      <p>We use cookies to keep track of your cart, remember your preferences, and understand how you use our site. You can control cookies through your browser settings at any time.</p>

      <h2>Your Rights</h2>
      <p>You have the right to access, correct, or delete the personal data we hold about you. To exercise any of these rights, please contact us at <strong>privacy@hydrostore.in</strong>.</p>

      <h2>Contact</h2>
      <p>For any privacy-related questions, reach us at <strong>privacy@hydrostore.in</strong>.</p>
    `,
  },

  'terms-of-service': {
    title: 'Terms of Service',
    contentHtml: `
      <p><em>Last updated: May 2026</em></p>
      <p>By accessing or using the HydroStore website, you agree to be bound by these Terms of Service. Please read them carefully before placing an order.</p>

      <h2>1. Eligibility</h2>
      <p>You must be at least 18 years old to use this site. By using the site you represent that you are 18 or older.</p>

      <h2>2. Products & Pricing</h2>
      <p>We reserve the right to modify product listings and prices at any time without notice. Prices are listed in Indian Rupees (INR) inclusive of applicable GST, unless stated otherwise. We strive to ensure all product descriptions and prices are accurate; however, errors may occur. In the event of a pricing error, we will notify you and give you the option to proceed at the corrected price or cancel your order.</p>

      <h2>3. Orders & Payment</h2>
      <p>Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order at our sole discretion. Orders are confirmed only once payment is successfully processed and you receive a confirmation email.</p>
      <p>Accepted payment methods: credit/debit cards, UPI, net banking, and EMI (via Razorpay).</p>

      <h2>4. Intellectual Property</h2>
      <p>All content on this site — including images, copy, logos, and design — is the property of HydroStore and may not be reproduced without written permission.</p>

      <h2>5. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, HydroStore shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site or products purchased from it.</p>

      <h2>6. Governing Law</h2>
      <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.</p>

      <h2>7. Contact</h2>
      <p>Questions about these terms? Email us at <strong>legal@hydrostore.in</strong>.</p>
    `,
  },

  'about-us': {
    title: 'About Us',
    contentHtml: `
      <p class="lead">HydroStore was founded on a simple conviction: exceptional quality should not require a compromise — not on design, not on sustainability, and not on price.</p>

      <h2>Our Story</h2>
      <p>We started in 2026 as a small team of designers and product enthusiasts who were tired of choosing between "fast fashion" and unaffordable luxury. We built HydroStore to sit in the space between — a curated collection of premium products made from thoughtfully sourced materials, designed to last years rather than seasons.</p>
      <p>Every product in our catalogue goes through a rigorous selection process. We look at craftsmanship, material sourcing, brand ethics, and long-term durability before anything reaches our shelves.</p>

      <h2>What We Stand For</h2>
      <ul>
        <li><strong>Quality over quantity</strong> — we carry fewer SKUs on purpose. Every item earns its place.</li>
        <li><strong>Transparency</strong> — we tell you where things are made and what they're made from.</li>
        <li><strong>Sustainability</strong> — we partner with brands that prioritise responsible manufacturing and minimal packaging.</li>
        <li><strong>Fair access</strong> — premium should mean high-quality, not high-exclusivity.</li>
      </ul>

      <h2>Our Team</h2>
      <p>We're a team of 12 people spread across Mumbai and Bengaluru. We're product obsessives, weekend hikers, home cooks, and style enthusiasts — all united by a love for things that are made well.</p>

      <h2>Get in Touch</h2>
      <p>We love hearing from customers. Whether it's a product question, a brand collaboration, or just a hello — reach us at <strong>hello@hydrostore.in</strong> or visit our <a href="/contact">Contact page</a>.</p>
    `,
  },

  'sustainability': {
    title: 'Sustainability',
    contentHtml: `
      <p class="lead">We believe the best businesses leave the world better than they found it. Here's how we try to do that.</p>

      <h2>Responsible Sourcing</h2>
      <p>Before a brand or product joins HydroStore, we evaluate it on environmental and social criteria. We look for suppliers who pay fair wages, use non-toxic materials, and can demonstrate traceability in their supply chain.</p>

      <h2>Packaging</h2>
      <p>All our shipping materials are 100% recyclable or compostable. We use paper tape instead of plastic, and our protective packaging is made from recycled pulp. We've eliminated single-use plastic from our fulfilment centre entirely.</p>

      <h2>Carbon Footprint</h2>
      <p>We offset 100% of the carbon emissions from shipping every order via certified reforestation projects in the Western Ghats. You'll see a "Carbon Offset" label on every order confirmation.</p>

      <h2>Brand Partners</h2>
      <p>We actively prefer and promote brands that hold recognised certifications, such as:</p>
      <ul>
        <li>GOTS (Global Organic Textile Standard)</li>
        <li>Fair Trade Certified</li>
        <li>B Corp Certification</li>
        <li>OEKO-TEX Standard 100</li>
        <li>Recycled Content Standard (RCS)</li>
      </ul>

      <h2>Our Goal</h2>
      <p>By 2028, we aim to have 80% of our catalogue sourced from brands that are certified sustainable or in active pursuit of certification. We'll publish progress reports annually.</p>

      <h2>Tell Us More</h2>
      <p>Have a brand or initiative you think we should know about? We're always looking to discover more responsible businesses. Write to us at <strong>sustainability@hydrostore.in</strong>.</p>
    `,
  },
};

function titleFromHandle(handle: string): string {
  return handle.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

export async function loader({params, context}: LoaderFunctionArgs) {
  const handle = params.handle!;

  try {
    const {page} = await context.storefront.query(PAGE_QUERY, {
      variables: {handle},
    });

    if (page) return json({page});
  } catch {
    // Fall through to static / placeholder content below
  }

  // Use rich static content for known handles, generic placeholder otherwise
  const staticPage = STATIC_PAGES[handle] ?? {
    title: titleFromHandle(handle),
    contentHtml: `<p>This page is coming soon. In the meantime, please <a href="/contact">contact us</a> if you have any questions.</p>`,
  };

  return json({page: staticPage});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter mb-12">
          {page.title}
        </h1>
        <div
          className="prose prose-lg prose-neutral max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{__html: page.contentHtml}}
        />
      </div>
    </div>
  );
}
