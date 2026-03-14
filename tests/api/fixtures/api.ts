/**
 * Playwright fixture: API request context + spec-aligned resource helpers.
 * Request is bound so tests call e.g. api.products.getProducts(), api.cart.getCart().
 * Auth is session-based (NextAuth); for protected endpoints use storage state from a browser login.
 */
import { test as base } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import * as auth from '../../../lib/api/resources/auth';
import * as cart from '../../../lib/api/resources/cart';
import * as checkout from '../../../lib/api/resources/checkout';
import * as health from '../../../lib/api/resources/health';
import * as orders from '../../../lib/api/resources/orders';
import * as products from '../../../lib/api/resources/products';

function bindApiResources(request: APIRequestContext) {
  return {
    auth: {
      signup: (body: Parameters<typeof auth.signup>[1]) => auth.signup(request, body),
      parseSignupResponse: auth.parseSignupResponse,
    },
    cart: {
      getCart: () => cart.getCart(request),
      addToCart: (body: Parameters<typeof cart.addToCart>[1]) => cart.addToCart(request, body),
      updateCartItem: (itemId: string, body: { quantity: number }) =>
        cart.updateCartItem(request, itemId, body),
      removeCartItem: (itemId: string) => cart.removeCartItem(request, itemId),
      parseCartResponse: cart.parseCartResponse,
    },
    checkout: {
      checkout: () => checkout.checkout(request),
      parseCheckoutResponse: checkout.parseCheckoutResponse,
    },
    health: {
      getHealth: () => health.getHealth(request),
    },
    orders: {
      getOrders: (params?: Parameters<typeof orders.getOrders>[1]) =>
        orders.getOrders(request, params),
      getOrderById: (id: string) => orders.getOrderById(request, id),
      parseOrdersListResponse: orders.parseOrdersListResponse,
      parseOrderDetailResponse: orders.parseOrderDetailResponse,
    },
    products: {
      getProducts: (params?: Parameters<typeof products.getProducts>[1]) =>
        products.getProducts(request, params),
      getProductById: (id: string) => products.getProductById(request, id),
      parseProductsList: products.parseProductsList,
      parseProductsTotal: products.parseProductsTotal,
    },
  };
}

type ApiFixture = {
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
