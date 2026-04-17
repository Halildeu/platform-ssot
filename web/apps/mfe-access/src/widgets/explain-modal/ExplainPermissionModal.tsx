import React from 'react';
import { Modal, Button, Alert, Badge } from '@mfe/design-system';
import { useExplainPermission } from '@mfe/auth';
import type { ExplainResponse } from '@mfe/auth';
import { api } from '@mfe/shared-http';

/**
 * ExplainPermissionModal — Zanzibar Faz 4 Explain UX
 *
 * Shows the user WHY a specific permission is allowed / denied.
 * Backend: POST /v1/authz/explain (ExplainResponse: reason + details + roles + scopes).
 * Frontend hook: useExplainPermission (from @mfe/auth).
 *
 * Opens in a portal modal, auto-fetches on open, renders loading / error / result states.
 * Used from RoleDrawer per-permission "Why?" buttons (module / action / report rows).
 */

export interface ExplainPermissionModalProps {
  /** Whether the modal is open. */
  open: boolean;
  /** Close handler (triggered by button, overlay, or escape). */
  onClose: () => void;
  /** The user whose permission we are explaining. When null, the modal shows a placeholder. */
  userId: string | null;
  /** Permission taxonomy type (matches backend enum). */
  permissionType: 'MODULE' | 'ACTION' | 'REPORT';
  /** Permission key (e.g. "PURCHASE", "DELETE_PO"). */
  permissionKey: string;
  /** Human-readable label rendered in the title; falls back to `permissionKey`. */
  permissionLabel?: string;
  /** i18n translate function (passed from host). */
  t: (key: string, params?: Record<string, unknown>) => string;
}

const REASON_VARIANT: Record<ExplainResponse['reason'], 'success' | 'error' | 'warning'> = {
  ALLOWED: 'success',
  NO_ROLE: 'error',
  DENIED_BY_ROLE: 'error',
  NO_SCOPE: 'warning',
  NO_PERMISSION: 'error',
};

export const ExplainPermissionModal: React.FC<ExplainPermissionModalProps> = ({
  open,
  onClose,
  userId,
  permissionType,
  permissionKey,
  permissionLabel,
  t,
}) => {
  // Stable httpPost reference — inline arrow would produce a new reference on
  // every render, which propagates through useExplainPermission's `useCallback`
  // dependency into a new `explain` identity on every render, causing the
  // auto-fetch effect below to re-fire in a loop (loading never resolves →
  // explain-modal-loading stays visible → Playwright `toBeHidden` timeout).
  const httpPost = React.useCallback(
    (url: string, body: unknown) => api.post(url, body),
    [],
  );
  const { explain, result, loading, error } = useExplainPermission({ httpPost });

  // Auto-fetch on open. Re-fetch when target changes while open.
  React.useEffect(() => {
    if (open && userId && permissionKey) {
      void explain(userId, permissionType, permissionKey);
    }
  }, [open, userId, permissionType, permissionKey, explain]);

  const reasonVariant = result ? REASON_VARIANT[result.reason] : 'error';
  const reasonText = result ? t(`access.explain.reason.${result.reason}`) : '';
  const displayLabel = permissionLabel ?? permissionKey;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={t('access.explainModal.title', { label: displayLabel })}
      footer={
        <Button variant="secondary" onClick={onClose}>
          {t('access.explainModal.close')}
        </Button>
      }
    >
      <div className="flex flex-col gap-4" data-testid="explain-modal-body">
        {!userId && (
          <Alert variant="warning" title={t('access.explainModal.noUserTitle')}>
            {t('access.explainModal.noUserDescription')}
          </Alert>
        )}

        {loading && (
          <div className="text-sm text-text-subtle" data-testid="explain-modal-loading">
            {t('access.explainModal.loading')}
          </div>
        )}

        {error && !loading && (
          <Alert variant="error" title={t('access.explainModal.errorTitle')}>
            {error}
          </Alert>
        )}

        {result && !loading && !error && (
          <>
            <div className="flex items-center gap-2" data-testid="explain-modal-reason">
              <Badge variant={reasonVariant} size="sm">
                {result.reason}
              </Badge>
              <span className="text-sm text-text-secondary">{reasonText}</span>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-muted p-3 text-sm">
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                <span className="text-text-subtle">
                  {t('access.explainModal.permissionTypeLabel')}:
                </span>
                <span className="font-medium text-text-primary">
                  {result.details.permissionType}
                </span>

                <span className="text-text-subtle">
                  {t('access.explainModal.permissionKeyLabel')}:
                </span>
                <span className="font-medium text-text-primary">
                  {result.details.permissionKey}
                </span>

                {result.details.roleName && (
                  <>
                    <span className="text-text-subtle">
                      {t('access.explainModal.sourceRoleLabel')}:
                    </span>
                    <span className="font-medium text-text-primary">
                      {result.details.roleName}
                    </span>
                  </>
                )}

                {result.details.grantType && (
                  <>
                    <span className="text-text-subtle">
                      {t('access.explainModal.grantTypeLabel')}:
                    </span>
                    <span>
                      <Badge
                        variant={result.details.grantType === 'DENY' ? 'error' : 'success'}
                        size="sm"
                      >
                        {result.details.grantType}
                      </Badge>
                    </span>
                  </>
                )}
              </div>
            </div>

            {result.userRoles.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 text-sm"
                data-testid="explain-modal-user-roles"
              >
                <span className="text-text-subtle">
                  {t('access.explainModal.userRolesLabel')}:
                </span>
                {result.userRoles.map((r) => (
                  <Badge key={r} variant="info" size="sm">
                    {r}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ExplainPermissionModal;
