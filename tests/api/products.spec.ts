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

  test('GET /products returns a list', async ({ api }) => {
    const response = await api.products.getProducts();

    expect(response.ok(), 'Products list should return 2xx').toBeTruthy();

    const list = await api.products.parseProductsList(response);
    // Relaxed: some APIs return empty list; strict checks can require list.length > 0
    expect(Array.isArray(list)).toBeTruthy();
  });

  test('GET /products/:id returns a single product when id exists', async ({ api }) => {
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
  });
});
