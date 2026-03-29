// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureShellServices } from '../../../app/services/shell-services';
import type { AccessRole } from '../../../features/access-management/model/access.types';
import AccessRoleDrawer from './AccessRoleDrawer.ui';

test('AccessRoleDrawer canonical checkbox ve save aksiyonunu surdurur', async () => {
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

  render(
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

  const permissionCheckbox = screen.getByTestId('access-role-permission-perm.manage') as HTMLInputElement;

  await act(async () => {
    fireEvent.click(permissionCheckbox);
  });

  const saveButton = screen.getByTestId('access-role-drawer-save');

  await act(async () => {
    fireEvent.click(saveButton);
  });

  expect(saves.length).toBe(1);
  expect(saves[0]).toEqual({
    roleId: 'role-admin',
    permissionIds: ['perm.manage', 'perm.view'],
  });

  const cancelButton = screen.getByText('access.clone.cancelText');

  await act(async () => {
    fireEvent.click(cancelButton);
  });

  expect(closes.length).toBe(1);
  queryClient.clear();
});
