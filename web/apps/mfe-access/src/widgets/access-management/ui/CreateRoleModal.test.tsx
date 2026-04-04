// @vitest-environment jsdom
import { test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CreateRoleModal from './CreateRoleModal.ui';

const t = (key: string) => key;

test('CreateRoleModal renders form and validates name', async () => {
  const submissions: Array<{ name: string; description?: string }> = [];

  render(
    <CreateRoleModal
      open
      onSubmit={(values) => submissions.push(values)}
      onCancel={() => {}}
      t={t}
    />,
  );

  await act(async () => {});

  const submitButton = screen.getByText('access.create.submitText');

  // Submit with empty name should not call onSubmit
  await act(async () => {
    fireEvent.click(submitButton);
  });
  expect(submissions.length).toBe(0);

  // Type a valid name
  const nameInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
  await act(async () => {
    fireEvent.change(nameInput, { target: { value: 'Test Role' } });
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(submissions.length).toBe(1);
  expect(submissions[0]).toEqual({ name: 'Test Role', description: undefined });
});

test('CreateRoleModal cancel button calls onCancel', async () => {
  const cancels: string[] = [];

  render(
    <CreateRoleModal
      open
      onSubmit={() => {}}
      onCancel={() => cancels.push('cancel')}
      t={t}
    />,
  );

  await act(async () => {});

  const cancelButton = screen.getByText('access.clone.cancelText');
  await act(async () => {
    fireEvent.click(cancelButton);
  });

  expect(cancels.length).toBe(1);
});
