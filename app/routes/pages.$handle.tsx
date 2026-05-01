/**
 * @file routes/pages.$handle.tsx
 * @description Dynamic page route for legal and info pages.
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {PAGE_QUERY} from '~/graphql/PageQuery';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: data?.page?.title ?? 'Page'}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {handle: handle!},
  });

  if (!page) {
    // If page doesn't exist in Shopify, return a generic placeholder for demo
    return defer({
      page: {
        title: handle!.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        contentHtml: `<p>This is the <b>${handle}</b> page content. In a production store, you would edit this content in the Shopify Admin under Online Store > Pages.</p><p>We take our policies seriously and strive to provide the best service to our customers.</p>`,
      }
    });
  }

  return defer({page});
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
          className="prose prose-lg prose-neutral max-w-none prose-headings:font-black prose-headings:tracking-tight"
          dangerouslySetInnerHTML={{__html: page.contentHtml}}
        />
      </div>
    </div>
  );
}
