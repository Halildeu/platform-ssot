// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import type { AccessRole } from '../../../features/access-management/model/access.types';
import DeleteRoleModal from './DeleteRoleModal.ui';

const t = (key: string, params?: Record<string, unknown>) => {
  if (key === 'access.delete.message') {
    return `Delete "${String(params?.roleName ?? '')}"?`;
  }
  if (key === 'access.delete.memberWarning') {
    return `${String(params?.count ?? 0)} members affected`;
  }
  return key;
};

test('DeleteRoleModal shows role name and confirms deletion', async () => {
  const confirmations: string[] = [];

  const role: AccessRole = {
    id: 'role-1',
    name: 'Editor',
    memberCount: 3,
    policies: [],
    lastModifiedAt: new Date().toISOString(),
    lastModifiedBy: 'system',
  };

  render(
    <DeleteRoleModal
      open
      role={role}
      onConfirm={(id) => confirmations.push(id)}
      onCancel={() => {}}
      t={t}
    />,
  );

  await act(async () => {});

  expect(screen.getByText('Delete "Editor"?')).toBeTruthy();
  expect(screen.getByText('3 members affected')).toBeTruthy();

  const deleteButton = screen.getByText('access.delete.confirmText');
  await act(async () => {
    fireEvent.click(deleteButton);
  });

  expect(confirmations).toEqual(['role-1']);
});

test('DeleteRoleModal disables delete for system roles', async () => {
  const role: AccessRole = {
    id: 'role-sys',
    name: 'System Admin',
    isSystemRole: true,
    memberCount: 0,
    policies: [],
    lastModifiedAt: new Date().toISOString(),
    lastModifiedBy: 'system',
  };

  render(
    <DeleteRoleModal
      open
      role={role}
      onConfirm={() => {}}
      onCancel={() => {}}
      t={t}
    />,
  );

  await act(async () => {});

  const deleteButton = screen.getByText('access.delete.confirmText');
  expect((deleteButton as HTMLButtonElement).disabled).toBe(true);
});
