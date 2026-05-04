# Project Structure & Organization Guide

## Overview
This Shopify Hydrogen storefront follows Remix file-based routing with strict separation of concerns: **Layers → Features → Components**.

---

## Directory Structure

```
app/
├── components/              ← UI Layer (React components)
│   ├── index.ts            ← Barrel exports
│   ├── cart/
│   │   ├── index.ts
│   │   ├── CartDrawer.tsx         (Slide-in panel)
│   │   ├── CartLineItem.tsx       (Single cart item)
│   │   ├── CartSummary.tsx        (Totals & checkout)
│   │   └── FreeShippingBar.tsx    (Upsell banner)
│   ├── layout/
│   │   ├── index.ts
│   │   ├── Header.tsx             (Top navigation)
│   │   ├── Footer.tsx             (Footer content)
│   │   └── MobileMenu.tsx         (Responsive menu)
│   ├── product/
│   │   ├── index.ts
│   │   ├── ProductCard.tsx        (Grid item in collections)
│   │   ├── ProductForm.tsx        (Add to cart form)
│   │   ├── ProductGallery.tsx     (Image carousel)
│   │   ├── ProductReviews.tsx     (Customer reviews)
│   │   ├── ProductSpecs.tsx       (Details table)
│   │   ├── QuickAddButton.tsx     (AJAX add cart)
│   │   ├── StickyAddToCart.tsx    (Mobile floating CTA)
│   │   ├── StockLevel.tsx         (Availability)
│   │   ├── TrustBadges.tsx        (Security badges)
│   │   ├── DeliveryEstimate.tsx   (Shipping info)
│   │   └── UrgencyTimer.tsx       (FOMO timer)
│   ├── search/
│   │   ├── index.ts
│   │   ├── PredictiveSearch.tsx   (Real-time search)
│   │   └── SearchResults.tsx      (Results page)
│   └── sections/
│       ├── index.ts
│       ├── Hero.tsx               (Homepage banner)
│       └── FeaturedCategories.tsx (Category grid)
│
├── config/                 ← Application Constants & Metadata
│   ├── index.ts           ← Barrel exports
│   ├── constants.ts       (Global constants)
│   ├── performance.ts     (Performance thresholds)
│   └── categories.ts      (Category definitions)
│
├── graphql/               ← API Queries & Mutations
│   ├── index.ts           ← Barrel exports
│   ├── CartMutations.ts   (Add/update/remove items)
│   ├── CollectionQuery.ts (Fetch collections & products)
│   ├── ProductQuery.ts    (Single product details)
│   ├── PageQuery.ts       (CMS pages)
│   └── PredictiveSearchQuery.ts (Search)
│
├── hooks/                 ← Client-side Logic (React Hooks)
│   ├── index.ts           ← Barrel exports
│   ├── useCart.ts         (Cart drawer state + Hydrogen cart)
│   ├── usePredictiveSearch.ts (Search hook)
│   └── useWishlist.ts     (Wishlist/favorites)
│
├── lib/                   ← Shared Utilities & Helpers
│   ├── async.server.ts    (Timeout wrappers)
│   ├── cart.server.ts     (Server-side cart mutations)
│   ├── cart.client.ts     (Client-side fetch helpers)
│   ├── checkout.ts        (Checkout flow)
│   ├── invoice-pdf.server.ts (PDF generation)
│   ├── notifications.server.ts (Email/SMS)
│   ├── orders.server.ts   (Order history)
│   ├── products.ts        (Product helpers)
│   ├── razorpay.server.ts (Payment gateway)
│   ├── session.server.ts  (Cookie sessions)
│   ├── shopify.server.ts  (Hydrogen config)
│   ├── utils.ts           (Generic formatters)
│   └── index.ts           (Barrel exports)
│
├── routes/               ← Remix File-based Routing (page-level)
│   ├── _index.tsx        (Homepage: /)
│   ├── $.tsx             (404 fallback)
│   ├── account.tsx       (Account dashboard)
│   ├── account.login.tsx (Login page)
│   ├── account.authorize.tsx (OAuth callback)
│   ├── account.orders._index.tsx (Order list)
│   ├── account.orders.$orderId.tsx (Order detail)
│   ├── account.orders.$orderId.invoice[.]pdf.tsx (PDF invoice)
│   ├── api/
│   │   ├── predictive-search.tsx (Search API)
│   │   ├── razorpay.create-order.tsx (Payment API)
│   │   ├── razorpay.verify.tsx (Verify payment)
│   │   ├── recommendations.tsx (Recommendations API)
│   │   └── reviews.tsx (Reviews API)
│   ├── cart.tsx          (Cart page + action handler)
│   ├── checkout.success.tsx (Order confirmation)
│   ├── collections._index.tsx (All collections)
│   ├── collections.$handle.tsx (Single collection)
│   ├── contact.tsx       (Contact form)
│   ├── pages.$handle.tsx (CMS pages)
│   ├── policies.$handle.tsx (Legal pages)
│   ├── products.$handle.tsx (Product detail page)
│   ├── search.tsx        (Search results page)
│   ├── track.tsx         (Order tracking)
│   ├── wishlist.tsx      (Saved items)
│   ├── robots[.txt].tsx  (SEO robots.txt)
│   └── [sitemap.xml].tsx (SEO sitemap)
│
├── styles/              ← Global CSS
│   └── app.css          (Tailwind + custom CSS)
│
├── types/               ← Shared TypeScript Interfaces
│   └── index.ts         (Money, Cart, Product types)
│
├── root.tsx             ← Remix root layout (entry point)
├── entry.client.tsx     ← Client hydration entry
├── entry.server.tsx     ← Server rendering entry
└── server.ts            ← Oxygen/Hydrogen server setup

public/
├── robots.txt
├── assets/              ← Images (category icons, banners)
│   ├── category_*.png
│   └── hero_*.png

Root Files
├── package.json
├── tsconfig.json        ← TypeScript config (includes ignoreDeprecations for v5.5+)
├── vite.config.ts       ← Vite + Remix build config
├── remix.env.d.ts       ← Type definitions for Vite env
├── vite-env.d.ts        ← Vite asset type declarations
├── tailwind.config.ts   ← Tailwind CSS config
├── postcss.config.js    ← PostCSS + Tailwind setup
├── netlify.toml         ← Deployment config
└── server.ts            ← Express/Remix server entry
```

---

## Design Patterns & Best Practices

### 1. **Component Organization**
- **Barrel exports** (`index.ts`) in each directory for cleaner imports
- **Atomic components** (small, focused, reusable)
- **Named exports** (avoid default exports in feature dirs)

**Good:**
```tsx
import {CartDrawer, CartLineItem} from '~/components/cart';
```

**Bad:**
```tsx
import CartDrawer from '~/components/cart/CartDrawer';
```

---

### 2. **Server vs Client Logic**
- **`.server.ts`** files = Server-only (won't ship to browser)
- **`.client.ts`** files = Client-only (for fetch helpers)
- **Regular `.ts/.tsx`** = Universal (can run on both)

**Example:**
```
lib/
├── cart.server.ts  ← Hydrogen cart mutations (server only)
├── cart.client.ts  ← Fetch helpers for client forms
└── cart.ts         ← Shared types (both)
```

---

### 3. **Routing Conventions**
| File | Route |
|------|-------|
| `routes/_index.tsx` | `/` |
| `routes/cart.tsx` | `/cart` |
| `routes/collections.$handle.tsx` | `/collections/:handle` |
| `routes/account.orders.$orderId.tsx` | `/account/orders/:orderId` |
| `routes/[sitemap.xml].tsx` | `/sitemap.xml` |
| `routes/robots[.txt].tsx` | `/robots.txt` |

---

### 4. **Data Fetching Pattern**
```tsx
// Server-side loader (runs before render)
export async function loader({context, params}: LoaderFunctionArgs) {
  return defer({
    product: getProduct(params.handle),  // Streamed
    cart: getCart(context),               // Awaited
  });
}

// Client access
const data = useLoaderData<typeof loader>();
```

---

### 5. **Form Submissions**
```tsx
// Use useFetcher for AJAX (non-navigating forms)
const fetcher = useFetcher<{ok: boolean}>();

<fetcher.Form method="POST" action="/cart">
  <input name="cartAction" value="ADD_TO_CART" />
  <button type="submit">Add to Cart</button>
</fetcher.Form>
```

---

## Type Safety

### Import Order (Recommended)
```tsx
// 1. External packages
import {useEffect, useState} from 'react';
import {useLoaderData} from '@remix-run/react';

// 2. Relative components
import {CartDrawer} from '~/components/cart';
import {useCart} from '~/hooks/useCart';

// 3. Types (always last)
import type {CartLine} from '~/types';
```

---

## Common Tasks

### ✅ Adding a New Component
```
app/components/product/
├── NewComponent.tsx         (Implement)
└── index.ts                 (Add export)
```

Then import:
```tsx
import {NewComponent} from '~/components/product';
```

### ✅ Adding a New Route
Create `routes/my-page.tsx` and it's automatically `/my-page`

### ✅ Adding a New GraphQL Query
```
app/graphql/
├── MyQuery.ts               (New query)
└── index.ts                 (Export it)
```

### ✅ Adding a Server Helper
```
app/lib/my-helper.server.ts (Server-only)
```

---

## Build & Performance

### Code Splitting (Automatic)
- Routes are automatically code-split by Remix
- Components are bundled with their route
- No manual chunk management needed

### Tree Shaking
- Barrel exports (`index.ts`) only re-export used items
- Unused code is automatically removed during build

---

## Error Handling

### Server Errors
```tsx
export async function loader({context}: LoaderFunctionArgs) {
  try {
    return json({data: await fetchData()});
  } catch (error) {
    throw new Response('Not found', {status: 404});
  }
}
```

### Client Errors
```tsx
export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorPage error={error} />;
}
```

---

## Environment Variables

Stored in `.env`:
```
SESSION_SECRET=...
PUBLIC_STOREFRONT_API_TOKEN=...
PUBLIC_STORE_DOMAIN=...
PUBLIC_STOREFRONT_API_VERSION=2025-01
```

**Public vars** → prefixed with `PUBLIC_`
**Private vars** → prefix-less (server only)

---

## Key Takeaways

✅ **Use barrel exports** for cleaner imports  
✅ **Keep components small** and focused  
✅ **Centralize config** (categories, constants)  
✅ **Separate server/client logic** (.server.ts, .client.ts)  
✅ **Use type-safe forms** with fetcher  
✅ **Leverage Remix routing** (no manual routing needed)  
✅ **Stream async data** with `defer()` for faster perceived performance  
