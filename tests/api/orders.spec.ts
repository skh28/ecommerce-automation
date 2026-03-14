/**
 * Orders API tests. All endpoints require auth; without a session they return 401.
 */
import { test, expect } from './fixtures/api';
import { isApiConfigured } from '../../lib/config/env';

test.describe('Orders API', () => {
  test.beforeEach(() => {
    if (!isApiConfigured()) {
      test.skip(true, 'API_BASE_URL (or BASE_URL) is not set in .env');
    }
  });

  test('GET /api/orders returns 401 when not authenticated', async ({ api }) => {
    const response = await api.orders.getOrders();
    expect(response.status()).toBe(401);
  });

  test('GET /api/orders/[id] returns 401 when not authenticated', async ({ api }) => {
    const response = await api.orders.getOrderById('clxx00000000000000000000000');
    expect(response.status()).toBe(401);
  });
});
