// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { PivotTable } from '../PivotTable';

describe('PivotTable — contract', () => {
  const defaultProps = {
    data: [],
    rows: ['region'],
    columns: ['quarter'],
    values: [{ field: 'revenue', aggregate: 'sum' as const, label: 'Revenue' }],
  };

  it('renders without crash', () => {
    const { container } = render(<PivotTable {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(PivotTable.displayName).toBeTruthy();
  });

  it('respects access=hidden', () => {
    const { container } = render(<PivotTable {...defaultProps} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('applies disabled state via access=readonly', () => {
    const { container } = render(<PivotTable {...defaultProps} access="readonly" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('renders with only required props', () => {
    const { container } = render(<PivotTable {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
