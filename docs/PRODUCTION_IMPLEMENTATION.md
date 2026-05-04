# Production Implementation

## Folder Structure

```text
app/
  components/
    cart/
      CartDrawer.tsx
      CartLineItem.tsx
      CartSummary.tsx
      FreeShippingBar.tsx
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
    product/
      ProductCard.tsx
      ProductForm.tsx
      ProductGallery.tsx
      ProductReviews.tsx
      ProductSpecs.tsx
      QuickAddButton.tsx
      StickyAddToCart.tsx
    search/
      PredictiveSearch.tsx
      SearchResults.tsx
    sections/
      Hero.tsx
      FeaturedCategories.tsx
  graphql/
    CartMutations.ts
    CollectionQuery.ts
    PredictiveSearchQuery.ts
    ProductQuery.ts
  hooks/
    useCart.ts
    usePredictiveSearch.ts
    useWishlist.ts
  lib/
    cart.server.ts
    checkout.ts
    invoice-pdf.server.ts
    notifications.server.ts
    orders.server.ts
    products.ts
    razorpay.server.ts
    session.server.ts
    shopify.server.ts
    utils.ts
  routes/
    _index.tsx
    api.predictive-search.tsx
    api.razorpay.create-order.tsx
    api.razorpay.verify.tsx
    api.recommendations.tsx
    api.reviews.tsx
    account.tsx
    account.orders._index.tsx
    account.orders.$orderId.tsx
    account.orders.$orderId.invoice[.]pdf.tsx
    cart.tsx
    checkout.success.tsx
    collections._index.tsx
    collections.$handle.tsx
    products.$handle.tsx
    search.tsx
    track.tsx
```

## Storefront Data Flow

- Homepage, collection, product, wishlist, predictive search, and recommendation loaders use Storefront API queries with `storefront.CacheShort()`.
- Product grids pass responses through `dedupeProducts`, which removes duplicate product IDs and duplicate image URLs before rendering.
- `ProductCard` and `ProductGallery` use real Shopify images first and fall back to a local asset only when Shopify has no image or the image fails to load.
- Collection pages validate every connection before rendering, so missing `nodes`, `filters`, or `pageInfo` cannot trigger `Cannot read properties of undefined`.
- Product pages include route-level error handling and render safe empty states for related products and reviews.

## Razorpay Setup

1. Create Razorpay API keys in Razorpay Dashboard.
2. Add these environment variables:

```env
PUBLIC_RAZORPAY_KEY_ID="rzp_live_or_test_key_id"
RAZORPAY_KEY_ID="rzp_live_or_test_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

3. The cart calls `POST /api/razorpay/create-order`.
4. The server validates the current Hydrogen cart, recalculates totals in `app/lib/checkout.ts`, and creates a Razorpay order from `app/lib/razorpay.server.ts`.
5. The browser opens Razorpay Checkout with the server-created order ID.
6. Razorpay returns payment IDs to the browser, then the browser calls `POST /api/razorpay/verify`.
7. The server verifies the HMAC signature, saves the order in the session via `app/lib/orders.server.ts`, clears the cart, and redirects to `/checkout/success?orderId=...`.

## Orders, Tracking, and Invoice

- `/account/orders` lists verified orders.
- `/account/orders/:orderId` shows order details and totals.
- `/account/orders/:orderId/invoice.pdf` generates a PDF invoice without client-side dependencies.
- `/track` validates the order number plus email or phone before showing tracking updates.

## Notifications

Notifications are non-blocking. `api.razorpay.verify` uses `context.waitUntil` to queue:

```env
SENDGRID_API_KEY=""
ORDER_FROM_EMAIL="orders@example.com"
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_FROM_PHONE=""
RUFLOW_ORDER_WEBHOOK_URL=""
```

If a provider is not configured, that notification is skipped without slowing checkout.
