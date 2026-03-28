// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToast } from '../toast/Toast';
import type { ToastVariant, ToastPosition, ToastData, ToastProviderProps } from '../toast/Toast';

describe('Toast — contract', () => {

  it('renders ToastProvider without crash', () => {
    const { container } = render(
      <ToastProvider>
        <div>App</div>
      </ToastProvider>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('ToastProvider has displayName', () => {
    expect(ToastProvider.displayName).toBeTruthy();
  });

  it('useToast throws outside provider', () => {
    const TestComponent = () => {
      expect(() => useToast()).toThrow();
      return null;
    };
    render(<TestComponent />);
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _toastvariant: ToastVariant | undefined = undefined; void _toastvariant;
    const _toastposition: ToastPosition | undefined = undefined; void _toastposition;
    const _toastdata: ToastData | undefined = undefined; void _toastdata;
    const _toastproviderprops: ToastProviderProps | undefined = undefined; void _toastproviderprops;
    expect(true).toBe(true);
  });
});
