/**
 * Shared locators and helpers for the cart UI.
 * Matches <main> cart page: <ul class="divide-y…"><li>…</li></ul>, quantity <select>, "Proceed to checkout".
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

  /** Cart page root (scoped so listitems are only cart lines, not site nav). */
  cartMain(page: Page) {
    return page.getByRole('main');
  },

  /**
   * Cart line rows: <main><ul class="divide-y …"><li class="p-4 flex …">…</li></ul>
   */
  cartLineItems(page: Page) {
    return CartPage.cartMain(page).getByRole('listitem');
  },

  /** Cart container (main content on /cart). */
  cartContainer(page: Page) {
    return CartPage.cartMain(page);
  },

  /** The <ul> that wraps line items. */
  cartItemsList(page: Page) {
    return CartPage.cartMain(page).locator('ul.divide-y').first();
  },

  /** First cart line item. */
  firstCartItem(page: Page) {
    return CartPage.cartLineItems(page).first();
  },

  /** Nth cart line item (0-based). */
  nthCartItem(page: Page, index: number) {
    return CartPage.cartLineItems(page).nth(index);
  },

  /** Line item that shows the given product name (matches title link / text in the row). */
  cartItemByName(page: Page, name: string | RegExp) {
    const pattern = typeof name === 'string' ? new RegExp(name, 'i') : name;
    return CartPage.cartLineItems(page).filter({ hasText: pattern }).first();
  },

  /** Quantity control: <select> labeled "Quantity for {Product}". */
  quantityInput(page: Page, within?: ReturnType<Page['locator']>) {
    const base = within ?? page;
    return base
      .getByRole('combobox', { name: /quantity for/i })
      .or(base.locator('select').first())
      .first();
  },

  /** Remove line button (aria-label "Remove … from cart"). */
  removeButton(page: Page, within?: ReturnType<Page['locator']>) {
    const base = within ?? page;
    return base.getByRole('button', { name: /remove/i }).first();
  },

  /**
   * Total row: <div class="text-right"><span>Total: </span><span>$…</span></div>
   */
  total(page: Page) {
    return CartPage.cartMain(page)
      .locator('div.text-right')
      .filter({ hasText: /total/i })
      .first();
  },

  /**
   * Cart CTA after line items: <a href="/checkout" class="… bg-blue-600 …">Proceed to checkout</a>
   * Scoped to cart <main> so a generic "Checkout" nav link is not clicked by mistake.
   */
  checkoutButton(page: Page) {
    return CartPage.cartMain(page)
      .locator('a[href="/checkout"]')
      .filter({ hasText: /^\s*Proceed to checkout\s*$/i })
      .or(CartPage.cartMain(page).getByRole('link', { name: /Proceed to checkout/i }));
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
