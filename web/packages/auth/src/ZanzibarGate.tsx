/**
 * ZanzibarGate — Object-level advisory authorization gate.
 *
 * Wraps children and conditionally renders/hides/disables based on
 * Zanzibar/OpenFGA object-level permission check.
 *
 * IMPORTANT (D-007): This is an ADVISORY/UX layer only.
 * Real enforcement happens in backend/data pipeline via OpenFGA.
 * UI only controls affordance/visibility — never data filtering.
 *
 * @example
 * ```tsx
 * <ZanzibarGate relation="can_view" objectType="report" objectId="fin-faturalar">
 *   <ReportDashboard />
 * </ZanzibarGate>
 *
 * // With fallback:
 * <ZanzibarGate
 *   relation="can_edit"
 *   objectType="company"
 *   objectId="42"
 *   fallback={<NoAccessCard reason="Bu şirkete erişim yetkiniz yok." />}
 * >
 *   <CompanyEditor />
 * </ZanzibarGate>
 * ```
 */
import React from 'react';
import { useZanzibarAccess } from './useZanzibarAccess';
import { resolveZanzibarAccessProps } from './resolveZanzibarAccessProps';

export interface ZanzibarGateProps {
  /** OpenFGA relation to check (e.g., 'can_view', 'can_edit', 'can_manage'). */
  relation: string;
  /** Object type (e.g., 'report', 'module', 'company', 'project'). */
  objectType: string;
  /** Object identifier. */
  objectId: string;
  /** Content to render when access is granted. */
  children: React.ReactNode;
  /** Optional fallback when access is denied. If not provided, renders nothing. */
  fallback?: React.ReactNode;
  /** Optional loading state. If not provided, renders nothing while checking. */
  loading?: React.ReactNode;
  /** Show disabled state instead of hiding on deny. Default: false (hide). */
  showDisabledOnDeny?: boolean;
  /** Custom deny reason text. */
  denyReason?: string;
  /** Treat /me hint as authoritative (skip server check). Default: false. */
  trustMeHint?: boolean;
}

export function ZanzibarGate({
  relation,
  objectType,
  objectId,
  children,
  fallback = null,
  loading: loadingFallback = null,
  showDisabledOnDeny = false,
  denyReason,
  trustMeHint = false,
}: ZanzibarGateProps) {
  const accessResult = useZanzibarAccess(relation, objectType, objectId, {
    trustMeHint,
  });

  // Loading state
  if (accessResult.loading) {
    return <>{loadingFallback}</>;
  }

  // Resolve to UI access level
  const { access } = resolveZanzibarAccessProps(accessResult, {
    showDisabledOnDeny,
    denyReason,
  });

  // Hidden = denied, don't render
  if (access === 'hidden') {
    return <>{fallback}</>;
  }

  // Disabled = show but block interaction (with overlay hint)
  if (access === 'disabled') {
    return (
      <div
        className="relative"
        aria-disabled="true"
        title={denyReason ?? 'Bu kaynağa erişim yetkiniz yok.'}
      >
        <div className="pointer-events-none opacity-50">
          {children}
        </div>
      </div>
    );
  }

  // Full or readonly — render children normally
  // Readonly vs full distinction is handled at component level via AccessControlledProps
  return <>{children}</>;
}
