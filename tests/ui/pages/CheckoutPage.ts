/**
 * Shared locators for the checkout / order confirmation UI.
 */
import type { Page } from '@playwright/test';

export const CheckoutPage = {
  /** Checkout page root (<main>…). */
  checkoutMain(page: Page) {
    return page.getByRole('main');
  },

  /**
   * Checkout content area: real <form> if present, otherwise <main> (typical for Next/React without a form wrapper).
   */
  checkoutForm(page: Page) {
    return CheckoutPage.checkoutMain(page)
      .or(page.getByRole('form').first())
      .or(page.locator('[data-testid="checkout-form"], [data-testid="checkout"], .checkout-form').first());
  },

  /**
   * Primary CTA: <button type="button" class="… bg-blue-600 …">Place order</button>
   * Scoped to checkout <main> to avoid matching unrelated buttons.
   */
  placeOrderButton(page: Page) {
    return CheckoutPage.checkoutMain(page)
      .getByRole('button', { name: /^\s*Place order\s*$/i })
      .or(page.getByRole('button', { name: /^\s*Place order\s*$/i }))
      .first();
  },

  /** Order confirmation heading or message (e.g. "Order confirmed", "Thank you", "Order complete"). */
  confirmationHeading(page: Page) {
    return page
      .getByRole('heading', {
        name: /order\s*(confirm(ed)?|complete|placed|success)?|thank\s*you|success|confirmation/i,
      })
      .or(page.getByRole('heading', { name: /order/i }))
      .or(
        page.getByText(
          /order\s*(confirm(ed)?|complete|placed|success)|thank\s*you(\s*for your order)?|your\s*order\s*(has been|is)/i
        )
      )
      .or(page.getByText(/order\s*#|order\s*id/i))
      .first();
  },

  /** Order ID or number on confirmation page. */
  orderId(page: Page) {
    return page.getByText(/order\s*(#|id|number)?\s*:?\s*[\w-]+/i).first();
  },
};
