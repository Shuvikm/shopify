import {defer, json} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs, LinksFunction} from '@remix-run/server-runtime';
import {
  Await,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  type MetaFunction,
} from '@remix-run/react';
import {Suspense} from 'react';
import {getSelectedProductOptions, Analytics} from '@shopify/hydrogen';

import {PRODUCT_QUERY} from '~/graphql/ProductQuery';
import {COLLECTION_QUERY} from '~/graphql/CollectionQuery';
import {ProductGallery} from '~/components/product/ProductGallery';
import {ProductForm} from '~/components/product/ProductForm';
import {ProductCard, ProductCardSkeleton} from '~/components/product/ProductCard';
import {dedupeImages, dedupeProducts, getProductImage} from '~/lib/products';
import {withTimeout} from '~/lib/async.server';
import {getProductSchema} from '~/lib/seo';

export const links: LinksFunction = (args?: any) => {
  try {
    const product = args?.data?.product;
    const image = product ? getProductImage(product) : null;
    if (!image?.url) return [];
    return [
      {
        rel: 'preload',
        href: image.url,
        as: 'image',
        type: 'image/webp',
        imagesrcset: image.url,
        fetchpriority: 'high',
      } as any,
    ];
  } catch {
    return [];
  }
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  const product = data?.product;
  if (!product) return [{title: 'Product not found'}];

  return [
    {title: `${product.title} — The Collection`},
    {name: 'description', content: product.seo?.description ?? product.description?.slice(0, 155) ?? ''},
    {property: 'og:title', content: product.seo?.title ?? product.title},
    {property: 'og:description', content: product.seo?.description ?? product.description ?? ''},
    {property: 'og:image', content: product.featuredImage?.url ?? product.images?.nodes?.[0]?.url ?? ''},
    {property: 'og:type', content: 'product'},
  ];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Response('Not found', {status: 404});

  const {storefront} = context;
  const selectedOptions = getSelectedProductOptions(request);

  try {
    const {product} = await withTimeout(storefront.query(PRODUCT_QUERY, {
      cache: storefront.CacheShort(),
      variables: {
        handle,
        selectedOptions,
        language: storefront.i18n.language,
        country: storefront.i18n.country,
      },
    }), 7000, `product ${handle}`);

    if (!product?.id) {
      throw new Response(`Product "${handle}" not found`, {status: 404});
    }

    const relatedHandle = product.collections?.nodes?.[0]?.handle ?? 'all';
    const relatedProducts = withTimeout(storefront.query(COLLECTION_QUERY, {
      cache: storefront.CacheShort(),
      variables: {
        handle: relatedHandle,
        first: 5,
        language: storefront.i18n.language,
        country: storefront.i18n.country,
      },
    }), 7000, `related products ${handle}`).catch(() => ({collection: {products: {nodes: []}}}));

    return defer({product, relatedProducts});
  } catch (error) {
    if (error instanceof Response) throw error;
    throw json({message: 'Unable to retrieve selection.'}, {status: 502});
  }
}

export default function ProductPage() {
  const {product, relatedProducts} = useLoaderData<typeof loader>();

  const selectedVariant = product.selectedVariant ?? product.variants?.nodes?.[0] ?? null;
  const galleryImages = dedupeImages([
    ...(product.images?.nodes ?? []),
    ...(selectedVariant?.image ? [selectedVariant.image] : []),
  ]);
  const productForForm = {...product, selectedVariant};

  return (
    <div className="bg-paper min-h-screen">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-6 py-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
          <li><Link to="/" className="hover:text-brand-primary transition-colors">Home</Link></li>
          <li>/</li>
          <li><Link to="/collections/all" className="hover:text-brand-primary transition-colors">Archive</Link></li>
          <li>/</li>
          <li className="text-brand-primary truncate max-w-[200px]">{product.title}</li>
        </ol>
      </nav>

      <div className="container mx-auto px-6 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={galleryImages}
              selectedVariantImage={selectedVariant?.image ?? undefined}
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <div className="mb-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-4">
                  {product.vendor ?? 'The Collection'}
                </p>
                <h1 className="text-brand-primary mb-4 leading-tight">
                  {product.title}
                </h1>
                <div className="w-12 h-[1px] bg-brand-accent" />
              </div>

              <ProductForm product={productForForm} />
            </div>
          </div>
        </div>

        {/* Related Selection */}
        <div className="mt-32 pt-24 border-t border-brand-primary/5">
          <div className="text-center mb-16">
             <p className="text-[10px] uppercase tracking-[0.3em] text-brand-accent mb-4">Complete the Look</p>
             <h2 className="text-brand-primary">Related Selection</h2>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {Array.from({length: 4}).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          }>
            <Await resolve={relatedProducts}>
              {(resolved: any) => {
                const products = dedupeProducts(resolved?.collection?.products?.nodes ?? [])
                  .filter((related: any) => related.id !== product.id)
                  .slice(0, 4);

                return products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((related: any) => (
                      <ProductCard key={related.id} product={related} />
                    ))}
                  </div>
                ) : null;
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount ?? '0',
              vendor: product?.vendor ?? '',
              variantId: selectedVariant?.id ?? '',
              variantTitle: selectedVariant?.title ?? '',
              quantity: 1,
            },
          ],
        }}
      />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProductSchema(product, selectedVariant)),
        }}
      />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="container mx-auto px-6 py-32 text-center bg-paper min-h-screen">
      <p className="text-[10px] uppercase tracking-[0.4em] text-brand-accent mb-6">Error</p>
      <h2 className="text-brand-primary mb-8">
        {isRouteErrorResponse(error) && error.status === 404 ? 'Selection Not Found' : 'Unexpected Error'}
      </h2>
      <Link to="/collections/all" className="inline-flex px-10 py-4 bg-brand-primary text-white text-[10px] uppercase tracking-[0.2em] hover:bg-brand-accent transition-all duration-500">
        Return to Archive
      </Link>
    </div>
  );
}
