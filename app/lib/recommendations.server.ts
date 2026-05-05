// Stub — Shopify-native recommendations are served via api.recommendations.tsx
// using the productRecommendations Storefront API query.
export async function getRecommendations(_options: {userId?: string; limitToCategory?: string; exclude?: string[]; limit?: number}) {
  return [];
}
export async function getTrendingProducts(_limit = 12) {
  return [];
}
export async function getPersonalizedRecommendations(_userId: string, _limit = 12) {
  return [];
}
