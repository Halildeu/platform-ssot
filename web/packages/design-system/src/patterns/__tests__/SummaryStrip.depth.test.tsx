// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';

import { SummaryStrip } from '../summary-strip/SummaryStrip';

afterEach(cleanup);

describe('SummaryStrip — depth', () => {
  const items = [
    { key: 'a', label: 'Revenue', value: '$10K' },
    { key: 'b', label: 'Users', value: '500', tone: 'success' as const },
  ];

  it('renders all item labels and values', () => {
    render(<SummaryStrip items={items} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$10K')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders title and description', () => {
    render(<SummaryStrip items={items} title="KPI Panel" description="Monthly overview" />);
    expect(screen.getByText('KPI Panel')).toBeInTheDocument();
    expect(screen.getByText('Monthly overview')).toBeInTheDocument();
  });

  it('empty items renders safely', () => {
    const { container } = render(<SummaryStrip items={[]} />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('disabled — returns null when access hidden', () => {
    const { container } = render(<SummaryStrip items={items} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('error — renders icon slot', () => {
    const itemsWithIcon = [
      { key: 'c', label: 'Cost', value: '$5K', icon: <span role="img" data-testid="icon">IC</span> },
    ];
    render(<SummaryStrip items={itemsWithIcon} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('click on strip container does not crash', () => {
    const { container } = render(<SummaryStrip items={items} className="click-test" />);
    const strip = container.firstElementChild!;
    fireEvent.click(strip);
    expect(strip).toBeInTheDocument();
  });
});
