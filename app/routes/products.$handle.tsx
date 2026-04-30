/**
 * @file routes/products.$handle.tsx
 * @description Product Detail Page (PDP).
 *
 * Architecture:
 * - Server loader: runs the `PRODUCT_QUERY` RSC-style (no client waterfall)
 * - Selected variant is derived from URL search params (?Color=Black&Size=M)
 * - Streams with `defer()` — metadata resolves first, description HTML defers
 * - SEO: title/description from product.seo with storefront fallback
 * - MetaobjectSpecs: renders only if product_specs metafield is present
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, Await, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {getSelectedProductOptions, Analytics} from '@shopify/hydrogen';

import {PRODUCT_QUERY} from '~/graphql/ProductQuery';
import {ProductGallery} from '~/components/product/ProductGallery';
import {ProductForm} from '~/components/product/ProductForm';
import {ProductSpecs} from '~/components/product/ProductSpecs';

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const product = data?.product;
  if (!product) return [{title: 'Product not found'}];

  return [
    {title: product.seo?.title ?? product.title},
    {name: 'description', content: product.seo?.description ?? product.description?.slice(0, 155)},
    {property: 'og:title', content: product.seo?.title ?? product.title},
    {property: 'og:description', content: product.seo?.description ?? ''},
    {property: 'og:image', content: product.featuredImage?.url ?? ''},
    {property: 'og:type', content: 'product'},
  ];
};

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});

  const {storefront} = context;
  const selectedOptions = getSelectedProductOptions(request);

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions,
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  });

  if (!product?.id) {
    throw new Response(`Product "${handle}" not found`, {status: 404});
  }

  return defer({product});
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const {product} = useLoaderData<typeof loader>();

  const selectedVariant = product.selectedVariant ?? product.variants.nodes[0];
  const specsFields = product.metafield?.reference?.fields ?? [];

  return (
    <div className="container mx-auto py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-8 flex items-center gap-1.5" aria-label="Breadcrumb">
        <a href="/" className="hover:text-brand-500 transition-colors">Home</a>
        <span>/</span>
        <a href="/collections/all" className="hover:text-brand-500 transition-colors">Shop</a>
        <span>/</span>
        <span className="text-neutral-600 font-medium" aria-current="page">{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Left — Gallery */}
        <div>
          <ProductGallery
            images={product.images.nodes}
            selectedVariantImage={selectedVariant?.image ?? undefined}
          />
        </div>

        {/* Right — Info + Form */}
        <div className="space-y-4">
          {/* Vendor */}
          {product.vendor && (
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
              {product.vendor}
            </p>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
            {product.title}
          </h1>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.slice(0, 5).map((tag: string) => (
                <span
                  key={tag}
                  className="badge bg-neutral-100 text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Product Form (variant selector + add to cart) */}
          <ProductForm product={product} />

          {/* Product Specs from Metaobject */}
          {specsFields.length > 0 && (
            <ProductSpecs fields={specsFields} />
          )}
        </div>
      </div>

      {/* Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount ?? '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id ?? '',
              variantTitle: selectedVariant?.title ?? '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}
