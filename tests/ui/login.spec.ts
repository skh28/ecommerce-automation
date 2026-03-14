/**
 * Login flow E2E test. Uses a dedicated test user.
 * Run with: npm run test:e2e
 */
import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'Test@example.com',
  password: 'test12345',
  displayName: 'Test',
};

test.describe('Login', () => {
  test('user can log in and sees Welcome back, Test', async ({ page }) => {
    await page.goto('/');

    // Open login (header or center "Login" link/button)
    const loginEntry = page.getByRole('link', { name: /^Log\s*in$/i }).or(page.getByRole('button', { name: /^Log\s*in$/i })).first();
    await loginEntry.click();

    // Wait for login form (email field or sign-in heading)
    const emailField = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    await expect(emailField.first()).toBeVisible({ timeout: 10000 });

    await emailField.first().fill(TEST_USER.email);
    const passwordField = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i));
    await passwordField.first().fill(TEST_USER.password);

    // Submit: button with "Sign in", "Log in", "Login", or "Submit"
    const submitButton = page.getByRole('button', { name: /sign\s*in|log\s*in|login|submit/i }).first();
    await submitButton.click();

    // Success: middle of page shows "Welcome back, Test"
    await expect(page.getByText('Welcome back, Test').first()).toBeVisible({ timeout: 10000 });
  });
});
