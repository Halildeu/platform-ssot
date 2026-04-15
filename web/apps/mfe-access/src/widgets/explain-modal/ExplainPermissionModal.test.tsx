// @vitest-environment jsdom
import { test, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExplainPermissionModal } from './ExplainPermissionModal';

// jsdom'da HTMLDialogElement.showModal/close desteklenmez.
// Design-system Modal bu API'ye bagli; test'ler icin polyfill gerekli.
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

// Hook mock — STORY-0318 §6 DENY senaryosu
vi.mock('@mfe/auth', () => ({
  useExplainPermission: () => ({
    explain: vi.fn(),
    result: {
      allowed: false,
      reason: 'DENIED_BY_ROLE' as const,
      details: {
        roleName: 'Satın Alma Müdürü',
        grantType: 'DENY',
        permissionType: 'ACTION',
        permissionKey: 'DELETE_PO',
      },
      userRoles: ['Satın Alma Müdürü'],
      userScopes: {},
    },
    loading: false,
    error: null,
  }),
}));

vi.mock('@mfe/shared-http', () => ({
  api: { post: vi.fn() },
}));

const mockT = (key: string, params?: Record<string, unknown>) => {
  if (key === 'access.explainModal.title') return `Explain: ${params?.label ?? ''}`;
  return key;
};

test('ExplainPermissionModal DENIED_BY_ROLE reason render eder', () => {
  render(
    <ExplainPermissionModal
      open={true}
      onClose={() => {}}
      userId="1"
      permissionType="ACTION"
      permissionKey="DELETE_PO"
      permissionLabel="Sipariş Sil"
      t={mockT}
    />,
  );

  // Reason badge
  expect(screen.getByText('DENIED_BY_ROLE')).toBeTruthy();
  // Grant type badge
  expect(screen.getByText('DENY')).toBeTruthy();
  // Source role name render ediliyor (hem details tablosunda hem userRoles listesinde
  // — Badge olarak; getAllByText ikisini de yakalar, length >= 1 kontrolu yeterli).
  expect(screen.getAllByText('Satın Alma Müdürü').length).toBeGreaterThanOrEqual(1);
  // Permission key echoed back
  expect(screen.getByText('DELETE_PO')).toBeTruthy();
});

test('ExplainPermissionModal open=false iken body render etmez', () => {
  render(
    <ExplainPermissionModal
      open={false}
      onClose={() => {}}
      userId="1"
      permissionType="ACTION"
      permissionKey="DELETE_PO"
      t={mockT}
    />,
  );

  // Body content ('DENIED_BY_ROLE') modal kapali iken DOM'da gorunmemeli.
  // Design-system Modal `keepMounted=false` default — content render edilmez.
  expect(screen.queryByText('DENIED_BY_ROLE')).toBeNull();
});
