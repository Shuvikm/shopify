/**
 * @file routes/account.tsx
 * @description Amazon-style Account Dashboard with localized cards.
 */
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => [
  {title: 'Your Account — HydroStore'},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const shopDomain = new URL(`https://${storefront.getApiUrl()}`).hostname
    .replace(/\/api\/.*/, '')
    .split('/')[0];

  return json({
    shopDomain,
    customerName: 'Shuvik M', // Fallback for demonstration
  });
}

export default function AccountDashboard() {
  const {shopDomain, customerName} = useLoaderData<typeof loader>();

  const CARDS = [
    {
      title: 'Your Orders',
      desc: 'Track, return, or buy things again',
      icon: '📦',
      href: `https://${shopDomain}/account/orders`,
    },
    {
      title: 'Login & Security',
      desc: 'Edit login, name, and mobile number',
      icon: '🔐',
      href: `https://${shopDomain}/account`,
    },
    {
      title: 'Your Wishlist',
      desc: 'View and manage your saved items',
      icon: '♡',
      href: '/wishlist',
    },
    {
      title: 'Your Addresses',
      desc: 'Edit addresses for orders and gifts',
      icon: '📍',
      href: `https://${shopDomain}/account/addresses`,
    },
    {
      title: 'Payment Options',
      desc: 'Edit or add payment methods',
      icon: '💳',
      href: `https://${shopDomain}/account`,
    },
    {
      title: 'Contact Us',
      desc: 'Talk to our customer service',
      icon: '🎧',
      href: '/contact',
    },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Your Account</h1>
          <p className="text-neutral-500 text-sm mt-1">Hello, <span className="font-bold text-neutral-800">{customerName}</span>. Manage your orders and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="bg-white border border-neutral-200 rounded-2xl p-6 flex gap-4 hover:bg-neutral-50 transition-colors group"
            >
              <div className="text-3xl grayscale group-hover:grayscale-0 transition-all shrink-0">
                {card.icon}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-neutral-200 grid md:grid-cols-2 gap-10">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-neutral-900">Recent Activity</h2>
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-3">
              <p className="text-neutral-400 text-sm italic">No recent orders to show.</p>
              <Link to="/collections/all" className="inline-block text-xs font-black text-brand-600 hover:underline uppercase tracking-widest">
                Browse Products →
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-black text-neutral-900">Subscription & Privacy</h2>
            <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
              <a href={`https://${shopDomain}/account`} className="block px-6 py-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Email Preferences
              </a>
              <a href={`https://${shopDomain}/account`} className="block px-6 py-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Privacy Settings
              </a>
              <a href={`https://${shopDomain}/account`} className="block px-6 py-4 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Manage Data
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
