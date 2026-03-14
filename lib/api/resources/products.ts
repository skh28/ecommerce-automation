/**
 * Product catalog API. Centralize product-related endpoints here so tests
 * stay DRY and endpoint changes are in one place. Extend with create/update/delete
 * when your API supports them.
 */
import type { ApiRequestContext } from '../client';
import type { Product } from '../types';

const PRODUCTS_PATH = '/products';
const productByIdPath = (id: string) => `${PRODUCTS_PATH}/${id}`;

/**
 * GET /products - list products. Optional query params depend on your API
 * (e.g. page, limit, category). Extend the params type as needed.
 */
export async function getProducts(
  request: ApiRequestContext,
  params?: { page?: number; limit?: number; category?: string }
) {
  const searchParams = params
    ? new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null) as [string, string][]
      ).toString()
    : '';
  const url = searchParams ? `${PRODUCTS_PATH}?${searchParams}` : PRODUCTS_PATH;
  return request.get(url);
}

/**
 * GET /products/:id - fetch a single product by ID.
 */
export async function getProductById(request: ApiRequestContext, id: string) {
  return request.get(productByIdPath(id));
}

/**
 * Helper: parse products list from response. Use in tests for typed assertions.
 * Adjust to your API response shape (e.g. data.products, data.items).
 */
export async function parseProductsList(
  response: Awaited<ReturnType<typeof getProducts>>
): Promise<Product[]> {
  if (!response.ok()) return [];
  const body = await response.json();
  if (Array.isArray(body)) return body as Product[];
  if (body?.data && Array.isArray(body.data)) return body.data as Product[];
  if (body?.items && Array.isArray(body.items)) return body.items as Product[];
  return [];
}
