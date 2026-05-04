/**
 * @file routes/collections._index.tsx
 * @description Collections listing page — /collections
 * Shows all active collections as a visual grid with cover images.
 * Useful for browsing by category.
 */
import {json} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {withTimeout} from '~/lib/async.server';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $first: Int!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    collections(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
        seo {
          title
          description
        }
      }
    }
  }
` as const;

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const meta: MetaFunction = () => [
  {title: 'All Collections — Shop by Category'},
  {name: 'description', content: 'Browse our full range of product collections.'},
];

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({context}: LoaderFunctionArgs) {
  try {
    const {collections} = await withTimeout(context.storefront.query(COLLECTIONS_QUERY, {
      cache: context.storefront.CacheShort(),
      variables: {
        first: 24,
        language: context.storefront.i18n.language,
        country: context.storefront.i18n.country,
      },
    }), 7000, 'collections index');

    return json({collections: collections?.nodes ?? []});
  } catch (error) {
    console.error('Collections index loader error:', error);
    return json({collections: []});
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CollectionsIndex() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-10 md:py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">Collections</h1>
        <p className="text-neutral-500">Browse our full range of product categories.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection: typeof collections[number]) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            prefetch="intent"
            className="group relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/3] flex items-end p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label={`Browse ${collection.title}`}
          >
            {/* Cover image */}
            {collection.image ? (
              <Image
                data={collection.image}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-brand-600" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                {collection.title}
              </h2>
              {collection.description && (
                <p className="text-sm text-white/70 line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="text-center py-24">
          <p className="text-neutral-400 text-lg">No collections found.</p>
          <p className="text-neutral-400 text-sm mt-1">
            Create collections in your Shopify Admin to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
