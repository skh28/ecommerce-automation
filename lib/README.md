# API automation framework (lib)

Reusable pieces for ecommerce API tests. Use these from specs and fixtures so endpoint and config changes stay in one place.

## Layout

- **`config/env.ts`** – Single source for env: `apiBaseUrl`, `apiToken`, `isApiConfigured()`. Loads `.env` from project root.
- **`api/client.ts`** – Default headers and request options (e.g. auth, JSON). Use when building custom API calls.
- **`api/types.ts`** – Shared TypeScript types (e.g. `Product`, `ApiSuccess`, `PaginatedResponse`). Align with your API contracts.
- **`api/resources/`** – Endpoint helpers (health, products, etc.). Each module exposes functions that take `request` and return Playwright `APIResponse`. Add new resources (cart, orders, auth) here.

## Usage in tests

1. Use the **API fixture** in `tests/api/fixtures/api.ts`: inject `api` and call `api.health.getHealth(api.request)`, `api.products.getProducts(api.request)`, etc.
2. Set **`.env`** from `.env.example`: at least `API_BASE_URL`; optionally `API_TOKEN` for protected routes.
3. Run API tests: `npm run test:api`.

## Adding a new resource

1. Add a new file under `api/resources/`, e.g. `cart.ts`.
2. Implement functions that accept `ApiRequestContext` (from `../client`) and return `request.get/post/put/delete(...)`.
3. Re-export in `api/resources/index.ts` and add the module to the `api` fixture in `tests/api/fixtures/api.ts`.

This keeps tests thin and reusable across suites.
