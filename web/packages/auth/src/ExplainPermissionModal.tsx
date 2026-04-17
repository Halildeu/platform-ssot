import React from 'react';
import { Modal, Button, Alert, Badge, Select, Input } from '@mfe/design-system';
import { useExplainPermission } from './useExplainPermission';
import type { ExplainResponse, ExplainScopeType } from './types';

/**
 * ExplainPermissionModal — Zanzibar Faz 4 Explain UX + P1.9 NO_SCOPE path
 *
 * Shows the user WHY a specific permission is allowed / denied.
 * Backend: POST /v1/authz/explain (ExplainResponse: reason + details + roles + scopes).
 * Frontend hook: useExplainPermission.
 *
 * Shared across mfe-access (RoleDrawer per-permission "Why?" buttons) and
 * mfe-shell (UnauthorizedPage "Why can't I access?" flow — AC-0320 Senaryo 4).
 * Both hosts pass their own `httpPost` (via api.post) and `t` (i18n).
 *
 * P1.9: Optional scope picker (type + refId) triggers a scope-level denial check.
 * When the selected scope is not in the user's scope set, backend returns
 * `reason=NO_SCOPE` and the modal renders the denied scope alongside the badge.
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
  /**
   * HTTP POST transport — host provides `api.post` from `@mfe/shared-http`.
   * Kept as a prop so mfe-access (React Query axios wrapper) and mfe-shell
   * (same wrapper) stay decoupled from this package's transport choice.
   */
  httpPost: (url: string, body: unknown) => Promise<{ data: any }>;
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

const SCOPE_TYPES: ExplainScopeType[] = ['COMPANY', 'PROJECT', 'WAREHOUSE', 'BRANCH'];

export const ExplainPermissionModal: React.FC<ExplainPermissionModalProps> = ({
  open,
  onClose,
  userId,
  permissionType,
  permissionKey,
  permissionLabel,
  httpPost,
  t,
}) => {
  // Host passes a stable httpPost via React.useCallback; we forward it directly
  // so useExplainPermission's `useCallback` dep stays referentially stable and
  // the auto-fetch effect below does not loop (P1.1 regression guard).
  const { explain, result, loading, error } = useExplainPermission({ httpPost });

  // Scope picker state (P1.9). Local-only — not forwarded until the user
  // explicitly clicks "Check scope" so the initial auto-fetch mirrors the
  // pre-P1.9 behavior (no NO_SCOPE short-circuit).
  const [scopeType, setScopeType] = React.useState<ExplainScopeType | ''>('');
  const [scopeRefIdInput, setScopeRefIdInput] = React.useState<string>('');
  const [scopeError, setScopeError] = React.useState<string | null>(null);
  // Persisted scope that was actually submitted — used by the auto-refetch
  // effect below when target changes while a scope is active.
  const [appliedScope, setAppliedScope] = React.useState<{ type: ExplainScopeType; refId: number } | null>(null);

  // Reset scope picker state whenever the modal opens or the target changes —
  // otherwise a scope from a previous permission drawer leaks into the next
  // fetch.
  React.useEffect(() => {
    if (!open) return;
    setScopeType('');
    setScopeRefIdInput('');
    setScopeError(null);
    setAppliedScope(null);
  }, [open, userId, permissionType, permissionKey]);

  // Auto-fetch on open. Re-fetch when target changes while open, or when the
  // user applies a new scope via the picker. The reset effect above guarantees
  // appliedScope is null when target changes, so this effect collapses into
  // the pre-P1.9 "fetch once per target" shape unless the user explicitly
  // picks a scope.
  React.useEffect(() => {
    if (open && userId && permissionKey) {
      void explain(
        userId,
        permissionType,
        permissionKey,
        appliedScope?.type ?? null,
        appliedScope?.refId ?? null,
      );
    }
  }, [open, userId, permissionType, permissionKey, appliedScope, explain]);

  const reasonVariant = result ? REASON_VARIANT[result.reason] : 'error';
  const reasonText = result ? t(`access.explain.reason.${result.reason}`) : '';
  const displayLabel = permissionLabel ?? permissionKey;

  const handleScopeCheck = () => {
    if (!scopeType) {
      setScopeError(null);
      setAppliedScope(null);
      return;
    }
    const trimmed = scopeRefIdInput.trim();
    if (trimmed.length === 0) {
      setScopeError(t('access.explainModal.scopeRefIdInvalid'));
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 0) {
      setScopeError(t('access.explainModal.scopeRefIdInvalid'));
      return;
    }
    setScopeError(null);
    setAppliedScope({ type: scopeType, refId: parsed });
  };

  const handleScopeClear = () => {
    setScopeType('');
    setScopeRefIdInput('');
    setScopeError(null);
    setAppliedScope(null);
  };

  const scopeTypeOptions = SCOPE_TYPES.map((st) => ({
    value: st,
    label: t(`access.explainModal.scopeType${st}`),
  }));

  const deniedScopeType =
    result?.reason === 'NO_SCOPE' ? result.details.scopeType ?? null : null;
  const deniedScopeRefId =
    result?.reason === 'NO_SCOPE' ? result.details.scopeRefId ?? null : null;

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

                {deniedScopeType && deniedScopeRefId != null && (
                  <>
                    <span className="text-text-subtle">
                      {t('access.explainModal.scopeDeniedLabel')}:
                    </span>
                    <span
                      className="font-medium text-text-primary"
                      data-testid="explain-modal-denied-scope"
                    >
                      {deniedScopeType}:{deniedScopeRefId}
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

        {/* P1.9 scope picker — always available, gated behind userId */}
        {userId && (
          <div
            className="rounded-xl border border-border-subtle bg-surface-default p-3 text-sm"
            data-testid="explain-modal-scope-picker"
          >
            <div className="mb-2 font-medium text-text-primary">
              {t('access.explainModal.scopeSectionTitle')}
            </div>
            <p className="mb-3 text-xs text-text-subtle">
              {t('access.explainModal.scopeHelp')}
            </p>
            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-subtle">
                  {t('access.explainModal.scopeTypeLabel')}
                </span>
                <Select
                  size="sm"
                  value={scopeType}
                  placeholder={t('access.explainModal.scopeTypePlaceholder')}
                  options={scopeTypeOptions}
                  onChange={(e) => setScopeType((e.target.value as ExplainScopeType | '') || '')}
                  data-testid="explain-modal-scope-type"
                  aria-label={t('access.explainModal.scopeTypeLabel')}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-text-subtle">
                  {t('access.explainModal.scopeRefIdLabel')}
                </span>
                <Input
                  size="sm"
                  type="number"
                  inputMode="numeric"
                  value={scopeRefIdInput}
                  placeholder={t('access.explainModal.scopeRefIdPlaceholder')}
                  onChange={(e) => setScopeRefIdInput(e.target.value)}
                  data-testid="explain-modal-scope-refid"
                  aria-label={t('access.explainModal.scopeRefIdLabel')}
                />
              </label>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleScopeCheck}
                disabled={!scopeType || loading}
                data-testid="explain-modal-scope-check"
              >
                {t('access.explainModal.scopeCheckButton')}
              </Button>
              {(scopeType || scopeRefIdInput || appliedScope) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleScopeClear}
                  data-testid="explain-modal-scope-clear"
                >
                  {t('access.explainModal.scopeClearButton')}
                </Button>
              )}
            </div>
            {scopeError && (
              <div
                className="mt-2 text-xs text-state-danger-text"
                data-testid="explain-modal-scope-error"
              >
                {scopeError}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ExplainPermissionModal;
