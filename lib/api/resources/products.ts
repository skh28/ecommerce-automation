/**
 * Products API. Public, read-only. Spec: GET /api/products, GET /api/products/[id].
 */
import type { ApiRequestContext } from '../client';
import type { Product, ProductsListResponse } from '../types';
import { API_PREFIX } from '../constants';

const PRODUCTS_PATH = `${API_PREFIX}/products`;
const productByIdPath = (id: string) => `${PRODUCTS_PATH}/${id}`;

/**
 * GET /api/products. Query: limit (default 50), offset (default 0).
 */
export async function getProducts(
  request: ApiRequestContext,
  params?: { limit?: number; offset?: number }
) {
  const searchParams = params
    ? new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null) as [string, string][]
      ).toString()
    : '';
  const url = searchParams ? `${PRODUCTS_PATH}?${searchParams}` : PRODUCTS_PATH;
  return request.get(url);
}

/** GET /api/products/[id] */
export async function getProductById(request: ApiRequestContext, id: string) {
  return request.get(productByIdPath(id));
}

/**
 * Parse GET /api/products response to typed list. Returns empty array on non-OK or non-JSON.
 */
export async function parseProductsList(
  response: Awaited<ReturnType<typeof getProducts>>
): Promise<Product[]> {
  if (!response.ok()) return [];
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return [];
  }
  if (body && typeof body === 'object' && body !== null && 'products' in body) {
    const list = (body as ProductsListResponse).products;
    return Array.isArray(list) ? list : [];
  }
  if (Array.isArray(body)) return body as Product[];
  return [];
}

/** Parse GET /api/products response to get total count. */
export async function parseProductsTotal(
  response: Awaited<ReturnType<typeof getProducts>>
): Promise<number> {
  if (!response.ok()) return 0;
  try {
    const body = (await response.json()) as ProductsListResponse;
    return typeof body.total === 'number' ? body.total : 0;
  } catch {
    return 0;
  }
}
