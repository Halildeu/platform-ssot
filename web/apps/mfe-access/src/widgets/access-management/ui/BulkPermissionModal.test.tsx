// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import type { AccessLevel } from '../../../features/access-management/model/access.types';
import BulkPermissionModal from './BulkPermissionModal.ui';

test('BulkPermissionModal level secimini Segmented uzerinden surdurur ve submit eder', async () => {
  const submissions: Array<{ moduleKey: string; level: AccessLevel }> = [];

  render(
    <BulkPermissionModal
      open
      roleCount={3}
      moduleOptions={[
        { value: 'erp.users', label: 'Users' },
        { value: 'erp.audit', label: 'Audit' },
      ]}
      levelOptions={[
        { value: 'NONE', label: 'None' },
        { value: 'VIEW', label: 'View' },
        { value: 'EDIT', label: 'Edit' },
        { value: 'MANAGE', label: 'Manage' },
      ]}
      onSubmit={(values) => submissions.push(values)}
      onCancel={() => {}}
      t={(key) => key}
      formatNumber={(value) => String(value)}
    />,
  );

  await act(async () => {});

  const moduleSelect = screen.getByRole('combobox') as HTMLSelectElement;

  await act(async () => {
    fireEvent.change(moduleSelect, { target: { value: 'erp.users' } });
  });

  expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('erp.users');

  const manageButton = screen.getByTestId('bulk-permission-level-manage');

  await act(async () => {
    fireEvent.click(manageButton);
  });

  expect(screen.getByTestId('bulk-permission-level-manage').getAttribute('aria-checked')).toBe('true');

  const submitButton = screen.getByText('access.bulk.okText');

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(submissions.length).toBe(1);
  expect(submissions[0]).toEqual({
    moduleKey: 'erp.users',
    level: 'MANAGE',
  });
});
