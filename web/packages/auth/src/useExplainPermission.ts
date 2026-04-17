import { useCallback, useState } from 'react';
import type { ExplainResponse, ExplainScopeType } from './types';

interface UseExplainPermissionOptions {
  httpPost: (url: string, body: any) => Promise<{ data: any }>;
}

/**
 * Server-side permission explain — calls POST /v1/authz/explain.
 * Returns full details: reason, source role, user roles, scopes.
 *
 * P1.9: Optional `scopeType` + `scopeRefId` trigger a scope-level denial check
 * on the backend. If the user's scope set does not contain the requested
 * (scopeType, scopeRefId) pair, the response reason is `NO_SCOPE` and
 * `details.scopeType` / `details.scopeRefId` echo the requested scope.
 */
export function useExplainPermission({ httpPost }: UseExplainPermissionOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainResponse | null>(null);

  const explain = useCallback(
    async (
      userId: string,
      permissionType: string,
      permissionKey: string,
      scopeType?: ExplainScopeType | string | null,
      scopeRefId?: number | null,
    ) => {
      setLoading(true);
      setError(null);
      try {
        // Path '/v1/authz/explain' — @mfe/shared-http `api` baseURL varsayılanı zaten '/api'.
        // Daha önce '/api/v1/...' yazılmıştı; shared-http baseURL ile birleşince
        // `/api/api/v1/authz/explain` üretip 404 veriyordu. AuthBootstrapper.tsx:31
        // (`/v1/authz/me`) canonical pattern'dir.
        const body: Record<string, unknown> = { userId, permissionType, permissionKey };
        // Only forward scope fields when the caller explicitly opts in — the
        // backend treats absent/blank as "skip scope check". `scopeRefId=0` is
        // a valid numeric ID, so we test for null/undefined specifically.
        if (scopeType != null && String(scopeType).length > 0) {
          body.scopeType = scopeType;
        }
        if (scopeRefId != null) {
          body.scopeRefId = String(scopeRefId);
        }
        const res = await httpPost('/v1/authz/explain', body);
        const data = res.data as ExplainResponse;
        setResult(data);
        return data;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Explain request failed';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [httpPost],
  );

  return { explain, result, loading, error };
}
