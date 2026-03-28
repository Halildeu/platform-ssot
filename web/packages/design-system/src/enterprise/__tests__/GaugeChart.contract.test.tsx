// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { GaugeChart } from '../GaugeChart';

describe('GaugeChart — contract', () => {
  const defaultProps = { value: 50 };

  it('renders without crash', () => {
    const { container } = render(<GaugeChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(GaugeChart.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<GaugeChart {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<GaugeChart {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<GaugeChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
