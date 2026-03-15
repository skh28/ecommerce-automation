/**
 * Shared locators for the checkout / order confirmation UI.
 */
import type { Page } from '@playwright/test';

export const CheckoutPage = {
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
