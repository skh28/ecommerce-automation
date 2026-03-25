/**
 * Orders list UI: nav Orders link, <main> with ul of order rows (date · N items).
 */
import type { Page } from '@playwright/test';

/** Same shape as list meta line, e.g. "Mar 24, 2026 · 2 items" */
export function orderListDateStamp(d = new Date()): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const OrdersPage = {
  /** Header: <a href="/orders">Orders</a> */
  navLink(page: Page) {
    return page.locator('a[href="/orders"]').or(page.getByRole('link', { name: /^Orders$/i })).first();
  },

  ordersMain(page: Page) {
    return page.getByRole('main');
  },

  /** Post-checkout banner on /orders */
  orderPlacedSuccessBanner(page: Page) {
    return page.getByText(/Order placed successfully/i);
  },

  orderRows(page: Page) {
    return OrdersPage.ordersMain(page).getByRole('listitem');
  },

  firstOrderRow(page: Page) {
    return OrdersPage.orderRows(page).first();
  },
};
