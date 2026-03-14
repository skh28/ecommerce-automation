# Ecommerce Automation

API automation for the ecommerce app. Uses [Playwright](https://playwright.dev/) to run contract and behavior tests against the REST API. No browser for API tests; optional UI tests use Chromium.

---

## What We Have So Far

- **API test framework** – Reusable client, types, and resource helpers aligned with the ecommerce API spec (base `http://localhost:3000/api`, session auth via NextAuth).
- **Config** – Base URL and optional token from `.env`; single place for env in `lib/config/env.ts`.
- **Resources** – One module per area: auth, products, cart, checkout, orders, health. Paths and request/response shapes live in `lib/api/` so tests stay thin.
- **Specs** – Tests for all spec endpoints:
  - **Health** – `GET /api/health` (skipped if app doesn’t expose it).
  - **Products** – List, list with limit/offset, get by id, 404 for unknown id.
  - **Auth** – Signup (201, 400 validation, 409 duplicate email).
  - **Cart** – GET/POST/PATCH/DELETE return 401 when unauthenticated.
  - **Checkout** – POST returns 401 when unauthenticated.
  - **Orders** – GET list and GET by id return 401 when unauthenticated.
- **Fixture** – `api` fixture injects `request` plus bound helpers (`api.products`, `api.cart`, etc.) so tests call e.g. `api.products.getProducts()` with no extra args.
- **Playwright config** – Separate “api” project (no browser, baseURL from env); Chromium project ignores `tests/api/` so `npm run test:api` only runs API tests.

---

## Prerequisites

- **Node.js** (LTS) and npm  
- Ecommerce API running (e.g. `http://localhost:3000`) or set `API_BASE_URL` in `.env` to your API origin.

---

## Setup

```bash
# Install dependencies
npm install

# Configure API base URL (required for API tests)
cp .env.example .env
# Edit .env and set API_BASE_URL=http://localhost:3000 (or your API origin)
```

---

## Scripts

| Script | Command | Description |
|--------|--------|--------------|
| `npm test` | `playwright test` | Run all tests (API + UI). |
| `npm run test:api` | `playwright test tests/api` | Run only API tests (no browser). |
| `npm run test:e2e` | `playwright test tests/ui` | Run only UI (browser) tests. |
| `npm run test:ui` | `playwright test --ui` | Open Playwright UI to run and debug tests. |

---

## Project Structure

```
.
├── .env                    # Your config (create from .env.example; not committed)
├── .env.example            # Template for API_BASE_URL, optional API_TOKEN
├── playwright.config.ts    # Playwright config; loads env, defines api + chromium projects
├── package.json
├── lib/
│   ├── config/
│   │   └── env.ts          # Loads .env; exports apiBaseUrl, apiToken, isApiConfigured()
│   ├── api/
│   │   ├── constants.ts    # API_PREFIX = '/api'
│   │   ├── types.ts        # Product, CartResponse, SignupRequest, etc.
│   │   ├── client.ts       # Default headers / request options
│   │   └── resources/      # Endpoint helpers (auth, products, cart, checkout, orders, health)
│   └── README.md           # Detailed lib/ and resource usage
├── tests/
│   ├── api/                # API tests (no browser)
│   │   ├── fixtures/
│   │   │   └── api.ts      # Fixture: injects api (request + resource helpers)
│   │   ├── health.spec.ts
│   │   ├── products.spec.ts
│   │   ├── auth.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── orders.spec.ts
│   └── ui/                 # UI (E2E) tests (Chromium)
│       └── home.spec.ts    # Example: home page, navigation
└── README.md               # This file
```

---

## How API Tests Run

1. **Config** – `playwright.config.ts` imports `lib/config/env.ts`, which loads `.env` and sets `apiBaseUrl` (and optional `apiToken`).
2. **Project** – Only the **api** project runs for files under `tests/api/`. It uses `baseURL` from env and no browser.
3. **Fixture** – Each test receives `api`: the Playwright `request` context plus bound resource helpers (e.g. `api.products.getProducts()`).
4. **Requests** – Calls like `api.products.getProducts()` resolve to `baseURL + /api/products` (e.g. `http://localhost:3000/api/products`). Auth for protected routes is session-based; use storage state from a browser login for full flows.

See [lib/README.md](lib/README.md) for adding resources and using the fixture.

---

## UI (E2E) tests

Browser tests live under **`tests/ui/`** and run in Chromium. They use **baseURL** from `.env`: `UI_BASE_URL` if set, otherwise `API_BASE_URL` (same origin as the API is typical).

### How to create UI tests

1. **Add a spec file** under `tests/ui/`, e.g. `tests/ui/cart.spec.ts`.
2. **Use `page`** (and optional fixtures). Prefer [role-based selectors](https://playwright.dev/docs/locators#locate-by-role): `page.getByRole('link', { name: 'Cart' })`, `page.getByRole('button', { name: 'Add to cart' })`.
3. **Use relative URLs** so baseURL is applied: `await page.goto('/')`, `await page.goto('/products')`.
4. **Run** with `npm run test:e2e` or open `npm run test:ui` to run/debug in the Playwright UI.

Example:

```ts
import { test, expect } from '@playwright/test';

test('add to cart from product page', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await expect(page.getByRole('link', { name: /cart/i })).toBeVisible();
});
```

For flows that require login, use [storage state](https://playwright.dev/docs/auth): log in once (in a setup or global setup), save storage state to a file, then in config or a fixture use `storageState: 'path/to/state.json'` so tests start already authenticated.

---

## CI

A workflow runs Playwright on push/PR (see `.github/workflows/playwright.yml`). To run API tests in CI, set `API_BASE_URL` in the workflow (e.g. to a deployed API or a URL from a prior job that starts the app).

---

## Next Steps (Optional)

- **Authenticated flows** – Use storage state from a browser login to test cart → checkout → orders with a real session.
- **Smoke subset** – Tag a few tests (e.g. health + products + signup) and add `npm run test:api:smoke` for fast checks.
- **E2E UI** – Add more specs under `tests/ui/` (cart, checkout, auth) and use storage state for logged-in flows.
