# HydroStore — Hydrogen + Remix Headless Shopify

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
