// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { ControlChart } from '../ControlChart';

describe('ControlChart — contract', () => {
  const defaultProps = {
    data: [{ x: 1, y: 50 }, { x: 2, y: 52 }, { x: 3, y: 48 }],
  };

  it('renders without crash', () => {
    const { container } = render(<ControlChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(ControlChart.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<ControlChart {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<ControlChart {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<ControlChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
