/**
 * @file routes/account.tsx
 * @description Amazon-style account dashboard with local order history links.
 */
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {ReactNode} from 'react';
import {getStoredOrders} from '~/lib/orders.server';

export const meta: MetaFunction = () => [
  {title: 'Your Account - HydroStore'},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const shopDomain = new URL(`https://${storefront.getApiUrl()}`).hostname
    .replace(/\/api\/.*/, '')
    .split('/')[0];

  return json({
    shopDomain,
    customerName: 'Guest',
    recentOrders: getStoredOrders(context.session).slice(0, 3),
  });
}

export default function AccountDashboard() {
  const {shopDomain, customerName, recentOrders} = useLoaderData<typeof loader>();

  const cards = [
    {
      title: 'Your Orders',
      desc: 'Track, return, or buy things again',
      href: '/account/orders',
      icon: PackageIcon,
    },
    {
      title: 'Login & Security',
      desc: 'Edit login, name, and mobile number',
      href: `https://${shopDomain}/account`,
      icon: LockIcon,
    },
    {
      title: 'Your Wishlist',
      desc: 'View and manage your saved items',
      href: '/wishlist',
      icon: HeartIcon,
    },
    {
      title: 'Your Addresses',
      desc: 'Edit addresses for orders and gifts',
      href: `https://${shopDomain}/account/addresses`,
      icon: PinIcon,
    },
    {
      title: 'Payment Options',
      desc: 'Edit or add payment methods',
      href: `https://${shopDomain}/account`,
      icon: CardIcon,
    },
    {
      title: 'Contact Us',
      desc: 'Talk to customer service',
      href: '/contact',
      icon: SupportIcon,
    },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Your Account</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Hello, <span className="font-bold text-neutral-800">{customerName}</span>. Manage your orders and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                className="bg-white border border-neutral-200 rounded-2xl p-6 flex gap-4 hover:bg-neutral-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Icon />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 pt-10 border-t border-neutral-200 grid md:grid-cols-2 gap-10">
          <section className="space-y-4">
            <h2 className="text-xl font-black text-neutral-900">Recent Activity</h2>
            {recentOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-3">
                <p className="text-neutral-400 text-sm italic">No recent orders to show.</p>
                <Link to="/collections/all" className="inline-block text-xs font-black text-brand-600 hover:underline uppercase tracking-widest">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden">
                {recentOrders.map((order) => (
                  <Link key={order.id} to={`/account/orders/${order.id}`} className="block px-6 py-4 hover:bg-neutral-50">
                    <p className="text-sm font-black text-neutral-900">{order.orderNumber}</p>
                    <p className="text-xs text-neutral-500 mt-1">{order.status.replace(/_/g, ' ')}</p>
                  </Link>
                ))}
              </div>
            )}
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

function BaseIcon({children}: {children: ReactNode}) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

function PackageIcon() {
  return <BaseIcon><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></BaseIcon>;
}

function LockIcon() {
  return <BaseIcon><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 10-8 0v4M5 11h14v10H5z" /></BaseIcon>;
}

function HeartIcon() {
  return <BaseIcon><path strokeLinecap="round" strokeLinejoin="round" d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" /></BaseIcon>;
}

function PinIcon() {
  return <BaseIcon><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.4 7-11a7 7 0 10-14 0c0 6.6 7 11 7 11z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 10a2 2 0 100-4 2 2 0 000 4z" /></BaseIcon>;
}

function CardIcon() {
  return <BaseIcon><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v10H3zM3 10h18" /></BaseIcon>;
}

function SupportIcon() {
  return <BaseIcon><path strokeLinecap="round" strokeLinejoin="round" d="M18 10a6 6 0 10-12 0v4a3 3 0 003 3h1m8-7v4a3 3 0 01-3 3h-1m-4 0h4" /></BaseIcon>;
}
