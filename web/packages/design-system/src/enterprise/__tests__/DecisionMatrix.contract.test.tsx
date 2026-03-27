// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { DecisionMatrix } from '../DecisionMatrix';

describe('DecisionMatrix — contract', () => {
  const defaultProps = {
    options: [],
    criteria: [],
    scores: [],
  };

  it('renders without crash', () => {
    const { container } = render(<DecisionMatrix {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(DecisionMatrix.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<DecisionMatrix {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<DecisionMatrix {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<DecisionMatrix {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
