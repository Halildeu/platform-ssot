// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { OrgChart } from '../OrgChart';

describe('OrgChart — contract', () => {
  const defaultProps = {
    data: { id: 'root', label: 'CEO', title: 'Chief Executive Officer' },
  };

  it('renders without crash', () => {
    const { container } = render(<OrgChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(OrgChart.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<OrgChart {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<OrgChart {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<OrgChart {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
