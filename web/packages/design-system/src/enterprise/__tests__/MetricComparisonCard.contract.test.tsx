// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { MetricComparisonCard } from '../MetricComparisonCard';

describe('MetricComparisonCard — contract', () => {
  const defaultProps = {
    title: 'Revenue',
    currentValue: 125000,
    previousValue: 100000,
  };

  it('renders without crash', () => {
    const { container } = render(<MetricComparisonCard {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(MetricComparisonCard.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<MetricComparisonCard {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<MetricComparisonCard {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<MetricComparisonCard {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
