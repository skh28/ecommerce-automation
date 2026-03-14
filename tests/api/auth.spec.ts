/**
 * Auth API tests. Spec: POST /api/auth/signup (no auth required).
 */
import { test, expect } from './fixtures/api';
import { isApiConfigured } from '../../lib/config/env';

test.describe('Auth API', () => {
  test.beforeEach(() => {
    if (!isApiConfigured()) {
      test.skip(true, 'API_BASE_URL (or BASE_URL) is not set in .env');
    }
  });

  test('POST /api/auth/signup returns 201 and user with valid body', async ({ api }) => {
    const email = `test-${Date.now()}@example.com`;
    const response = await api.auth.signup({
      email,
      password: 'password123',
      name: 'Test User',
    });

    expect(response.status()).toBe(201);
    const data = await api.auth.parseSignupResponse(response);
    expect(data).not.toBeNull();
    expect(data!.user).toHaveProperty('id');
    expect(data!.user.email).toBe(email);
    expect(data!.user.name).toBe('Test User');
  });

  test('POST /api/auth/signup returns 400 for invalid email', async ({ api }) => {
    const response = await api.auth.signup({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(response.status()).toBe(400);
    const body = await response.json().catch(() => ({}));
    expect(body).toHaveProperty('error');
  });

  test('POST /api/auth/signup returns 400 for short password', async ({ api }) => {
    const response = await api.auth.signup({
      email: 'valid@example.com',
      password: 'short',
    });
    expect(response.status()).toBe(400);
    const body = await response.json().catch(() => ({}));
    expect(body).toHaveProperty('error');
  });

  test('POST /api/auth/signup returns 409 when email already registered', async ({ api }) => {
    const email = `duplicate-${Date.now()}@example.com`;
    await api.auth.signup({ email, password: 'password123' });
    const response = await api.auth.signup({ email, password: 'password123' });
    expect(response.status()).toBe(409);
    const body = await response.json().catch(() => ({}));
    expect(body).toHaveProperty('error');
  });
});
