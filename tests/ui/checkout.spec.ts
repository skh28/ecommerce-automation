/**
 * Checkout E2E: login, verify login success, open products via top-right Products, verify on products page, add first two items to cart.
 * Requires test user in .env.
 */
import { test, expect } from '@playwright/test';
import {
  isTestUserConfigured,
  testUserEmail,
  testUserPassword,
  testUserDisplayName,
} from '../../lib/config/env';
import { LoginPage, submitLoginForm, ensureLoggedIn } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage, orderListDateStamp } from './pages/OrdersPage';
import { waitForElementPresent } from './utils/wait';
import { delay } from './utils/delay';

test.describe('Checkout', () => {
  test.beforeEach(() => {
    if (!isTestUserConfigured()) {
      test.skip(true, 'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env');
    }
  });

  test('login, verify logged in, open products from top right, verify on products page, add first two items to cart', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Log into app
    await LoginPage.loginEntry(page).click();
    await waitForElementPresent(LoginPage.emailField(page));
    await submitLoginForm(page, testUserEmail, testUserPassword);

    // 2. Verify user is successfully logged in
    const displayName = testUserDisplayName || 'Test';
    try { 
      await waitForElementPresent(LoginPage.welcomeMessage(page, displayName));
      console.log('[Checkout] Login succeeded');
    } catch (error) {
      console.log('[Checkout] Login failed (welcome message not visible)');
      throw error;
    }

    // 3. Open products page by clicking the Products button in the top right (re-login if redirected to login)
    await ProductsPage.navLink(page).click();
    await ensureLoggedIn(page, testUserEmail, testUserPassword);

    // 4. Verify user is on the products page
    await expect(page).toHaveURL(/\/products/i);
    await waitForElementPresent(ProductsPage.firstProductCard(page));
    await delay(2000); // wait for the page to load

    try {
      await waitForElementPresent(ProductsPage.firstProductCard(page));
      console.log('[Checkout] Products page loaded — success');
    } catch (error) {
      console.log('[Checkout] Products page not loaded — failure');
      throw error;
    }

    // 5. Add the first two items to cart
    await ProductsPage.addToCartButton(
      page,
      ProductsPage.nthProductCard(page, 0)
    ).click();
     
    try {
      await waitForElementPresent(CartPage.navLinkWithCount(page, 1));
      console.log('[Checkout] Header cart shows Cart (1) after first add — success');
    } catch (error) {
      console.log('[Checkout] Header cart did not increment to Cart (1) after first add — failure');
      throw error;
    }

    await waitForElementPresent(ProductsPage.nthProductCard(page, 1));
    await ProductsPage.addToCartButton(
      page,
      ProductsPage.nthProductCard(page, 1)
    ).click();

    try {
      await waitForElementPresent(CartPage.navLinkWithCount(page, 2));
      console.log('[Checkout] Header cart shows Cart (2) after second add — success');
    } catch (error) {
      console.log('[Checkout] Header cart did not increment to Cart (2) after second add — failure');
      throw error;
    }

    // 6. Open cart page (re-login if redirected to login after add-to-cart, then open cart again)
    await CartPage.navLink(page).click();
    await ensureLoggedIn(page, testUserEmail, testUserPassword);
    if (!page.url().includes('/cart')) {
      await CartPage.navLink(page).click();
      await ensureLoggedIn(page, testUserEmail, testUserPassword);
    }

    // 7. Verify cart page has two line items (cart UI often omits or shortens product titles vs listing)
    try {
      await expect(page).toHaveURL(/\/cart/i);
      await waitForElementPresent(CartPage.nthCartItem(page, 0));
      await waitForElementPresent(CartPage.nthCartItem(page, 1));
      console.log('[Checkout] Cart page has two line items — success');
    } catch (error) {
      console.log('[Checkout] Cart page missing URL /cart or two line items — failure');
      throw error;
    }

    // 8. Verify cart shows a total line with a price
    await expect(CartPage.total(page)).toHaveText(/\$[\d,]+\.?\d*/);

    // 9–11. Checkout: open checkout, place order, confirm
    try {
      await CartPage.checkoutButton(page).click();
      await expect(page).toHaveURL(/\/checkout/i);
      await waitForElementPresent(CheckoutPage.checkoutForm(page));
      await waitForElementPresent(CheckoutPage.placeOrderButton(page));
      await CheckoutPage.placeOrderButton(page).click();
      await waitForElementPresent(CheckoutPage.confirmationHeading(page));
      console.log('[Checkout] Checkout step (place order + confirmation) — success');
    } catch (error) {
      console.log('[Checkout] Checkout step (navigate, place order, or confirmation) — failure');
      throw error;
    }

    // 12. Orders tab: first row shows today’s date and 2 items for the placed order
    try {
      await OrdersPage.navLink(page).click();
      await ensureLoggedIn(page, testUserEmail, testUserPassword);
      await expect(page).toHaveURL(/\/orders/i);
      await waitForElementPresent(OrdersPage.ordersMain(page));
      await waitForElementPresent(OrdersPage.firstOrderRow(page));
      const todayStamp = orderListDateStamp();
      await expect(OrdersPage.firstOrderRow(page)).toContainText(todayStamp);
      await expect(OrdersPage.firstOrderRow(page)).toContainText(/2\s+items/i);
      console.log('[Checkout] Orders list: first row shows today and 2 items — success');
    } catch (error) {
      console.log('[Checkout] Orders list verification (nav, first row, date, 2 items) — failure');
      throw error;
    }
  });
});
