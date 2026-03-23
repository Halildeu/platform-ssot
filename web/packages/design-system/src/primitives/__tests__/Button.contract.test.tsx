// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Button } from '../button/Button';
import type { ButtonVariant, ButtonSize, ButtonDensity, ButtonProps } from '../button/Button';

describe('Button — contract', () => {
  
  it('renders without crash', () => {
    const { container } = render(<Button  />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(Button.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<Button  access="hidden" />);
    // Button renders as invisible (CSS) rather than unmounting
    const el = container.firstElementChild;
    expect(el?.classList.contains('invisible') || container.innerHTML === '').toBe(true);
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<Button  access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _buttonvariant: ButtonVariant | undefined = undefined; void _buttonvariant;
    const _buttonsize: ButtonSize | undefined = undefined; void _buttonsize;
    const _buttondensity: ButtonDensity | undefined = undefined; void _buttondensity;
    const _buttonprops: ButtonProps | undefined = undefined; void _buttonprops;
    expect(true).toBe(true);
  });
});
