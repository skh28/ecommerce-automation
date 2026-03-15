import type { Locator } from '@playwright/test';

/**
 * Waits for the element to be present and visible in the DOM.
 * Uses Playwright's default timeout from config. Use across UI tests instead of inline timeouts.
 */
export async function waitForElementPresent(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible' });
}
