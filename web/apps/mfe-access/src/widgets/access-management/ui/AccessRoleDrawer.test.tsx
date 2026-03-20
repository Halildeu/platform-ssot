import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureShellServices } from '../../../app/services/shell-services';
import type { AccessRole } from '../../../features/access-management/model/access.types';

test('AccessRoleDrawer canonical checkbox ve save aksiyonunu surdurur', async () => {
  const require = createRequire(import.meta.url);
  (require.extensions as Record<string, () => void>)['.css'] = () => {};
  const { default: AccessRoleDrawer } = await import('./AccessRoleDrawer.ui');

  configureShellServices({
    http: {
      get: async () => ({
        data: {
          items: [
            { id: 'perm.view', code: 'PERM_VIEW', moduleLabel: 'Users' },
            { id: 'perm.manage', code: 'PERM_MANAGE', moduleLabel: 'Admin' },
          ],
        },
      }),
    } as never,
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const saves: Array<{ roleId: string; permissionIds: string[] }> = [];
  const closes: string[] = [];

  const role: AccessRole = {
    id: 'role-admin',
    name: 'Admin',
    description: 'Core administrators',
    memberCount: 5,
    isSystemRole: true,
    policies: [
      {
        moduleKey: 'erp.users',
        moduleLabel: 'Users',
        level: 'MANAGE',
        lastUpdatedAt: new Date().toISOString(),
        updatedBy: 'system',
      },
    ],
    permissions: ['perm.view'],
    lastModifiedAt: new Date().toISOString(),
    lastModifiedBy: 'system',
  };

  const renderer = TestRenderer.create(
    <QueryClientProvider client={queryClient}>
      <AccessRoleDrawer
        open
        role={role}
        onClose={() => closes.push('close')}
        onPermissionsSave={async (roleId, permissionIds) => {
          saves.push({ roleId, permissionIds: [...permissionIds].sort() });
        }}
        t={(key, params) => {
          if (key === 'access.drawer.permissionUpdated') {
            return `${String(params?.user ?? '')}:${String(params?.timestamp ?? '')}`;
          }
          return key;
        }}
        formatNumber={(value) => String(value)}
        formatDate={(value) => new Date(value).toISOString()}
      />
    </QueryClientProvider>,
  );

  await act(async () => {
    await Promise.resolve();
  });

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  let root = renderer.root;
  const permissionCheckbox = root.find(
    (node) => node.type === 'input' && node.props['data-testid'] === 'access-role-permission-perm.manage',
  );

  await act(async () => {
    permissionCheckbox.props.onChange({ target: { checked: true } });
  });

  root = renderer.root;
  const saveButton = root.findByProps({ 'data-testid': 'access-role-drawer-save' });

  await act(async () => {
    saveButton.props.onClick();
  });

  assert.equal(saves.length, 1);
  assert.deepEqual(saves[0], {
    roleId: 'role-admin',
    permissionIds: ['perm.manage', 'perm.view'],
  });

  const cancelButton = root.findByProps({ children: 'access.clone.cancelText' });

  await act(async () => {
    cancelButton.props.onClick();
  });

  assert.equal(closes.length, 1);
  renderer.unmount();
  queryClient.clear();
});
