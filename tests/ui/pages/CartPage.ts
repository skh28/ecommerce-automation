/**
 * Shared locators and helpers for the cart UI.
 * Reuse in any test that opens the cart, changes quantity, removes items, or goes to checkout.
 */
import type { Page } from '@playwright/test';

export const CartPage = {
  /** Link or button in nav that goes to the cart (Cart, optionally with count). */
  navLink(page: Page) {
    return page
      .getByRole('link', { name: /^Cart\s*(\(\d+\))?$/i })
      .or(page.getByRole('button', { name: /^Cart\s*(\(\d+\))?$/i }))
      .first();
  },

  /** Cart container or list of items. */
  cartContainer(page: Page) {
    return page
      .getByRole('region', { name: /cart/i })
      .or(page.locator('[data-testid="cart"], [data-testid="cart-page"], .cart, [class*="cart"]').first());
  },

  /** List of cart line items (rows). */
  cartItemsList(page: Page) {
    return page
      .getByRole('list', { name: /cart\s*items?|items?/i })
      .or(page.locator('[data-testid="cart-items"], .cart-items, [class*="cartItems"]').first());
  },

  /** First cart item row. */
  firstCartItem(page: Page) {
    return page.getByRole('listitem').first().or(
      page.locator('[data-testid^="cart-item"], .cart-item, [class*="cartItem"]').first()
    );
  },

  /** Nth cart item row (0-based: 0 = first, 1 = second). */
  nthCartItem(page: Page, index: number) {
    return page.getByRole('listitem').nth(index).or(
      page.locator('[data-testid^="cart-item"], .cart-item, [class*="cartItem"]').nth(index)
    );
  },

  /** Cart item row that contains the given product name. */
  cartItemByName(page: Page, name: string | RegExp) {
    const namePattern = typeof name === 'string' ? new RegExp(name, 'i') : name;
    return page.getByRole('listitem').filter({ has: page.getByText(namePattern) }).first().or(
      page.locator('[data-testid^="cart-item"], .cart-item').filter({ has: page.getByText(namePattern) }).first()
    );
  },

  /** Quantity input within a cart item (or first on page). */
  quantityInput(page: Page, within?: ReturnType<Page['locator']>) {
    const base = within ?? page;
    return base.getByRole('spinbutton', { name: /quantity/i }).or(
      base.locator('input[type="number"]').first()
    ).first();
  },

  /** Remove / delete button for a cart item (or first on page). */
  removeButton(page: Page, within?: ReturnType<Page['locator']>) {
    const base = within ?? page;
    return base.getByRole('button', { name: /remove|delete|trash/i }).first();
  },

  /** Cart total / subtotal (e.g. "Total: $99.99" or element with price). */
  total(page: Page) {
    return page.getByText(/total[:\s]*\$?[\d,]+\.?\d*/i).first().or(
      page.locator('[data-testid="cart-total"], .cart-total, [class*="total"]').first()
    );
  },

  /** Checkout button. */
  checkoutButton(page: Page) {
    return page.getByRole('link', { name: /checkout/i }).or(
      page.getByRole('button', { name: /checkout/i })
    ).first();
  },

  /** Empty cart message (e.g. "Your cart is empty"). */
  emptyMessage(page: Page) {
    return page.getByText(/your\s*cart\s*is\s*empty|cart\s*is\s*empty|no\s*items/i).first();
  },
};

/**
 * Go to the cart from anywhere (clicks nav Cart link).
 */
export async function goToCart(page: Page): Promise<void> {
  await CartPage.navLink(page).click();
}
