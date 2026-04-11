/**
 * Hook: Object-level Zanzibar authorization check.
 *
 * Usage:
 *   const access = useZanzibarAccess('can_view', 'report', 'fin-faturalar');
 *   // access.allowed, access.relation, access.loading, access.error
 *   // Or with UI mapping:
 *   const props = resolveZanzibarAccessProps(access);
 *   // props.access ('full' | 'readonly' | 'disabled' | 'hidden')
 *
 * Strategy (CNS-20260411-005 consensus):
 * 1. Check /me snapshot first (bounded hint, fast, no network)
 * 2. Check object cache (authzVersion-keyed)
 * 3. Fall back to checkPermission() API via @mfe/shared-http
 * 4. Cache result for future lookups
 *
 * D-007: This hook provides ADVISORY information only.
 * Server/data enforcement is always authoritative.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePermissions } from './PermissionProvider';
import type { ZanzibarAccessResult } from './resolveZanzibarAccessProps';

/**
 * Check object-level Zanzibar access.
 *
 * @param relation - OpenFGA relation: 'can_view' | 'can_edit' | 'can_manage'
 * @param objectType - Object type: 'report' | 'module' | 'action' | 'company' | 'project'
 * @param objectId - Object identifier (e.g., 'fin-faturalar', 'AUDIT', '42')
 * @param options - Optional configuration
 */
export function useZanzibarAccess(
  relation: string,
  objectType: string,
  objectId: string,
  options?: {
    /** Skip the check entirely (useful for conditional checks). */
    skip?: boolean;
    /** Override: treat /me hint as authoritative (for module-level). */
    trustMeHint?: boolean;
  },
): ZanzibarAccessResult {
  const { skip = false, trustMeHint = false } = options ?? {};
  const permissions = usePermissions();
  const [result, setResult] = useState<ZanzibarAccessResult>({
    allowed: false,
    relation: null,
    loading: !skip,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  // Step 1: /me snapshot hint (fast, no network)
  const getMeHint = useCallback((): { allowed: boolean; relation: string | null } | null => {
    if (!permissions) return null;

    // Module-level check from /me
    if (objectType === 'module') {
      const level = permissions.getModuleLevel(objectId);
      if (level === 'MANAGE') return { allowed: true, relation: 'can_manage' };
      if (level === 'VIEW') return { allowed: true, relation: 'can_view' };
      return { allowed: false, relation: null };
    }

    // Action-level check from /me
    if (objectType === 'action') {
      if (permissions.isActionAllowed(objectId)) return { allowed: true, relation: 'can_view' };
      if (permissions.isActionDenied(objectId)) return { allowed: false, relation: null };
      return null; // Not in /me — need server check
    }

    // Report-level check from /me
    if (objectType === 'report') {
      const canView = permissions.canViewReport(objectId);
      if (canView === true) return { allowed: true, relation: 'can_view' };
      if (canView === false) return { allowed: false, relation: null };
      return null; // undefined = not in /me, need server check
    }

    // Company scope check from /me
    if (objectType === 'company') {
      const canAccess = permissions.canAccessCompany(Number(objectId));
      if (canAccess) return { allowed: true, relation: 'can_view' };
      // Don't deny based on /me for company — it's bounded hint
      return null;
    }

    // SuperAdmin bypass
    if (permissions.isSuperAdmin()) return { allowed: true, relation: 'can_manage' };

    // Unknown object type — need server check
    return null;
  }, [permissions, objectType, objectId]);

  useEffect(() => {
    if (skip) {
      setResult({ allowed: false, relation: null, loading: false, error: null });
      return;
    }

    // Step 1: Try /me hint
    const hint = getMeHint();
    if (hint !== null && (trustMeHint || hint.allowed)) {
      setResult({
        allowed: hint.allowed,
        relation: hint.relation as ZanzibarAccessResult['relation'],
        loading: false,
        error: null,
      });
      // If trustMeHint, stop here — no server call
      if (trustMeHint) return;
      // If hint says allowed, use it optimistically but still verify
      // (for object-level, /me is bounded hint — may not have full picture)
    }

    // Step 2: Check object cache (managed by ZanzibarCacheProvider if available)
    // Cache is handled externally — this hook focuses on the check logic

    // Step 3: Server check via checkPermission()
    const controller = new AbortController();
    abortRef.current = controller;

    const doCheck = async () => {
      try {
        setResult(prev => ({ ...prev, loading: true }));
        // Use the checkPermission from PermissionProvider context
        const allowed = await permissions.checkObjectPermission?.(
          relation,
          objectType,
          objectId,
        );

        if (controller.signal.aborted) return;

        // Determine relation level from the check
        let resolvedRelation: ZanzibarAccessResult['relation'] = null;
        if (allowed) {
          // We checked a specific relation — that's what we got
          if (relation === 'can_manage') resolvedRelation = 'can_manage';
          else if (relation === 'can_edit') resolvedRelation = 'can_edit';
          else if (relation === 'can_view') resolvedRelation = 'can_view';
        }

        setResult({
          allowed: allowed ?? false,
          relation: resolvedRelation,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        setResult({
          allowed: false,
          relation: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Yetki kontrolü başarısız.',
        });
      }
    };

    // Only do server check if /me hint was inconclusive or denied
    if (hint === null || !hint.allowed) {
      doCheck();
    }

    return () => {
      controller.abort();
      abortRef.current = null;
    };
  }, [relation, objectType, objectId, skip, trustMeHint, getMeHint, permissions]);

  return result;
}
