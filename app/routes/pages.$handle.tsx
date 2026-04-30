/**
 * @file routes/pages.$handle.tsx
 * @description Dynamic Shopify CMS page route.
 * Renders content for pages like /pages/about, /pages/contact,
 * /pages/faq using the Storefront API `page` query.
 *
 * Create pages in Shopify Admin → Online Store → Pages.
 * The `body` field supports rich HTML content (Shopify rich text editor).
 */
import {json} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import type {MetaFunction} from '@remix-run/react';
import {useLoaderData} from '@remix-run/react';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const PAGE_QUERY = `#graphql
  query Page(
    $handle: String!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      seo {
        title
        description
      }
      updatedAt
    }
  }
` as const;

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = (data as any)?.page;
  return [
    {title: page?.seo?.title ?? page?.title ?? 'Page'},
    {name: 'description', content: page?.seo?.description ?? page?.bodySummary ?? ''},
  ];
};

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle,
      language: context.storefront.i18n.language,
      country: context.storefront.i18n.country,
    },
  });

  if (!page) {
    throw new Response(`Page "${handle}" not found`, {status: 404});
  }

  return json({page});
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PageRoute() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-12 md:py-20 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-8 flex items-center gap-1.5" aria-label="Breadcrumb">
        <a href="/" className="hover:text-brand-500 transition-colors">Home</a>
        <span>/</span>
        <span className="text-neutral-600 font-medium" aria-current="page">
          {page.title}
        </span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8 leading-tight">
        {page.title}
      </h1>

      {/* Shopify rich-text HTML — scoped with .prose */}
      <div
        className="prose prose-neutral prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-neutral-900
          prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-md"
        // Shopify's body field is trusted server-rendered HTML
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: page.body}}
      />

      {/* Last updated */}
      <p className="mt-12 text-xs text-neutral-400 border-t border-neutral-100 pt-6">
        Last updated:{' '}
        {new Date(page.updatedAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
