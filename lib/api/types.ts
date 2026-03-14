/**
 * Types aligned with the ecommerce API spec. IDs are CUIDs; money in cents; dates ISO 8601.
 * @see API spec in project docs
 */

/** Error body: { "error": "Message" } or { "error": "...", "code": "SOME_CODE" } */
export interface ApiError {
  error: string;
  code?: string;
}

/** Product (list and by-id). Money in cents. */
export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
}

/** GET /api/products response */
export interface ProductsListResponse {
  products: Product[];
  total: number;
}

/** Cart line item */
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  priceCents: number;
  quantity: number;
  imageUrl: string;
}

/** GET /api/cart response (and POST/PATCH/DELETE cart responses) */
export interface CartResponse {
  items: CartItem[];
  totalCents: number;
}

/** POST /api/auth/signup request */
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

/** POST /api/auth/signup success response */
export interface SignupResponse {
  user: { id: string; email: string; name: string | null };
}

/** Order line item (in checkout and order detail) */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceCents: number;
}

/** POST /api/checkout response */
export interface CheckoutResponse {
  order: {
    id: string;
    totalCents: number;
    createdAt: string;
    items: OrderItem[];
  };
}

/** Order summary in list */
export interface OrderSummary {
  id: string;
  totalCents: number;
  createdAt: string;
  itemCount: number;
}

/** GET /api/orders response */
export interface OrdersListResponse {
  orders: OrderSummary[];
  total: number;
}

/** GET /api/orders/[id] response */
export interface OrderDetailResponse {
  id: string;
  totalCents: number;
  createdAt: string;
  items: OrderItem[];
}
