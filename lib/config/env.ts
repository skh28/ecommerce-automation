/**
 * Central environment configuration for the API automation framework.
 * Load .env from the project root so API base URL and auth are configurable
 * without code changes. Use this module anywhere you need env values.
 */
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root (parent of lib/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/** Resolved API base URL (no trailing slash). Prefer API_BASE_URL, fallback to BASE_URL. */
export const apiBaseUrl = (process.env.API_BASE_URL || process.env.BASE_URL || '').replace(/\/$/, '');

/** Optional bearer token for authenticated endpoints. Set API_TOKEN in .env for protected APIs. */
export const apiToken = process.env.API_TOKEN || '';

/** Whether the API is configured (required for API test runs). */
export function isApiConfigured(): boolean {
  return Boolean(apiBaseUrl);
}
