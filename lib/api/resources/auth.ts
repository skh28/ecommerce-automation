/**
 * Auth API. Spec: POST /api/auth/signup. Session (NextAuth) is handled by the app;
 * use storage state from a browser login for authenticated endpoints.
 */
import type { ApiRequestContext } from '../client';
import type { SignupRequest, SignupResponse } from '../types';
import { API_PREFIX } from '../constants';

const SIGNUP_PATH = `${API_PREFIX}/auth/signup`;

/**
 * POST /api/auth/signup. No auth required. Returns 201 and user on success.
 * Errors: 400 validation, 409 email already registered.
 */
export async function signup(request: ApiRequestContext, body: SignupRequest) {
  return request.post(SIGNUP_PATH, { data: body });
}

/** Parse successful signup response to typed user. */
export async function parseSignupResponse(
  response: Awaited<ReturnType<typeof signup>>
): Promise<SignupResponse | null> {
  if (!response.ok()) return null;
  try {
    return (await response.json()) as SignupResponse;
  } catch {
    return null;
  }
}
