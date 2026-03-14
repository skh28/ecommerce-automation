/**
 * Health and readiness endpoints. Reuse these in smoke tests and CI checks.
 */
import type { ApiRequestContext } from '../client';

const HEALTH_PATH = '/health';

/**
 * GET /health (or your app's health path). Adjust HEALTH_PATH if your API uses
 * a different route (e.g. /api/health, /ready).
 */
export async function getHealth(request: ApiRequestContext) {
  return request.get(HEALTH_PATH);
}
