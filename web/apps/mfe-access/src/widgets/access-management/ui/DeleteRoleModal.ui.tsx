import React from 'react';
import { Badge, Button, Dialog } from '@mfe/design-system';
import type { AccessRole } from '../../../features/access-management/model/access.types';

interface DeleteRoleModalProps {
  open: boolean;
  role: AccessRole | null;
  confirmLoading?: boolean;
  onConfirm: (roleId: string) => void;
  onCancel: () => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  open,
  role,
  confirmLoading,
  onConfirm,
  onCancel,
  t,
}) => {
  if (!role) return null;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={t('access.delete.title')}
      size="sm"
      footer={(
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={confirmLoading}>
            {t('access.clone.cancelText')}
          </Button>
          <Button
            variant="danger"
            onClick={() => onConfirm(role.id)}
            loading={confirmLoading}
            disabled={role.isSystemRole}
          >
            {t('access.delete.confirmText')}
          </Button>
        </div>
      )}
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm text-text-secondary">
          {t('access.delete.message', { roleName: role.name })}
        </p>
        {role.isSystemRole && (
          <div className="flex items-center gap-2 rounded-xl border border-state-warning-border bg-state-warning px-3 py-2">
            <Badge variant="warning" size="sm">{t('access.drawer.systemRole')}</Badge>
            <span className="text-xs text-state-warning-text">{t('access.delete.systemRoleWarning')}</span>
          </div>
        )}
        {role.memberCount > 0 && (
          <p className="text-xs text-text-subtle">
            {t('access.delete.memberWarning', { count: role.memberCount })}
          </p>
        )}
      </div>
    </Dialog>
  );
};

export default DeleteRoleModal;
