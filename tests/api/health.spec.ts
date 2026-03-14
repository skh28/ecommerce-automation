/**
 * Health and readiness checks. Run these first to confirm the API is up
 * and that API_BASE_URL is set correctly. Adjust path and assertions to
 * match your ecommerce API contract.
 */
import { test, expect } from './fixtures/api';
import { isApiConfigured } from '../../lib/config/env';

test.describe('API health', () => {
  test.beforeEach(() => {
    // Skip entire suite when API is not configured (e.g. fresh clone without .env)
    if (!isApiConfigured()) {
      test.skip(true, 'API_BASE_URL (or BASE_URL) is not set in .env');
    }
  });

  test('GET /health returns 200 and indicates OK', async ({ api }) => {
    const response = await api.health.getHealth();

    expect(response.ok(), 'Health endpoint should return 2xx').toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json().catch(() => null);
    if (body && typeof body === 'object') {
      // Common patterns: { status: 'ok' }, { healthy: true }, or { data: ... }
      const status = body.status ?? body.health ?? body.healthy;
      expect(status, 'Response should indicate healthy status').toBeDefined();
    }
  });
});
