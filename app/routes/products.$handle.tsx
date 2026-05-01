/**
 * @file routes/products.$handle.tsx
 * @description High-Converting Product Detail Page (PDP).
 */
import {defer} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, Await, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {getSelectedProductOptions, Analytics} from '@shopify/hydrogen';

import {PRODUCT_QUERY} from '~/graphql/ProductQuery';
import {COLLECTION_QUERY} from '~/graphql/CollectionQuery';
import {ProductGallery} from '~/components/product/ProductGallery';
import {ProductForm} from '~/components/product/ProductForm';
import {ProductSpecs} from '~/components/product/ProductSpecs';
import {ProductReviews} from '~/components/product/ProductReviews';
import {ProductCard} from '~/components/product/ProductCard';

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

import {MOCK_PRODUCTS} from '~/config/mock';

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle) throw new Response('Not found', {status: 404});

  // ─── Mock Product Handling ──────────────────────────────
  const mockProduct = MOCK_PRODUCTS.find(p => p.handle === handle);
  if (mockProduct) {
    return defer({
      product: mockProduct,
      relatedProducts: Promise.resolve({collection: {products: {nodes: MOCK_PRODUCTS.slice(0, 4)}}})
    });
  }

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

  // Cross-sell query (related products)
  const relatedProducts = storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: 'frontpage',
      first: 4,
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  });

  return defer({product, relatedProducts});
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const {product, relatedProducts} = useLoaderData<typeof loader>();

  const selectedVariant = product.selectedVariant ?? product.variants.nodes[0];
  const specsFields = product.metafield?.reference?.fields ?? [];

  return (
    <div className="container mx-auto px-6 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-neutral-400 mb-8 flex items-center gap-1.5" aria-label="Breadcrumb">
        <a href="/" className="hover:text-brand-500 transition-colors">Home</a>
        <span>/</span>
        <a href="/collections/all" className="hover:text-brand-500 transition-colors">Shop</a>
        <span>/</span>
        <span className="text-neutral-600 font-medium" aria-current="page">{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-24 mb-24">
        {/* Left — Gallery */}
        <div>
          <ProductGallery
            images={product.images.nodes}
            selectedVariantImage={selectedVariant?.image ?? undefined}
          />
        </div>

        {/* Right — Info + Form */}
        <div className="space-y-4">
          {product.vendor && (
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">
              {product.vendor}
            </p>
          )}

          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 leading-none tracking-tight">
            {product.title}
          </h1>

          {/* Social Proof badge */}
          <div className="flex items-center gap-2">
            <div className="text-yellow-400">★★★★★</div>
            <span className="text-xs font-bold text-neutral-500 underline">124 Reviews</span>
          </div>

          <ProductForm product={product} />

          {specsFields.length > 0 && (
            <ProductSpecs fields={specsFields} />
          )}
        </div>
      </div>

      {/* Social Proof — Reviews */}
      <ProductReviews metaobjectFields={product.reviewsMetafield?.reference?.fields} />

      {/* Cross-sell — People also bought */}
      <div className="border-t border-neutral-100 py-16 md:py-24">
        <h2 className="text-3xl font-black text-neutral-900 mb-12 text-center">People also bought</h2>
        <Suspense fallback={<div className="h-96 bg-neutral-50 animate-pulse rounded-2xl" />}>
          <Await resolve={relatedProducts}>
            {(resolved: any) => (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {resolved.collection?.products?.nodes.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </Await>
        </Suspense>
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
