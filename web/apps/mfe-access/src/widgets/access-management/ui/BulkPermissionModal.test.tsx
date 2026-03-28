import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { AccessLevel } from '../../../features/access-management/model/access.types';

test('BulkPermissionModal level secimini Segmented uzerinden surdurur ve submit eder', async () => {
  const require = createRequire(import.meta.url);
  (require.extensions as Record<string, () => void>)['.css'] = () => {};
  const { default: BulkPermissionModal } = await import('./BulkPermissionModal.ui');

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
  assert.equal(moduleSelect.props.value, 'erp.users');

  let manageButton = root.findByProps({ 'data-testid': 'bulk-permission-level-manage' });

  await act(async () => {
    manageButton.props.onClick();
  });

  root = renderer.root;
  manageButton = root.findByProps({ 'data-testid': 'bulk-permission-level-manage' });
  assert.equal(manageButton.props['aria-checked'], true);

  const submitButton = root.findByProps({ children: 'access.bulk.okText' });

  await act(async () => {
    submitButton.props.onClick();
  });

  assert.equal(submissions.length, 1);
  assert.deepEqual(submissions[0], {
    moduleKey: 'erp.users',
    level: 'MANAGE',
  });
});
