/**
 * Cart API. All endpoints require auth (session). Spec: GET/POST /api/cart,
 * PATCH/DELETE /api/cart/items/[itemId].
 */
import type { ApiRequestContext } from '../client';
import type { CartResponse } from '../types';
import { API_PREFIX } from '../constants';

const CART_PATH = `${API_PREFIX}/cart`;
const cartItemPath = (itemId: string) => `${CART_PATH}/items/${itemId}`;

/** GET /api/cart. Returns current user's cart. 401 if not logged in. */
export async function getCart(request: ApiRequestContext) {
  return request.get(CART_PATH);
}

/**
 * POST /api/cart. Add or update quantity. Body: productId (required), quantity (optional, default 1).
 * Returns full cart. 401 if not logged in; 400/404 on invalid product.
 */
export async function addToCart(
  request: ApiRequestContext,
  body: { productId: string; quantity?: number }
) {
  return request.post(CART_PATH, { data: body });
}

/**
 * PATCH /api/cart/items/[itemId]. Update quantity (0 = remove). itemId is cart item id, not product id.
 * Returns full cart. 404 if cart item not found.
 */
export async function updateCartItem(
  request: ApiRequestContext,
  itemId: string,
  body: { quantity: number }
) {
  return request.patch(cartItemPath(itemId), { data: body });
}

/** DELETE /api/cart/items/[itemId]. Returns full cart. 404 if cart item not found. */
export async function removeCartItem(request: ApiRequestContext, itemId: string) {
  return request.delete(cartItemPath(itemId));
}

/** Parse GET/POST/PATCH/DELETE cart response to typed cart. */
export async function parseCartResponse(
  response: Awaited<ReturnType<typeof getCart>>
): Promise<CartResponse | null> {
  if (!response.ok()) return null;
  try {
    return (await response.json()) as CartResponse;
  } catch {
    return null;
  }
}
