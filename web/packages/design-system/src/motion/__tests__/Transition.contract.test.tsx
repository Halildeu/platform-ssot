// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
// Regenerate with: node scripts/ci/generate-contract-tests.mjs --write
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Transition } from '../Transition';
import type { TransitionProps } from '../Transition';

describe('Transition — contract', () => {
  const defaultProps = {
    show: true,
    children: <div>test</div> as React.ReactElement,
  };

  it('renders without crash', () => {
    const { container } = render(<Transition {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(Transition.displayName).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<Transition {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('exports expected types', () => {
    // Type-level check — if this compiles, types are exported correctly
    const _transitionprops: TransitionProps | undefined = undefined; void _transitionprops;
    expect(true).toBe(true);
  });
});
