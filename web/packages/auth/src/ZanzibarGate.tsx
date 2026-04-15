import React from 'react';
import { useZanzibarAccess } from './useZanzibarAccess';

interface ZanzibarGateProps {
  /** OpenFGA relation to check: "can_view" | "can_edit" | "can_manage" */
  relation: string;
  /** OpenFGA object type: "report" | "module" | "action" | "company" */
  objectType: string;
  /** OpenFGA object ID: "HR_REPORTS" | "AUDIT" | "1" */
  objectId: string;
  /** Content to render when authorized */
  children: React.ReactNode;
  /** Fallback when access is hidden/denied (default: null = render nothing) */
  fallback?: React.ReactNode;
  /** Fallback during async server check (default: null = render nothing) */
  loadingFallback?: React.ReactNode;
  /** HTTP POST function for server checks */
  httpPost?: (url: string, body: any) => Promise<{ data: any }>;
  /**
   * Faz 4 Explain UX: reason shown as tooltip when access is 'disabled'.
   * Consumer typically passes a short i18n string like
   * `t('access.drawer.noEditPermission')` or a dynamic explain result.
   * When provided, children are wrapped in a `<span>` with `title` +
   * `aria-disabled="true"` so assistive tech + hover tooltip both show reason.
   */
  disabledReason?: string;
}

/**
 * Object-level authorization gate — 3 katmanlı Zanzibar-Aware yapı (Katman 2).
 * CNS-20260411-005 uzlaşısı: ZanzibarGate wraps children with object-level check.
 *
 * Usage:
 *   <ZanzibarGate relation="can_view" objectType="report" objectId="HR_REPORTS">
 *     <ReportDashboard />
 *   </ZanzibarGate>
 *
 * Disabled + tooltip (Faz 4):
 *   <ZanzibarGate relation="can_edit" objectType="module" objectId="ACCESS"
 *     disabledReason={t('access.drawer.noEditPermission')}>
 *     <Button>Save</Button>
 *   </ZanzibarGate>
 */
export function ZanzibarGate({
  relation,
  objectType,
  objectId,
  children,
  fallback = null,
  loadingFallback = null,
  httpPost,
  disabledReason,
}: ZanzibarGateProps) {
  const { access, loading } = useZanzibarAccess(relation, objectType, objectId, httpPost);

  if (loading) return <>{loadingFallback}</>;
  if (access === 'hidden') return <>{fallback}</>;

  // Faz 4 Explain UX: disabled state renders children wrapped with tooltip + aria.
  // Children remain visible (consumer decides how to visually disable via access prop).
  if (access === 'disabled' && disabledReason) {
    return (
      <span
        title={disabledReason}
        aria-disabled="true"
        data-zanzibar-disabled="true"
        data-testid="zanzibar-gate-disabled"
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
    );
  }

  return <>{children}</>;
}
