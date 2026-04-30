/**
 * @file routes/policies.$handle.tsx
 * @description Shopify policy pages — Privacy Policy, Terms of Service,
 * Refund Policy, Shipping Policy, Legal Notice.
 *
 * Shopify stores policies at: shop.privacyPolicy, shop.termsOfService, etc.
 * Valid handles: privacy-policy | terms-of-service | refund-policy |
 *                shipping-policy | legal-notice
 */
import {json} from '@remix-run/server-runtime';
import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import type {MetaFunction} from '@remix-run/react';
import {useLoaderData, Link} from '@remix-run/react';

// ─── GraphQL ──────────────────────────────────────────────────────────────────

const POLICY_QUERY = `#graphql
  query Policy(
    $privacyPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $refundPolicy: Boolean!
    $legalNotice: Boolean!
    $language: LanguageCode
  ) @inContext(language: $language) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) { title body handle }
      shippingPolicy @include(if: $shippingPolicy) { title body handle }
      termsOfService @include(if: $termsOfService) { title body handle }
      refundPolicy @include(if: $refundPolicy) { title body handle }
      legalNotice @include(if: $legalNotice) { title body handle }
    }
  }
` as const;

/** Maps URL handle → GraphQL conditional boolean variable */
const HANDLE_TO_VARIABLE: Record<string, string> = {
  'privacy-policy': 'privacyPolicy',
  'shipping-policy': 'shippingPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
  'legal-notice': 'legalNotice',
};

/** All valid policy handles for the sidebar nav */
const ALL_POLICIES = [
  {handle: 'privacy-policy', label: 'Privacy Policy'},
  {handle: 'shipping-policy', label: 'Shipping Policy'},
  {handle: 'refund-policy', label: 'Refund Policy'},
  {handle: 'terms-of-service', label: 'Terms of Service'},
  {handle: 'legal-notice', label: 'Legal Notice'},
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

export const meta: MetaFunction<typeof loader> = ({data}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const policy = (data as any)?.policy;
  return [
    {title: policy?.title ?? 'Policy'},
    {name: 'robots', content: 'noindex'},
  ];
};

// ─── Loader ───────────────────────────────────────────────────────────────────

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  if (!handle || !HANDLE_TO_VARIABLE[handle]) {
    throw new Response(`Policy "${handle}" not found`, {status: 404});
  }

  const variableKey = HANDLE_TO_VARIABLE[handle];
  const variables = {
    privacyPolicy: false,
    shippingPolicy: false,
    termsOfService: false,
    refundPolicy: false,
    legalNotice: false,
    [variableKey]: true,
    language: context.storefront.i18n.language,
  };

  const {shop} = await context.storefront.query(POLICY_QUERY, {variables});

  // Pick whichever policy was fetched
  const policy =
    shop.privacyPolicy ??
    shop.shippingPolicy ??
    shop.termsOfService ??
    shop.refundPolicy ??
    shop.legalNotice;

  if (!policy?.body) {
    throw new Response(`Policy "${handle}" not configured in Shopify Admin`, {
      status: 404,
    });
  }

  return json({policy, handle});
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PolicyPage() {
  const {policy, handle} = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

        {/* Sidebar — Policy Links */}
        <aside className="lg:col-span-1">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
            Legal
          </h2>
          <nav className="flex flex-col gap-1" aria-label="Policy navigation">
            {ALL_POLICIES.map((p) => (
              <Link
                key={p.handle}
                to={`/policies/${p.handle}`}
                prefetch="intent"
                className={`text-sm px-3 py-2 rounded-lg transition-colors ${
                  handle === p.handle
                    ? 'bg-brand-50 text-brand-600 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Policy Body */}
        <main className="lg:col-span-3">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-8">
            {policy.title}
          </h1>
          <div
            className="prose prose-neutral max-w-none
              prose-headings:font-bold prose-headings:text-neutral-900
              prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{__html: policy.body}}
          />
        </main>
      </div>
    </div>
  );
}
