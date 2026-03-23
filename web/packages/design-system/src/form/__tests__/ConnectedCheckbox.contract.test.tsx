// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ConnectedCheckbox } from '../connected/ConnectedCheckbox';
import type { ConnectedCheckboxProps } from '../connected/ConnectedCheckbox';
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

describe('ConnectedCheckbox — contract', () => {
  const defaultProps = {
    name: 'test',
  };

  it('renders without crash', () => {
    const { container } = render(<ConnectedCheckbox {...defaultProps} />, { wrapper: Wrapper });
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _connectedcheckboxprops: ConnectedCheckboxProps | undefined = undefined; void _connectedcheckboxprops;
    expect(true).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ConnectedCheckbox {...defaultProps} label="Accept terms" />, { wrapper: Wrapper });
    await expectNoA11yViolations(container);
  });
});
