/**
 * @file routes/robots[.txt].tsx
 * @description Dynamically generated robots.txt.
 * Returns different rules for production vs. development/preview.
 */
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isProduction = !url.hostname.includes('localhost') &&
    !url.hostname.includes('.trycloudflare.com') &&
    !url.hostname.includes('.myshopify.com');

  const robotsTxt = isProduction
    ? `User-agent: *
Allow: /

# Shopify default sitemaps
Sitemap: ${url.origin}/sitemap.xml`
    : `# Non-production environment — block all crawlers
User-agent: *
Disallow: /`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
