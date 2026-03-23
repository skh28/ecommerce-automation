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
import { waitForElementPresent } from './utils/wait';

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
    await waitForElementPresent(LoginPage.welcomeMessage(page, displayName));

    // 3. Open products page by clicking the Products button in the top right (re-login if redirected to login)
    await ProductsPage.navLink(page).click();
    await ensureLoggedIn(page, testUserEmail, testUserPassword);

    // 4. Verify user is on the products page
    await expect(page).toHaveURL(/\/products/i);
    await waitForElementPresent(ProductsPage.firstProductCard(page));

    // 5. Add the first two items to cart
    await ProductsPage.addToCartButton(
      page,
      ProductsPage.nthProductCard(page, 0)
    ).click();

    await waitForElementPresent(ProductsPage.nthProductCard(page, 1));
    await ProductsPage.addToCartButton(
      page,
      ProductsPage.nthProductCard(page, 1)
    ).click();

    // 6. Open cart page (re-login if redirected to login after add-to-cart, then open cart again)
    await CartPage.navLink(page).click();
    await ensureLoggedIn(page, testUserEmail, testUserPassword);
    if (!page.url().includes('/cart')) {
      await CartPage.navLink(page).click();
      await ensureLoggedIn(page, testUserEmail, testUserPassword);
    }

    // 7. Verify cart page has two line items (cart UI often omits or shortens product titles vs listing)
    await expect(page).toHaveURL(/\/cart/i);
    await waitForElementPresent(CartPage.nthCartItem(page, 0));
    await waitForElementPresent(CartPage.nthCartItem(page, 1));

    // 8. Verify cart shows a total line with a price
    await expect(CartPage.total(page)).toHaveText(/\$[\d,]+\.?\d*/);

    // 9. Checkout
    await CartPage.checkoutButton(page).click();

    // 10. Verify checkout page is loaded and place order
    await expect(page).toHaveURL(/\/checkout/i);
    await waitForElementPresent(CheckoutPage.checkoutForm(page));
    await waitForElementPresent(CheckoutPage.placeOrderButton(page));
    await CheckoutPage.placeOrderButton(page).click();

    // 11. Verify order confirmation
    await waitForElementPresent(CheckoutPage.confirmationHeading(page));
  });
});
