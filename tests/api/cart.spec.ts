/**
 * Cart API tests. All endpoints require auth; without a session they return 401.
 */
import { test, expect } from './fixtures/api';
import { isApiConfigured } from '../../lib/config/env';

test.describe('Cart API', () => {
  test.beforeEach(() => {
    if (!isApiConfigured()) {
      test.skip(true, 'API_BASE_URL (or BASE_URL) is not set in .env');
    }
  });

  test('GET /api/cart returns 401 when not authenticated', async ({ api }) => {
    const response = await api.cart.getCart();
    expect(response.status()).toBe(401);
  });

  test('POST /api/cart returns 401 when not authenticated', async ({ api }) => {
    const response = await api.cart.addToCart({
      productId: 'clxx00000000000000000000000',
      quantity: 1,
    });
    expect(response.status()).toBe(401);
  });

  test('PATCH /api/cart/items/[itemId] returns 401 when not authenticated', async ({ api }) => {
    const response = await api.cart.updateCartItem('clxx00000000000000000000000', {
      quantity: 2,
    });
    expect(response.status()).toBe(401);
  });

  test('DELETE /api/cart/items/[itemId] returns 401 when not authenticated', async ({ api }) => {
    const response = await api.cart.removeCartItem('clxx00000000000000000000000');
    expect(response.status()).toBe(401);
  });
});
