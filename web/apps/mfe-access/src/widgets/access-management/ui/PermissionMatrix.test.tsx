// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import type { AccessRole } from '../../../features/access-management/model/access.types';
import PermissionMatrix from './PermissionMatrix.ui';

const t = (key: string, params?: Record<string, unknown>) => {
  if (key === 'access.matrix.changed') return `${String(params?.count ?? 0)} changes`;
  if (key.startsWith('access.filter.level.')) return key.split('.').pop() ?? key;
  return key;
};

test('PermissionMatrix renders roles x modules grid', async () => {
  const roles: AccessRole[] = [
    {
      id: '1',
      name: 'Admin',
      memberCount: 5,
      policies: [
        { moduleKey: 'USER_MANAGEMENT', moduleLabel: 'User Management', level: 'MANAGE', lastUpdatedAt: '', updatedBy: '' },
      ],
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'system',
    },
    {
      id: '2',
      name: 'Viewer',
      memberCount: 10,
      policies: [
        { moduleKey: 'USER_MANAGEMENT', moduleLabel: 'User Management', level: 'VIEW', lastUpdatedAt: '', updatedBy: '' },
      ],
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'system',
    },
  ];

  const modules = new Map([['USER_MANAGEMENT', 'User Management']]);

  render(
    <PermissionMatrix
      roles={roles}
      modules={modules}
      onLevelChange={() => {}}
      onSaveAll={() => {}}
      t={t}
    />,
  );

  await act(async () => {});

  expect(screen.getByText('Admin')).toBeTruthy();
  expect(screen.getByText('Viewer')).toBeTruthy();
  expect(screen.getByText('User Management')).toBeTruthy();
  expect(screen.getByText('access.matrix.title')).toBeTruthy();
});
