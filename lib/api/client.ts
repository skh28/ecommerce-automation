/**
 * API client helpers. Playwright's request fixture already uses baseURL and
 * extraHTTPHeaders from config; this module provides reusable options and
 * defaults for custom calls (e.g. custom headers or timeouts).
 */
import type { APIRequestContext } from '@playwright/test';
import { apiToken } from '../config/env';

/**
 * Default headers for authenticated API requests. Merge these with
 * request-specific headers when calling request.get/post/etc. manually.
 * When using the Playwright API project, extraHTTPHeaders are set in config,
 * so this is mainly for one-off or overridden auth.
 */
export function getDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }
  return headers;
}

/**
 * Build request options with default headers. Use when you need to pass
 * options into request.get/post/put/delete and want auth + JSON defaults.
 *
 * @param overrides - Optional overrides for headers or other options
 */
export function requestOptions(overrides?: { headers?: Record<string, string> }) {
  return {
    headers: { ...getDefaultHeaders(), ...overrides?.headers },
  };
}

/**
 * Type alias for Playwright's API request context. Use in resource modules
 * so they stay test-runner agnostic and reusable (e.g. from fixtures).
 */
export type ApiRequestContext = APIRequestContext;
