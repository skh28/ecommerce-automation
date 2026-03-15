/**
 * Shared locators and helpers for the login flow. Reuse in any test that needs
 * to open the login form, fill credentials, or assert on the welcome message.
 */
import type { Page } from '@playwright/test';

export const LoginPage = {
  /** Link or button that opens the login form (header or center). */
  loginEntry(page: Page) {
    return page
      .getByRole('link', { name: /^Log\s*in$/i })
      .or(page.getByRole('button', { name: /^Log\s*in$/i }))
      .first();
  },

  /** Email input (by label or placeholder). */
  emailField(page: Page) {
    return page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).first();
  },

  /** Password input (by label or placeholder). */
  passwordField(page: Page) {
    return page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).first();
  },

  /** Submit button (Sign in / Log in / Submit). */
  submitButton(page: Page) {
    return page.getByRole('button', { name: /sign\s*in|log\s*in|login|submit/i }).first();
  },

  /** "Welcome back, {name}" message shown after successful login. */
  welcomeMessage(page: Page, displayName: string) {
    return page.getByText(`Welcome back, ${displayName}`).first();
  },
};

/**
 * Fill credentials and submit the login form. Call after navigating to the login form.
 */
export async function submitLoginForm(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await LoginPage.emailField(page).fill(email);
  await LoginPage.passwordField(page).fill(password);
  await LoginPage.submitButton(page).click();
}
