// Superseded by api.recommendations.tsx which uses Shopify's native productRecommendations API.
import {redirect, type LoaderFunctionArgs} from '@remix-run/server-runtime';
export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return redirect(`/api/recommendations?${url.searchParams.toString()}`, {status: 308});
}
