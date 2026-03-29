// @vitest-environment node
import { test, expect } from 'vitest';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { AccessLevel } from '../../../features/access-management/model/access.types';
import BulkPermissionModal from './BulkPermissionModal.ui';

test('BulkPermissionModal level secimini Segmented uzerinden surdurur ve submit eder', async () => {
  const submissions: Array<{ moduleKey: string; level: AccessLevel }> = [];

  const renderer = TestRenderer.create(
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

  let root = renderer.root;
  let moduleSelect = root.findByType('select');

  await act(async () => {
    moduleSelect.props.onChange({ target: { value: 'erp.users' }, currentTarget: { value: 'erp.users' } });
  });

  root = renderer.root;
  moduleSelect = root.findByType('select');
  expect(moduleSelect.props.value).toBe('erp.users');

  let manageButton = root.findByProps({ 'data-testid': 'bulk-permission-level-manage' });

  await act(async () => {
    manageButton.props.onClick();
  });

  root = renderer.root;
  manageButton = root.findByProps({ 'data-testid': 'bulk-permission-level-manage' });
  expect(manageButton.props['aria-checked']).toBe(true);

  const submitButton = root.findByProps({ children: 'access.bulk.okText' });

  await act(async () => {
    submitButton.props.onClick();
  });

  expect(submissions.length).toBe(1);
  expect(submissions[0]).toEqual({
    moduleKey: 'erp.users',
    level: 'MANAGE',
  });
});
