/**
 * Login flow E2E test. Credentials come from .env (TEST_USER_*).
 * Run with: npm run test:e2e
 */
import { test } from '@playwright/test';
import { testUserEmail, testUserPassword, testUserDisplayName, isTestUserConfigured } from '../../lib/config/env';
import { LoginPage, submitLoginForm } from './pages/LoginPage';
import { waitForElementPresent } from './utils/wait';

test.describe('Login', () => {
  test.beforeEach(() => {
    if (!isTestUserConfigured()) {
      test.skip(true, 'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env');
    }
  });

  test('user can log in and sees welcome message', async ({ page }) => {
    await page.goto('/');

    await LoginPage.loginEntry(page).click();
    await waitForElementPresent(LoginPage.emailField(page));
    await submitLoginForm(page, testUserEmail, testUserPassword);

    const displayName = testUserDisplayName || 'Test';
    try {
      await waitForElementPresent(LoginPage.welcomeMessage(page, displayName));
      console.log('[Login] Login succeeded');
    } catch (error) {
      console.log('[Login] Login failed (welcome message not visible)');
      throw error;
    }
  });
});
