/**
 * Checkout API. Creates order from current cart and clears cart. Requires auth.
 */
import type { ApiRequestContext } from '../client';
import type { CheckoutResponse } from '../types';
import { API_PREFIX } from '../constants';

const CHECKOUT_PATH = `${API_PREFIX}/checkout`;

/**
 * POST /api/checkout. No body. Returns 201 and order. 401 if not logged in; 400 if cart empty.
 */
export async function checkout(request: ApiRequestContext) {
  return request.post(CHECKOUT_PATH, { data: {} });
}

/** Parse successful checkout response to typed order. */
export async function parseCheckoutResponse(
  response: Awaited<ReturnType<typeof checkout>>
): Promise<CheckoutResponse | null> {
  if (!response.ok()) return null;
  try {
    return (await response.json()) as CheckoutResponse;
  } catch {
    return null;
  }
}
