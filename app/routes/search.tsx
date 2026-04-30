/**
 * @file routes/search.tsx
 * @description Full search results page.
 * Runs PREDICTIVE_SEARCH_QUERY on the server (not predictive, full results).
 * Also accepts ?q= to pre-populate the search input.
 */
import {type LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {useLoaderData, Form, useNavigation, type MetaFunction} from '@remix-run/react';
import {PREDICTIVE_SEARCH_QUERY} from '~/graphql/PredictiveSearchQuery';
import {SearchResults} from '~/components/search/SearchResults';

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: `Search: ${data?.query ?? ''}` },
  {name: 'description', content: 'Search our product catalog'},
];

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') ?? '';

  if (!query.trim()) {
    return json({query, result: null});
  }

  const {predictiveSearch: result} = await context.storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        query,
        limit: 24,
        limitScope: 'EACH',
        types: ['PRODUCT', 'COLLECTION'],
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  return json({query, result: result ?? null});
}

export default function SearchPage() {
  const {query, result} = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSearching = navigation.state !== 'idle';

  const totalResults = (result?.products.length ?? 0) + (result?.collections.length ?? 0);

  return (
    <div className="container mx-auto py-10 md:py-14 max-w-4xl">
      <h1 className="text-4xl font-bold text-neutral-900 mb-8">Search</h1>

      {/* Search Form */}
      <Form method="GET" className="mb-10">
        <div className="flex gap-3 max-w-xl">
          <input
            id="search-page-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search products…"
            className="input flex-1 text-base"
            autoFocus={!query}
          />
          <button type="submit" className="btn btn-primary px-6">
            {isSearching ? 'Searching…' : 'Search'}
          </button>
        </div>
      </Form>

      {/* Results Count */}
      {query && !isSearching && (
        <p className="text-sm text-neutral-500 mb-6">
          {totalResults > 0
            ? `${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`
            : `No results for "${query}"`}
        </p>
      )}

      {/* Results */}
      {result && (
        <SearchResults results={result} query={query} />
      )}
    </div>
  );
}
