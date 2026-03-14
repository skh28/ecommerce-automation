/**
 * UI (E2E) tests for the ecommerce storefront. Run with: npm run test:e2e
 * Uses baseURL from .env (UI_BASE_URL or API_BASE_URL).
 */
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('displays expected layout: branding, nav buttons, and hero options', async ({ page }) => {
    await page.goto('/');

    // Top left: "Ecommerce App"
    await expect(page.getByText('Ecommerce App').first()).toBeVisible();

    // Top right: Products, Login, and Signup (may be links or buttons; "Log in" or "Login")
    const navProducts = page.getByRole('link', { name: /^Products$/i }).or(page.getByRole('button', { name: /^Products$/i }));
    const navLogin = page.getByRole('link', { name: /^Log\s*in$/i }).or(page.getByRole('button', { name: /^Log\s*in$/i }));
    const navSignup = page.getByRole('link', { name: /^(Sign\s*up|Signup)$/i }).or(page.getByRole('button', { name: /^(Sign\s*up|Signup)$/i }));
    await expect(navProducts.first()).toBeVisible();
    await expect(navLogin.first()).toBeVisible();
    await expect(navSignup.first()).toBeVisible();

    // Center: "Shop simple"
    await expect(page.getByText('Shop simple').first()).toBeVisible();

    // Center: Create account, Login, and Browse without account options (links or buttons)
    const centerLogin = page.getByRole('link', { name: /^Log\s*in$/i }).or(page.getByRole('button', { name: /^Log\s*in$/i }));
    await expect(page.getByRole('link', { name: /Create account/i }).or(page.getByRole('button', { name: /Create account/i })).first()).toBeVisible();
    await expect(centerLogin.first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Browse without account/i }).or(page.getByRole('button', { name: /Browse without account/i })).first()).toBeVisible();
  });
});
