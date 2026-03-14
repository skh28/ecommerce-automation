/**
 * Orders API. Read-only, requires auth. Spec: GET /api/orders, GET /api/orders/[id].
 */
import type { ApiRequestContext } from '../client';
import type { OrderDetailResponse, OrdersListResponse } from '../types';
import { API_PREFIX } from '../constants';

const ORDERS_PATH = `${API_PREFIX}/orders`;
const orderByIdPath = (id: string) => `${ORDERS_PATH}/${id}`;

/**
 * GET /api/orders. Query: limit (default 20), offset (default 0). Newest first.
 * 401 if not logged in.
 */
export async function getOrders(
  request: ApiRequestContext,
  params?: { limit?: number; offset?: number }
) {
  const searchParams = params
    ? new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null) as [string, string][]
      ).toString()
    : '';
  const url = searchParams ? `${ORDERS_PATH}?${searchParams}` : ORDERS_PATH;
  return request.get(url);
}

/** GET /api/orders/[id]. Order must belong to current user. 404 if not found. */
export async function getOrderById(request: ApiRequestContext, id: string) {
  return request.get(orderByIdPath(id));
}

/** Parse GET /api/orders response. */
export async function parseOrdersListResponse(
  response: Awaited<ReturnType<typeof getOrders>>
): Promise<OrdersListResponse | null> {
  if (!response.ok()) return null;
  try {
    return (await response.json()) as OrdersListResponse;
  } catch {
    return null;
  }
}

/** Parse GET /api/orders/[id] response. */
export async function parseOrderDetailResponse(
  response: Awaited<ReturnType<typeof getOrderById>>
): Promise<OrderDetailResponse | null> {
  if (!response.ok()) return null;
  try {
    return (await response.json()) as OrderDetailResponse;
  } catch {
    return null;
  }
}
