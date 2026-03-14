/**
 * Checkout API tests. Requires auth; without a session returns 401.
 */
import { test, expect } from './fixtures/api';
import { isApiConfigured } from '../../lib/config/env';

test.describe('Checkout API', () => {
  test.beforeEach(() => {
    if (!isApiConfigured()) {
      test.skip(true, 'API_BASE_URL (or BASE_URL) is not set in .env');
    }
  });

  test('POST /api/checkout returns 401 when not authenticated', async ({ api }) => {
    const response = await api.checkout.checkout();
    expect(response.status()).toBe(401);
  });
});
