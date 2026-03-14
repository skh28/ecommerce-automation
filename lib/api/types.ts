/**
 * Shared types for the ecommerce API. Extend these to match your API contracts
 * so responses are typed and reusable across tests and helpers.
 */

/** Generic success envelope used by many REST APIs. Adjust to your API shape. */
export interface ApiSuccess<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
}

/** Generic error envelope for consistent error handling in tests. */
export interface ApiError {
  message?: string;
  error?: string;
  code?: string | number;
  statusCode?: number;
}

/** Paginated list response. Align field names with your API (e.g. totalCount, items). */
export interface PaginatedResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  pageSize?: number;
  hasMore?: boolean;
}

/** Placeholder product type. Replace with your actual product schema. */
export interface Product {
  id: string;
  name: string;
  price?: number;
  slug?: string;
  [key: string]: unknown;
}
