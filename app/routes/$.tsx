/**
 * @file routes/$.tsx
 * @description Catch-all 404 route.
 * Matches any URL that no other route handles.
 * Renders a clean, branded "Page Not Found" page.
 */
import type {MetaFunction} from '@remix-run/react';
import {Link, useLocation} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export const meta: MetaFunction = () => [
  {title: '404 – Page Not Found'},
  {name: 'robots', content: 'noindex'},
];

/** Throw a 404 so Remix routes the correct HTTP status code. */
export async function loader({}: LoaderFunctionArgs): Promise<never> {
  throw new Response('Not Found', {status: 404});
}

export default function NotFound() {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-24">
      {/* Large 404 */}
      <p className="text-[120px] md:text-[180px] font-black leading-none text-neutral-100 select-none">
        404
      </p>

      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 -mt-6 mb-3">
        Page Not Found
      </h1>
      <p className="text-neutral-500 mb-2 max-w-md">
        The page{' '}
        <code className="text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded text-sm">
          {location.pathname}
        </code>{' '}
        doesn't exist or has been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link to="/" className="btn btn-primary px-6" prefetch="intent">
          Back to Home
        </Link>
        <Link to="/collections/all" className="btn btn-secondary px-6" prefetch="intent">
          Shop All Products
        </Link>
      </div>
    </div>
  );
}
