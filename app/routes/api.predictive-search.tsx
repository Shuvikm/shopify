/**
 * @file routes/api.predictive-search.tsx
 * @description Resource route (no UI) — returns JSON for predictive search.
 *
 * Called by `usePredictiveSearch` hook:
 *   GET /api/predictive-search?q=<term>
 *
 * Returns: { result: PredictiveSearchResult }
 */
import {type LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {
  PREDICTIVE_SEARCH_QUERY,
  type PredictiveSearchResult,
} from '~/graphql/PredictiveSearchQuery';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const query = url.searchParams.get('q') ?? '';
  const limit = Number(url.searchParams.get('limit') ?? 6);

  if (!query.trim()) {
    return json<{result: PredictiveSearchResult}>({
      result: {products: [], collections: [], pages: [], articles: []},
    });
  }

  const {predictiveSearch} = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables: {
      query,
      limit,
      limitScope: 'EACH',
      types: ['PRODUCT', 'COLLECTION'],
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return json<{result: PredictiveSearchResult}>({
    result: predictiveSearch ?? {products: [], collections: [], pages: [], articles: []},
  });
}
