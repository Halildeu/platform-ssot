// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import type { AccessRole } from '../../../features/access-management/model/access.types';
import RoleCloneModal from './RoleCloneModal.ui';

test('RoleCloneModal modal ve switch yuzeyini surdurur', async () => {
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

  render(
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

  const nameInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
  expect(nameInput.value).toBe('Kopya Admin');

  const switchInput = screen.getByRole('switch');

  await act(async () => {
    fireEvent.click(switchInput);
  });

  const submitButton = screen.getByText('access.clone.okText');

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(submissions.length).toBe(1);
  expect(submissions[0]).toEqual({
    name: 'Kopya Admin',
    description: 'Core administrators',
    copyMemberCount: true,
  });

  const cancelButton = screen.getByText('access.clone.cancelText');

  await act(async () => {
    fireEvent.click(cancelButton);
  });

  expect(cancels.length).toBe(1);
});
