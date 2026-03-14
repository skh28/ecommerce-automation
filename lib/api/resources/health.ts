/**
 * Health/readiness (optional). Not in the main API spec; use if your app exposes it.
 */
import type { ApiRequestContext } from '../client';
import { API_PREFIX } from '../constants';

const HEALTH_PATH = `${API_PREFIX}/health`;

/** GET /api/health */
export async function getHealth(request: ApiRequestContext) {
  return request.get(HEALTH_PATH);
}
