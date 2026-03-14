import { defineConfig, devices } from '@playwright/test';
import { apiBaseUrl, apiToken, uiBaseUrl } from './lib/config/env';

/**
 * Playwright config for ecommerce automation. API base URL and auth come from
 * .env (see .env.example). Run API-only tests with: npm run test:api
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    // Auth header for API tests when API_TOKEN is set in .env
    ...(apiToken && {
      extraHTTPHeaders: { Authorization: `Bearer ${apiToken}` },
    }),
  },

  projects: [
    // API tests: no browser; baseURL and auth from .env
    {
      name: 'api',
      testMatch: /.*\/api\/.*\.spec\.ts/,
      use: { baseURL: apiBaseUrl || 'http://localhost' },
    },
    // UI (browser) tests – exclude API tests; use UI base URL from .env
    {
      name: 'chromium',
      testMatch: /.*\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: uiBaseUrl },
    },

//    {
//      name: 'firefox',
//      use: { ...devices['Desktop Firefox'] },
//    },

//    {
//      name: 'webkit',
//      use: { ...devices['Desktop Safari'] },
//    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
