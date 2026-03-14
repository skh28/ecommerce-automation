/**
 * Product catalog API tests. Uses the shared api fixture and product
 * resource helpers so endpoint paths and parsing live in one place.
 * Customize assertions and paths to match your ecommerce API.
 */
import { test, expect } from './fixtures/api';
import { isApiConfigured } from '../../lib/config/env';

test.describe('Products API', () => {
  test.beforeEach(() => {
    if (!isApiConfigured()) {
      test.skip(true, 'API_BASE_URL (or BASE_URL) is not set in .env');
    }
  });

  test('GET /api/products returns a list', async ({ api }) => {
    const response = await api.products.getProducts();

    expect(response.ok(), 'Products list should return 2xx').toBeTruthy();

    const list = await api.products.parseProductsList(response);
    expect(Array.isArray(list)).toBeTruthy();
  });

  test('GET /api/products accepts limit and offset', async ({ api }) => {
    const response = await api.products.getProducts({ limit: 5, offset: 0 });
    expect(response.ok()).toBeTruthy();
    const list = await api.products.parseProductsList(response);
    const total = await api.products.parseProductsTotal(response);
    expect(Array.isArray(list)).toBeTruthy();
    expect(total).toBeGreaterThanOrEqual(0);
  });

  test('GET /api/products/[id] returns a single product when id exists', async ({ api }) => {
    const listResponse = await api.products.getProducts();
    if (!listResponse.ok()) {
      test.skip(true, 'Products list failed; cannot pick an id');
    }
    const list = await api.products.parseProductsList(listResponse);
    const firstId = list[0]?.id;
    if (!firstId) {
      test.skip(true, 'No products returned to test get by id');
    }

    const oneResponse = await api.products.getProductById(String(firstId));
    expect(oneResponse.ok()).toBeTruthy();
    const product = await oneResponse.json();
    expect(product).toHaveProperty('id');
    expect(product.id).toBe(firstId);
    // Spec: product has name, description, priceCents, imageUrl
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('priceCents');
    expect(Number.isInteger((product as { priceCents?: number }).priceCents)).toBeTruthy();
  });

  test('GET /api/products/[id] returns 404 for unknown id', async ({ api }) => {
    const response = await api.products.getProductById('clxxnonexistent000000000000');
    expect(response.status()).toBe(404);
    const body = await response.json().catch(() => ({}));
    expect(body).toHaveProperty('error');
  });
});
