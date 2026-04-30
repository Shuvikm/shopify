/**
 * @file routes/sitemap.xml.tsx
 * @description Auto-generated XML sitemap served at /sitemap.xml.
 * Proxies Shopify's built-in sitemap endpoint for better SEO.
 * Shopify generates a full sitemap including products, collections,
 * pages, and blog posts.
 */
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Shopify's Storefront API provides a sitemap at the store domain.
  // We proxy it so the sitemap is served from the custom domain.
  const response = await fetch(
    `https://${storefront.getApiUrl().replace(/\/api\/.*/, '')}/sitemap.xml`,
    {
      headers: {
        'Content-Type': 'application/xml',
        'User-Agent': request.headers.get('User-Agent') ?? 'Hydrogen',
      },
    },
  ).catch(() => null);

  if (!response?.ok) {
    // Fallback: minimal static sitemap
    const origin = new URL(request.url).origin;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${origin}/collections/all</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${origin}/search</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>
</urlset>`;
    return new Response(xml, {
      headers: {'Content-Type': 'application/xml; charset=utf-8'},
    });
  }

  const xml = await response.text();
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
