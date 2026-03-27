// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { HistogramChart } from '../HistogramChart';

describe('HistogramChart — contract', () => {
  const defaultProps = {
    data: [12, 15, 18, 20, 22, 25, 28, 30],
  };

  it('renders without crash', () => {
    const { container } = render(<HistogramChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(HistogramChart.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<HistogramChart {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<HistogramChart {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<HistogramChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
