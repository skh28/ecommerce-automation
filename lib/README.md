# API automation framework (lib)

Reusable layer aligned with the **ecommerce API spec** (base `http://localhost:3000/api`, session auth via NextAuth).

## Layout

- **`config/env.ts`** – `apiBaseUrl`, `apiToken`, `isApiConfigured()`. Base URL is the origin only (e.g. `http://localhost:3000`); routes use `/api` prefix in code.
- **`api/constants.ts`** – `API_PREFIX = '/api'` for all spec routes.
- **`api/types.ts`** – Spec-aligned types: `Product`, `CartResponse`, `OrderDetailResponse`, `SignupRequest`, etc. IDs are CUIDs; money in cents; dates ISO 8601.
- **`api/client.ts`** – Default headers and request options (auth, JSON).
- **`api/resources/`** – Endpoint helpers:
  - **auth** – `POST /api/auth/signup`
  - **products** – `GET /api/products`, `GET /api/products/[id]`
  - **cart** – `GET/POST /api/cart`, `PATCH/DELETE /api/cart/items/[itemId]`
  - **checkout** – `POST /api/checkout`
  - **orders** – `GET /api/orders`, `GET /api/orders/[id]`
  - **health** – optional `GET /api/health` (not in spec)

## Usage in tests

1. Use the **API fixture** in `tests/api/fixtures/api.ts`: inject `api` and call e.g. `api.products.getProducts()`, `api.cart.getCart()`, `api.auth.signup({ email, password, name })`.
2. Set **`.env`**: `API_BASE_URL=http://localhost:3000` (no `/api`).
3. **Auth**: Endpoints under cart, checkout, orders require a session. Use Playwright storage state from a browser login, or a test-only auth mechanism if available.
4. Run API tests: `npm run test:api`.

## Adding a new resource

1. Add a file under `api/resources/` (paths use `API_PREFIX`).
2. Implement functions taking `ApiRequestContext` and returning `request.get/post/...`.
3. Re-export in `api/resources/index.ts` and add to the fixture in `tests/api/fixtures/api.ts`.
