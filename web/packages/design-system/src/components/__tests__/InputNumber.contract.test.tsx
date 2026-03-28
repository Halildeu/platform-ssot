// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { InputNumber } from '../input-number/InputNumber';
import type { InputNumberProps } from '../input-number/InputNumber';

describe('InputNumber — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<InputNumber  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(InputNumber.displayName).toBeTruthy();
  });

  it('renders with only required props (0 required, 21 optional)', () => {
    // All 21 optional props omitted — should not crash
    const { container } = render(<InputNumber  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _inputnumberprops: InputNumberProps | undefined = undefined; void _inputnumberprops;
    expect(true).toBe(true);
  });
});
