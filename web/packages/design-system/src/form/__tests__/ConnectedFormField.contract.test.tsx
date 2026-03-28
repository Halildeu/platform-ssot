// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ConnectedFormField } from '../ConnectedFormField';
import type { ConnectedFormFieldProps } from '../ConnectedFormField';
import { FormContext } from '../FormContext';
import type { FormContextValue } from '../FormContext';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

const mockFormContext: FormContextValue = {
  values: {},
  errors: {},
  touched: {},
  dirtyFields: {},
  access: 'full',
  mode: 'onBlur',
  setFieldValue: vi.fn(),
  setFieldTouched: vi.fn(),
  setFieldError: vi.fn(),
  clearFieldError: vi.fn(),
  validateField: vi.fn(() => null),
  validateForm: vi.fn(() => ({})),
  reset: vi.fn(),
  isValid: true,
  isDirty: false,
  isSubmitting: false,
  validator: null,
};

function Wrapper({ children }: { children: React.ReactNode }) {
  return <FormContext.Provider value={mockFormContext}>{children}</FormContext.Provider>;
}

describe('ConnectedFormField — contract', () => {
  const defaultProps = {
    name: 'test',
  };

  it('renders without crash', () => {
    const { container } = render(
      <ConnectedFormField {...defaultProps}><input /></ConnectedFormField>,
      { wrapper: Wrapper },
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(ConnectedFormField.displayName).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(
      <ConnectedFormField {...defaultProps}><input /></ConnectedFormField>,
      { wrapper: Wrapper },
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _connectedformfieldprops: ConnectedFormFieldProps | undefined = undefined; void _connectedformfieldprops;
    expect(true).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ConnectedFormField {...defaultProps} label="Field label"><input aria-label="Field label" /></ConnectedFormField>,
      { wrapper: Wrapper },
    );
    await expectNoA11yViolations(container);
  });
});
