import type { AuthzMeResponse, CheckRequest, CheckResponse } from './types';

/**
 * Fetch current user's authorization context from backend.
 * Backend proxies to OpenFGA; in dev/permitAll mode returns dev defaults.
 */
export async function fetchAuthzMe(
  httpGet: (url: string) => Promise<{ data: AuthzMeResponse }>
): Promise<AuthzMeResponse> {
  const { data } = await httpGet('/v1/authz/me');
  return data;
}

/**
 * Point authorization check via backend proxy.
 */
export async function checkPermission(
  httpPost: (url: string, body: CheckRequest) => Promise<{ data: CheckResponse }>,
  request: CheckRequest
): Promise<boolean> {
  const { data } = await httpPost('/v1/authz/check', request);
  return data.allowed;
}
