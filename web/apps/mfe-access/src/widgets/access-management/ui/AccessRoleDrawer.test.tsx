// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureShellServices } from '../../../app/services/shell-services';
import type { AccessRole } from '../../../features/access-management/model/access.types';
import AccessRoleDrawer from './AccessRoleDrawer.ui';

test('AccessRoleDrawer renders module policies and permission toggles', async () => {
  configureShellServices({
    http: {
      get: async () => ({
        data: {
          items: [
            { id: 'perm.view', code: 'PERM_VIEW', moduleKey: 'erp.users', moduleLabel: 'Users' },
            { id: 'perm.manage', code: 'PERM_MANAGE', moduleKey: 'erp.users', moduleLabel: 'Users' },
          ],
        },
      }),
    } as never,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const saves: Array<{ roleId: string; permissionIds: string[] }> = [];

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
        onClose={() => {}}
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

  // Wait for query to resolve
  await act(async () => { await Promise.resolve(); });
  await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

  // Module policy card should render (multiple "Users" text nodes expected)
  expect(screen.getAllByText('Users').length).toBeGreaterThan(0);

  // Permission switch for perm.manage should exist
  const permSwitch = screen.getByTestId('access-role-permission-perm.manage');
  expect(permSwitch).toBeTruthy();

  // Toggle the switch to add perm.manage
  await act(async () => { fireEvent.click(permSwitch); });

  // Save button should be enabled (dirty)
  const saveButton = screen.getByTestId('access-role-drawer-save');
  expect((saveButton as HTMLButtonElement).disabled).toBe(false);

  await act(async () => { fireEvent.click(saveButton); });

  expect(saves.length).toBe(1);
  expect(saves[0]).toEqual({
    roleId: 'role-admin',
    permissionIds: ['perm.manage', 'perm.view'],
  });

  queryClient.clear();
});

test('AccessRoleDrawer shows discard dialog on close with dirty state', async () => {
  configureShellServices({
    http: {
      get: async () => ({
        data: {
          items: [
            { id: 'perm.view', code: 'PERM_VIEW', moduleKey: 'erp.users', moduleLabel: 'Users' },
          ],
        },
      }),
    } as never,
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const closes: string[] = [];

  const role: AccessRole = {
    id: 'role-1',
    name: 'Test',
    memberCount: 0,
    policies: [
      { moduleKey: 'erp.users', moduleLabel: 'Users', level: 'VIEW', lastUpdatedAt: new Date().toISOString(), updatedBy: 'system' },
    ],
    permissions: [],
    lastModifiedAt: new Date().toISOString(),
    lastModifiedBy: 'system',
  };

  render(
    <QueryClientProvider client={queryClient}>
      <AccessRoleDrawer
        open
        role={role}
        onClose={() => closes.push('close')}
        t={(key) => key}
        formatNumber={(v) => String(v)}
        formatDate={(v) => { try { const d = new Date(v); return Number.isNaN(d.getTime()) ? '-' : d.toISOString(); } catch { return '-'; } }}
      />
    </QueryClientProvider>,
  );

  await act(async () => { await Promise.resolve(); });
  await act(async () => { await new Promise((r) => setTimeout(r, 0)); });

  // Toggle a permission to make dirty
  const permSwitch = screen.getByTestId('access-role-permission-perm.view');
  await act(async () => { fireEvent.click(permSwitch); });

  // Click close — should show discard dialog, not close immediately
  const closeButton = screen.getByText('access.clone.cancelText');
  await act(async () => { fireEvent.click(closeButton); });

  // Should show discard dialog
  expect(screen.getByText('access.drawer.discardMessage')).toBeTruthy();

  // Confirm discard
  const discardButton = screen.getByText('access.drawer.discardConfirm');
  await act(async () => { fireEvent.click(discardButton); });

  expect(closes.length).toBe(1);
  queryClient.clear();
});
