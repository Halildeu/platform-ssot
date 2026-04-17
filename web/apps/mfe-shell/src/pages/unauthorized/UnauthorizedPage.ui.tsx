import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Alert, Button } from '@mfe/design-system';
import { usePermissions, ExplainPermissionModal } from '@mfe/auth';
import { api } from '@mfe/shared-http';
import { useShellCommonI18n } from '../../app/i18n';

const REASON_MESSAGES: Record<string, { title: string; description: string }> = {
  module_denied: {
    title: 'Modül erişimi yok',
    description: 'Bu modül rolünüzde tanımlı değil. Yöneticinizden ilgili rolün atanmasını isteyebilirsiniz.',
  },
  scope_denied: {
    title: 'Veri erişimi yok',
    description: 'Bu şirket/proje/depo verilerine erişiminiz bulunmuyor. Scope atanması gerekiyor.',
  },
  action_denied: {
    title: 'İşlem engellenmiş',
    description: 'Bu işlem rolünüzde DENY olarak işaretlenmiş. Engelleme yöneticiniz tarafından kaldırılabilir.',
  },
};

const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const { t } = useShellCommonI18n();
  const { authz } = usePermissions();
  // Stable httpPost reference — ExplainPermissionModal's auto-fetch effect
  // depends on this callback; an inline arrow would re-create the identity
  // every render and re-fire the fetch in a loop (P1.1 root cause).
  const httpPost = React.useCallback(
    (url: string, body: unknown) => api.post(url, body),
    [],
  );

  // P1.9 / AC-0320 Senaryo 4: "Neden erişemiyorum?" opens the shared
  // ExplainPermissionModal — the modal's own scope picker exposes the
  // `scopeType/scopeRefId` path so the user can surface NO_SCOPE reasons.
  const [explainModalOpen, setExplainModalOpen] = React.useState(false);

  const state = location.state as {
    from?: string;
    reason?: string;
    requiredModule?: string;
    requiredPermission?: string;
  } | null;

  const fromPath = state?.from ?? '/';
  const reason = state?.reason;
  const requiredModule = state?.requiredModule;
  const requiredPermission = state?.requiredPermission;
  const userRoles = authz?.roles ?? [];
  const userId = (authz as Record<string, unknown>)?.userId as string | undefined;

  const reasonInfo = reason ? REASON_MESSAGES[reason] : null;

  const canExplain = !!userId && !!(requiredModule || requiredPermission);
  const modalPermType: 'MODULE' | 'ACTION' | 'REPORT' = requiredPermission ? 'ACTION' : 'MODULE';
  const modalPermKey = requiredPermission ?? requiredModule ?? '';

  return (
    <div className="mt-16 flex justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border border-border-subtle bg-surface-default p-6 shadow-xs">
        <h1 className="mb-3 text-xl font-semibold text-text-primary">
          {t('auth.unauthorized.title')}
        </h1>
        <p className="mb-4 text-sm text-text-secondary">
          {t('auth.unauthorized.description')}
        </p>

        {/* Detailed explanation */}
        {reasonInfo && (
          <Alert variant="warning" title={reasonInfo.title} className="mb-4">
            {reasonInfo.description}
          </Alert>
        )}

        {requiredModule && (
          <div className="mb-4 rounded-xl border border-border-subtle bg-surface-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-subtle">Gerekli modül:</span>
              <span className="font-semibold text-text-primary">{requiredModule}</span>
            </div>
            {userRoles.length > 0 && (
              <div className="flex justify-between mt-2">
                <span className="text-text-subtle">Mevcut rolleriniz:</span>
                <span className="font-medium text-text-primary">{userRoles.join(', ')}</span>
              </div>
            )}
            {userRoles.length === 0 && (
              <div className="mt-2 text-xs text-state-danger-text">
                Henüz hiçbir rol atanmamış. Yöneticinize başvurun.
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {canExplain && (
            <Button
              variant="secondary"
              onClick={() => setExplainModalOpen(true)}
              data-testid="unauthorized-explain-open"
            >
              Neden erişemiyorum?
            </Button>
          )}
          <Button className="bg-action-primary text-action-primary-text hover:opacity-90">
            <Link to={fromPath}>{t('auth.unauthorized.back')}</Link>
          </Button>
          <Button className="bg-surface-muted text-text-secondary hover:bg-surface-default">
            <Link to="/">{t('auth.unauthorized.home')}</Link>
          </Button>
        </div>
      </div>

      {/* P1.9 / AC-0320 Senaryo 4: shared ExplainPermissionModal — includes
          the scope picker that forwards scopeType/scopeRefId to the backend
          and renders reason=NO_SCOPE + denied-scope badge. */}
      {canExplain && userId && modalPermKey && (
        <ExplainPermissionModal
          open={explainModalOpen}
          onClose={() => setExplainModalOpen(false)}
          userId={userId}
          permissionType={modalPermType}
          permissionKey={modalPermKey}
          permissionLabel={modalPermKey}
          httpPost={httpPost}
          t={t}
        />
      )}
    </div>
  );
};

export default UnauthorizedPage;
