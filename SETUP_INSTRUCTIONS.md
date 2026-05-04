# Premium Hydrogen Storefront: Setup Instructions

This document provides the necessary steps to take this "Digital Agency" grade build from local development to a live revenue-generating business.

## 1. Shopify Admin Configuration

### A. Headless Sales Channel
1. Go to **Shopify Admin > Settings > Apps and sales channels**.
2. Search for and install the **Headless** sales channel.
3. Create a new storefront and copy the **Public Access Token**.
4. Set the **Storefront ID** and **Store Domain** (e.g., `your-store.myshopify.com`).

### B. Product & Collection Setup
1. Create a collection with the handle `all` to populate the main archive.
2. Ensure at least 10–20 products are active with high-quality images and benefit-driven descriptions.
3. (Optional) Use the provided `MockData.ts` patterns for inspiration on editorial copy.

## 2. Environment Variables (.env)

Update your `.env` file with the following keys:

```bash
# Shopify Storefront API
PUBLIC_STORE_DOMAIN="your-store.myshopify.com"
PUBLIC_STOREFRONT_API_TOKEN="your_access_token_here"
PUBLIC_STOREFRONT_ID="your_storefront_id"

# Payment (Razorpay)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_secret_..."

# Site Config
PUBLIC_CHECKOUT_DOMAIN="checkout.your-store.com"
```

## 3. Local Development

Run the following commands to start the development environment:

```bash
npm install
npm run dev
```

The store will be available at `http://localhost:3000`.

## 4. Deployment (Production)

We recommend deploying to **Shopify Oxygen** or **Vercel** for optimal performance.

1. **Oxygen:** Connect your GitHub repository to the Shopify Headless channel.
2. **Vercel:** Use the `@vercel/remix` adapter.

## 5. CRO & Advanced Features

- **Newsletter:** Configure your email service provider (e.g., Klaviyo) to listen to the `NewsletterPopup` submissions.
- **Abandoned Cart:** The `AbandonedCartNotifier` is active and triggers after 2 minutes of inactivity with items in the cart.
- **SEO:** All pages include `ld+json` schema. Ensure your Google Search Console is connected.
