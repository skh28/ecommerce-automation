/**
 * Playwright fixture that provides the API request context and reusable
 * resource helpers. Request is bound into each resource so tests call
 * api.health.getHealth() and api.products.getProducts() with no extra args.
 */
import { test as base } from '@playwright/test';
import * as health from '../../../lib/api/resources/health';
import * as products from '../../../lib/api/resources/products';
import type { APIRequestContext } from '@playwright/test';

/** Build resource helpers with request bound. Keeps tests DRY and readable. */
function bindApiResources(request: APIRequestContext) {
  return {
    health: {
      getHealth: () => health.getHealth(request),
    },
    products: {
      getProducts: (params?: Parameters<typeof products.getProducts>[1]) =>
        products.getProducts(request, params),
      getProductById: (id: string) => products.getProductById(request, id),
      parseProductsList: products.parseProductsList,
    },
  };
}

type ApiFixture = {
  /** Reusable API: request context + resource helpers. Use api.request for raw calls. */
  api: {
    request: APIRequestContext;
  } & ReturnType<typeof bindApiResources>;
};

export const test = base.extend<ApiFixture>({
  api: async ({ request }, use) => {
    await use({
      request,
      ...bindApiResources(request),
    });
  },
});

export { expect } from '@playwright/test';
