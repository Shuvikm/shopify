import type {MetaFunction} from '@remix-run/react';
import {Link} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export const meta: MetaFunction = () => [
  {title: '404 – Selection Not Found'},
  {name: 'robots', content: 'noindex'},
];

export async function loader({}: LoaderFunctionArgs): Promise<never> {
  throw new Response('Not Found', {status: 404});
}

export default function NotFound() {
  return (
    <div className="bg-paper flex flex-col items-center justify-center min-h-[80vh] text-center px-6 py-24">
      <p className="text-[10px] uppercase tracking-[0.5em] text-brand-accent mb-8">
        Selection Not Found
      </p>
      
      <h1 className="text-brand-primary mb-12">
        A Timeless Error
      </h1>
      
      <p className="text-neutral-500 font-light max-w-md mx-auto mb-16 leading-relaxed">
        The archive you are seeking is currently unavailable or has been relocated. We invite you to return to our curated collections.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <Link 
          to="/" 
          className="px-12 py-5 bg-brand-primary text-white text-[10px] uppercase tracking-[0.3em] hover:bg-brand-accent transition-all duration-700 shadow-xl shadow-brand-primary/5"
        >
          Return to Entry
        </Link>
        <Link 
          to="/collections/all" 
          className="text-brand-primary text-[10px] uppercase tracking-[0.3em] border-b border-brand-primary/20 hover:border-brand-primary transition-all pb-1"
        >
          View Full Archive
        </Link>
      </div>
      
      {/* Decorative */}
      <div className="mt-24 w-[1px] h-12 bg-brand-accent/30" />
    </div>
  );
}
