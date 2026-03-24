// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { BoxPlot } from '../BoxPlot';

describe('BoxPlot — contract', () => {
  const defaultProps = {
    data: [{ label: 'Q1', min: 5, q1: 15, median: 25, q3: 35, max: 50 }],
  };

  it('renders without crash', () => {
    const { container } = render(<BoxPlot {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(BoxPlot.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<BoxPlot {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<BoxPlot {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<BoxPlot {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
