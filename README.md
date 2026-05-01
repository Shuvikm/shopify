# HydroStore — Premium Headless Shopify Storefront

Built with **Hydrogen** + **Remix** + **Tailwind CSS** + **GSAP**.

## 🚀 Project Progress & High-Converting Features

### 💎 Phase 1: High-Converting Foundations (Completed)
- [x] **Cinematic Hero**: Parallax background with entry animations.
- [x] **Sticky Add-to-Cart**: CTA remains visible on mobile/scroll.
- [x] **Urgency Triggers**: Flash Sale Countdown Timer & Low Stock Scarcity.
- [x] **Trust Architecture**: Payment Badges & Dynamic Delivery Estimates.
- [x] **Social Proof**: Integrated Reviews section with star ratings.

### 🎮 Phase 2: Advanced UI Interactions (Completed)
- [x] **GSAP "Added to Cart" Animation**: Button shrinks to a circular success state (yellow theme).
- [x] **Build Your Own Bundle**: Split-screen "Pick 3" logic with animated wave backgrounds.
- [x] **Smart Cart Drawer**: Progress bar for free shipping + in-cart upsells.
- [x] **Gallery Zoom**: High-end hover zoom on product images.

### 🛠️ Phase 3: Site Essentials & Social Proof (Completed)
- [x] **Premium Footer**: Newsletter signup & social integration.
- [x] **Legal Framework**: Dynamic policy pages and fallback content.
- [x] **Filter Sidebar**: Category and Sort logic for collections.
- [x] **Predictive Discovery**: Enhanced search UI with "Popular Searches" and discovery cards.
- [x] **Recent Purchase Popup**: Social proof notification ("Someone recently bought...") powered by GSAP.

---

## 🏁 Final Launch Checklist

1. [ ] **Storefront API**: Ensure `PUBLIC_STOREFRONT_API_TOKEN` is from a live Shopify Store.
2. [ ] **Checkout Settings**: Set up **Stripe** or **Razorpay** in Shopify Admin → Payments.
3. [ ] **Shipping Rules**: Define zones (e.g., India/Global) in Admin → Shipping.
4. [ ] **Policies**: Edit Privacy/Refund policies in Admin → Settings → Policies.
5. [ ] **SEO Check**: Verify all product meta-titles are keyword-optimized.

## 🧠 Interview Guide (Impressing HR)

> "I engineered a high-converting Hydrogen storefront focused on business metrics. I implemented advanced features like a **custom bundle builder**, **GSAP micro-animations** for cart interactions, and a **real-time social proof system** to increase conversion rates and average order value. The stack uses streaming SSR and deferred data fetching to ensure a sub-2s LCP on mobile."

---

A production-grade, headless Shopify storefront built with:

- **[Hydrogen v2](https://hydrogen.shopify.dev/)** (Remix-based)
- **Tailwind CSS v3** — utility-first styling with custom brand tokens
- **GraphQL Storefront API 2025-01** — fully typed queries
- **TypeScript (strict mode)** — end-to-end type safety
- **Headless UI** — accessible cart drawer, mobile menu, search overlay

---

## 🚀 Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Bundle (initial JS) | < 120 KB gzipped |

Achieved via: streaming SSR, deferred data, `fetchPriority="high"` on hero images, Tailwind purge, no heavy UI library.

---

## 📁 Project Structure

```
app/
├── components/
│   ├── cart/           # CartDrawer, CartLineItem, CartSummary
│   ├── layout/         # Header, Footer, MobileMenu
│   ├── product/        # ProductCard, ProductForm, ProductGallery,
│   │                   # ProductSpecs, QuickAddButton
│   └── search/         # PredictiveSearch, SearchResults
├── graphql/            # Typed GQL fragments & queries
├── hooks/              # useCart, usePredictiveSearch
├── lib/                # shopify.server, cart.server, session.server, utils
├── routes/             # Remix file-based routes
├── styles/             # app.css (Tailwind + design tokens)
├── entry.client.tsx
├── entry.server.tsx
├── root.tsx
└── server.ts
```

---

## ⚙️ Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd hydrogen-shopify-store
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_public_token
PUBLIC_STOREFRONT_API_VERSION=2025-01
SESSION_SECRET=a_random_secret_string
PUBLIC_CHECKOUT_DOMAIN=checkout.hydrogen.shop
```

### 3. Run dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## 🛍️ Core Features

### Product Detail Page (PDP)
- Route: `/products/:handle`
- RSC server loader with `PRODUCT_QUERY` (no client waterfall)
- Variant selection via URL search params (`?Color=Black&Size=M`)
- `ProductGallery` — thumbnail rail + hero image (`fetchPriority="high"`)
- `ProductForm` — option pills with sold-out cross-out + quantity stepper
- `QuickAddButton` — AJAX via `useFetcher`, optimistic shimmer, auto-opens cart drawer
- `ProductSpecs` — renders Metaobject `custom.product_specs` fields

### Metaobject: Product Specs

Create in **Shopify Admin → Settings → Custom data → Metaobjects**:

| Field | Type |
|---|---|
| `material` | Single-line text |
| `weight` | Single-line text |
| `dimensions` | Single-line text |
| `country_of_origin` | Single-line text |
| `warranty` | Single-line text |

Then link to a product under **Product → Metafields → product_specs**.

### Cart (AJAX Drawer)
- `CartDrawer` — Headless UI `Dialog`, slide-in from right
- `CartLineItem` — optimistic quantity stepper, remove with fade-out
- All mutations routed through `/cart` Remix action (no page reload)

### Predictive Search
- Hook: `usePredictiveSearch` — 300 ms debounce, `useFetcher` GET
- API route: `/api/predictive-search?q=<term>` (JSON, no HTML)
- Overlay: `PredictiveSearch` — full-screen modal, keyboard accessible

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary color | `#4f63f8` (brand-500) |
| Font | Inter (Google Fonts, `display=swap`) |
| Border radius | `--radius-md: 0.625rem` |
| Transition | `--transition-base: 250ms ease` |

Component classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.product-card`, `.skeleton`, `.badge`, `.input`

---

## 🧪 TypeScript Check

```bash
npm run typecheck
# should produce 0 errors
```

---

## 📦 Deploy to Oxygen (Shopify)

```bash
npx shopify hydrogen deploy
```

Or deploy to Vercel / Netlify using the `netlify.toml` config included.
