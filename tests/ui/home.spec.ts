/**
 * UI (E2E) tests for the ecommerce storefront. Run with: npm run test:e2e
 * Uses baseURL from .env (UI_BASE_URL or API_BASE_URL).
 */
import { test } from '@playwright/test';
import { waitForElementPresent } from './utils/wait';

test.describe('Home page', () => {
  test('displays expected layout: branding, nav buttons, and hero options', async ({ page }) => {
    await page.goto('/');

    await waitForElementPresent(page.getByText('Ecommerce App').first());

    const navProducts = page.getByRole('link', { name: /^Products$/i }).or(page.getByRole('button', { name: /^Products$/i }));
    const navLogin = page.getByRole('link', { name: /^Log\s*in$/i }).or(page.getByRole('button', { name: /^Log\s*in$/i }));
    const navSignup = page.getByRole('link', { name: /^(Sign\s*up|Signup)$/i }).or(page.getByRole('button', { name: /^(Sign\s*up|Signup)$/i }));
    await waitForElementPresent(navProducts.first());
    await waitForElementPresent(navLogin.first());
    await waitForElementPresent(navSignup.first());

    await waitForElementPresent(page.getByText('Shop simple').first());

    const centerLogin = page.getByRole('link', { name: /^Log\s*in$/i }).or(page.getByRole('button', { name: /^Log\s*in$/i }));
    await waitForElementPresent(page.getByRole('link', { name: /Create account/i }).or(page.getByRole('button', { name: /Create account/i })).first());
    await waitForElementPresent(centerLogin.first());
    await waitForElementPresent(page.getByRole('link', { name: /Browse without account/i }).or(page.getByRole('button', { name: /Browse without account/i })).first());
  });
});
