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
import { LoginPage, submitLoginForm } from './pages/LoginPage';
import { ProductsPage, goToProducts } from './pages/ProductsPage';
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

    // 3. Open products page by clicking the Products button in the top right
    await ProductsPage.navLink(page).click();

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
  });
});
