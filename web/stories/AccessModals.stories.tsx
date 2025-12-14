import React, { useState } from 'react';
import AccessRoleDrawer from '../apps/mfe-access/src/widgets/access-management/ui/AccessRoleDrawer.ui';
import BulkPermissionModal from '../apps/mfe-access/src/widgets/access-management/ui/BulkPermissionModal.ui';
import type { AccessRole } from '../apps/mfe-access/src/features/access-management/model/access.types';
import type { AccessLevel } from '../apps/mfe-access/src/features/access-management/model/access.types';

const t = (key: string, params?: Record<string, unknown>) => {
  if (params?.count) return `${params.count} role selected`;
  return key;
};

const formatNumber = (value: number) => new Intl.NumberFormat('tr-TR').format(value);
const formatDate = (value: Date | number, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('tr-TR', options).format(value);

const mockRole: AccessRole = {
  id: 'role-1',
  name: 'İç Denetim',
  description: 'Sadece denetçiler için okuma/yorum yetkileri',
  isSystemRole: false,
  memberCount: 14,
  lastModifiedAt: Date.now() - 1000 * 60 * 60 * 24,
  lastModifiedBy: 'denetim@yildiz.com',
  policies: [
    {
      moduleKey: 'reports',
      moduleLabel: 'Raporlar',
      level: 'VIEW' as AccessLevel,
      updatedBy: 'ahmet.oz',
      lastUpdatedAt: Date.now() - 1000 * 60 * 30,
    },
    {
      moduleKey: 'users',
      moduleLabel: 'Kullanıcılar',
      level: 'EDIT' as AccessLevel,
      updatedBy: 'zeynep.k',
      lastUpdatedAt: Date.now() - 1000 * 60 * 90,
    },
  ],
};

export default {
  title: 'Access/Modals',
};

export const AccessRoleDrawerStory = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="p-6">
      <button
        type="button"
        className="mb-4 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Kapat' : 'Aç'}
      </button>
      <AccessRoleDrawer
        open={open}
        role={mockRole}
        onClose={() => setOpen(false)}
        t={t}
        formatNumber={formatNumber}
        formatDate={formatDate}
      />
    </div>
  );
};

export const BulkPermissionModalStory = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-6">
      <button
        type="button"
        className="mb-4 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Kapat' : 'Aç'}
      </button>
      <BulkPermissionModal
        open={open}
        roleCount={5}
        moduleOptions={[
          { value: 'reports', label: 'Raporlar' },
          { value: 'users', label: 'Kullanıcılar' },
        ]}
        levelOptions={[
          { value: 'VIEW' as AccessLevel, label: 'Görüntüleme' },
          { value: 'EDIT' as AccessLevel, label: 'Düzenleme' },
          { value: 'MANAGE' as AccessLevel, label: 'Yönetim' },
        ]}
        confirmLoading={false}
        onSubmit={(values) => window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'info', text: JSON.stringify(values) } }))}
        onCancel={() => setOpen(false)}
        t={t}
        formatNumber={formatNumber}
      />
    </div>
  );
};
