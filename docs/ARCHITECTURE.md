# Architecture Overview

This project is a high-performance e-commerce storefront built with **Shopify Hydrogen** and **Remix**.

## Tech Stack
- **Framework**: Remix (Hydrogen variant)
- **Runtime**: Oxygen (Shopify's hosted worker runtime)
- **Styling**: Tailwind CSS
- **Animations**: GSAP
- **Data Source**: Shopify Storefront API

## Data Flow
1. **Loaders**: Fetch data server-side from the Shopify Storefront API using the `storefront` client.
2. **Components**: Render the UI using React.
3. **Actions**: Handle form submissions (like Add to Cart) server-side.
4. **Hydration**: The app hydrates on the client for interactivity.

## Key Directories
- `app/routes`: Contains the page routes and their loaders/actions.
- `app/components`: Reusable UI components.
- `app/lib`: Utility functions and server-side logic (sessions, shopify client).
- `app/graphql`: GraphQL queries and mutations for the Storefront API.
