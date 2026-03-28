import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import type { AccessRole } from '../../../features/access-management/model/access.types';

test('RoleCloneModal modal ve switch yuzeyini surdurur', async () => {
  const require = createRequire(import.meta.url);
  (require.extensions as Record<string, () => void>)['.css'] = () => {};
  const { default: RoleCloneModal } = await import('./RoleCloneModal.ui');

  const submissions: Array<{ name: string; description?: string; copyMemberCount: boolean }> = [];
  const cancels: string[] = [];

  const role: AccessRole = {
    id: 'role-admin',
    name: 'Admin',
    description: 'Core administrators',
    memberCount: 5,
    policies: [],
    lastModifiedAt: new Date().toISOString(),
    lastModifiedBy: 'system',
  };

  const renderer = TestRenderer.create(
    <RoleCloneModal
      open
      role={role}
      onSubmit={(values) => submissions.push(values)}
      onCancel={() => cancels.push('cancel')}
      t={(key, params) => {
        if (key === 'access.clone.nameSuggestion') {
          return `Kopya ${String(params?.roleName ?? '')}`.trim();
        }
        if (key === 'access.clone.modal.subtitle') {
          return `${key}:${String(params?.roleName ?? '')}`;
        }
        return key;
      }}
    />,
  );

  await act(async () => {});

  let root = renderer.root;
  const textInputs = root.findAllByType('input').filter((node) => node.props.type === 'text');
  const nameInput = textInputs[0];

  assert.equal(nameInput.props.value, 'Kopya Admin');

  const switchInput = root.findByProps({ role: 'switch' });

  await act(async () => {
    switchInput.props.onChange({ target: { checked: true } });
  });

  root = renderer.root;
  const submitButton = root.findByProps({ children: 'access.clone.okText' });

  await act(async () => {
    submitButton.props.onClick();
  });

  assert.equal(submissions.length, 1);
  assert.deepEqual(submissions[0], {
    name: 'Kopya Admin',
    description: 'Core administrators',
    copyMemberCount: true,
  });

  const cancelButton = root.findByProps({ children: 'access.clone.cancelText' });

  await act(async () => {
    cancelButton.props.onClick();
  });

  assert.equal(cancels.length, 1);
});
