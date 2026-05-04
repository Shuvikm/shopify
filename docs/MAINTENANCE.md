# Maintenance Guide

## Development
To start the development server:
```bash
npm run dev
```

## Building for Production
To build the project:
```bash
npm run build
```

## Type Checking
Always run type checks before committing:
```bash
npm run typecheck
```

## Environment Variables
Ensure `.env` contains:
- `PUBLIC_STORE_DOMAIN`: Your Shopify store domain (e.g., `store-name.myshopify.com`).
- `PUBLIC_STOREFRONT_API_TOKEN`: Your public storefront API token.
- `PUBLIC_STOREFRONT_API_VERSION`: API version (e.g., `2024-10`).
- `SESSION_SECRET`: A secret string for session cookies.

## Updating Content Security Policy (CSP)
If you add external resources (fonts, scripts, images), update the CSP in `app/entry.server.tsx`.
