/**
 * Login flow E2E test. Credentials come from .env (TEST_USER_*).
 * Run with: npm run test:e2e
 */
import { test, expect } from '@playwright/test';
import { testUserEmail, testUserPassword, testUserDisplayName, isTestUserConfigured } from '../../lib/config/env';
import { LoginPage, submitLoginForm } from './pages/LoginPage';

test.describe('Login', () => {
  test.beforeEach(() => {
    if (!isTestUserConfigured()) {
      test.skip(true, 'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env');
    }
  });

  test('user can log in and sees welcome message', async ({ page }) => {
    await page.goto('/');

    await LoginPage.loginEntry(page).click();

    await expect(LoginPage.emailField(page)).toBeVisible({ timeout: 10000 });
    await submitLoginForm(page, testUserEmail, testUserPassword);

    const displayName = testUserDisplayName || 'Test';
    await expect(LoginPage.welcomeMessage(page, displayName)).toBeVisible({
      timeout: 10000,
    });
  });
});
