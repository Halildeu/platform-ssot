// @vitest-environment jsdom
import { test, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { ExplainPermissionModal } from './ExplainPermissionModal';

/**
 * Backward-compat re-export test — ExplainPermissionModal implementation
 * was moved to `@mfe/auth` (P1.9). This file drives the real component with
 * a mocked `httpPost` prop so we can observe backend payload shapes without
 * running any real network call.
 *
 * Hook-level coverage (scopeRefId=0, null scopeType skip, etc.) is maintained
 * in `web/packages/auth/src/useExplainPermission.test.ts`.
 */

// jsdom'da HTMLDialogElement.showModal/close desteklenmez.
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
  }
});

const mockT = (key: string, params?: Record<string, unknown>) => {
  if (key === 'access.explainModal.title') return `Explain: ${params?.label ?? ''}`;
  return key;
};

const makeHttpPost = (response: unknown) =>
  vi.fn(async () => ({ data: response }));

test('ExplainPermissionModal DENIED_BY_ROLE reason render eder', async () => {
  const httpPost = makeHttpPost({
    allowed: false,
    reason: 'DENIED_BY_ROLE',
    details: {
      roleName: 'Satın Alma Müdürü',
      grantType: 'DENY',
      permissionType: 'ACTION',
      permissionKey: 'DELETE_PO',
    },
    userRoles: ['Satın Alma Müdürü'],
    userScopes: {},
  });

  render(
    <ExplainPermissionModal
      open={true}
      onClose={() => {}}
      userId="1"
      permissionType="ACTION"
      permissionKey="DELETE_PO"
      permissionLabel="Sipariş Sil"
      httpPost={httpPost}
      t={mockT}
    />,
  );

  await waitFor(() => expect(screen.queryByText('DENIED_BY_ROLE')).not.toBeNull());
  expect(screen.getByText('DENY')).toBeTruthy();
  expect(screen.getAllByText('Satın Alma Müdürü').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('DELETE_PO')).toBeTruthy();
});

test('ExplainPermissionModal open=false iken body render etmez', () => {
  const httpPost = makeHttpPost({});

  render(
    <ExplainPermissionModal
      open={false}
      onClose={() => {}}
      userId="1"
      permissionType="ACTION"
      permissionKey="DELETE_PO"
      httpPost={httpPost}
      t={mockT}
    />,
  );

  expect(screen.queryByText('DENIED_BY_ROLE')).toBeNull();
  expect(httpPost).not.toHaveBeenCalled();
});

test('P1.9: NO_SCOPE reason denied scope bilgisini render eder + slot fix', async () => {
  const httpPost = makeHttpPost({
    allowed: false,
    reason: 'NO_SCOPE',
    details: {
      roleName: null,
      grantType: null,
      permissionType: 'MODULE',
      permissionKey: 'PURCHASE',
      scopeType: 'COMPANY',
      scopeRefId: 99,
    },
    userRoles: ['Satın Alma Müdürü'],
    userScopes: { COMPANY: [11] },
  });

  render(
    <ExplainPermissionModal
      open={true}
      onClose={() => {}}
      userId="1"
      permissionType="MODULE"
      permissionKey="PURCHASE"
      permissionLabel="Satın Alma"
      httpPost={httpPost}
      t={mockT}
    />,
  );

  await waitFor(() => expect(screen.queryByText('NO_SCOPE')).not.toBeNull());
  const deniedScope = screen.getByTestId('explain-modal-denied-scope');
  expect(deniedScope.textContent).toBe('COMPANY:99');
  // permType/permKey slot bug fix verification — backend now keeps these
  // slots populated with the original permission even on NO_SCOPE.
  expect(screen.getByText('MODULE')).toBeTruthy();
  expect(screen.getByText('PURCHASE')).toBeTruthy();
});

test('P1.9: scope picker "Kontrol Et" scopeType+scopeRefId ile explain cagirir', async () => {
  const httpPost = makeHttpPost({
    allowed: true,
    reason: 'ALLOWED',
    details: {
      roleName: 'Admin',
      grantType: 'MANAGE',
      permissionType: 'MODULE',
      permissionKey: 'PURCHASE',
    },
    userRoles: ['Admin'],
    userScopes: { COMPANY: [11, 35] },
  });

  render(
    <ExplainPermissionModal
      open={true}
      onClose={() => {}}
      userId="1"
      permissionType="MODULE"
      permissionKey="PURCHASE"
      permissionLabel="Satın Alma"
      httpPost={httpPost}
      t={mockT}
    />,
  );

  await waitFor(() => expect(httpPost).toHaveBeenCalledTimes(1));
  // Initial auto-fetch: no scope keys forwarded.
  expect(httpPost.mock.calls[0][1]).toEqual({
    userId: '1',
    permissionType: 'MODULE',
    permissionKey: 'PURCHASE',
  });

  const scopeTypeSelect = screen.getByTestId('explain-modal-scope-type') as HTMLSelectElement;
  const scopeRefIdInput = screen.getByTestId('explain-modal-scope-refid') as HTMLInputElement;
  const scopeCheckBtn = screen.getByTestId('explain-modal-scope-check') as HTMLButtonElement;

  act(() => {
    fireEvent.change(scopeTypeSelect, { target: { value: 'COMPANY' } });
  });
  act(() => {
    fireEvent.change(scopeRefIdInput, { target: { value: '99' } });
  });
  act(() => {
    fireEvent.click(scopeCheckBtn);
  });

  await waitFor(() => expect(httpPost).toHaveBeenCalledTimes(2));
  expect(httpPost.mock.calls[1][1]).toMatchObject({
    userId: '1',
    permissionType: 'MODULE',
    permissionKey: 'PURCHASE',
    scopeType: 'COMPANY',
    scopeRefId: '99',
  });
});

test('P1.9: scope picker invalid refId error gösterir, explain cagrilmaz', async () => {
  const httpPost = makeHttpPost({
    allowed: true,
    reason: 'ALLOWED',
    details: {
      roleName: 'Admin',
      grantType: 'MANAGE',
      permissionType: 'MODULE',
      permissionKey: 'PURCHASE',
    },
    userRoles: ['Admin'],
    userScopes: {},
  });

  render(
    <ExplainPermissionModal
      open={true}
      onClose={() => {}}
      userId="1"
      permissionType="MODULE"
      permissionKey="PURCHASE"
      httpPost={httpPost}
      t={mockT}
    />,
  );

  await waitFor(() => expect(httpPost).toHaveBeenCalledTimes(1));

  const scopeTypeSelect = screen.getByTestId('explain-modal-scope-type') as HTMLSelectElement;
  const scopeRefIdInput = screen.getByTestId('explain-modal-scope-refid') as HTMLInputElement;
  const scopeCheckBtn = screen.getByTestId('explain-modal-scope-check') as HTMLButtonElement;

  act(() => {
    fireEvent.change(scopeTypeSelect, { target: { value: 'COMPANY' } });
  });
  act(() => {
    fireEvent.change(scopeRefIdInput, { target: { value: 'abc' } });
  });
  act(() => {
    fireEvent.click(scopeCheckBtn);
  });

  expect(screen.getByTestId('explain-modal-scope-error')).toBeTruthy();
  // httpPost hala sadece 1 kez çağrılmış (initial fetch), invalid input re-fetch tetiklemedi.
  expect(httpPost).toHaveBeenCalledTimes(1);
});
