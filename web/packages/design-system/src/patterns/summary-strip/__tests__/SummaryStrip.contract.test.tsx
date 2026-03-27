// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { SummaryStrip } from '../SummaryStrip';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultItems = [
  { key: 'revenue', label: 'Revenue', value: '$12,500' },
  { key: 'orders', label: 'Orders', value: '48' },
  { key: 'customers', label: 'Customers', value: '120' },
];

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('SummaryStrip contract — default render', () => {
  it('renders all items', () => {
    render(<SummaryStrip items={defaultItems} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,500')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
  });

  it('renders each item as an article element', () => {
    const { container } = render(<SummaryStrip items={defaultItems} />);
    const articles = container.querySelectorAll('article');
    expect(articles).toHaveLength(3);
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('SummaryStrip contract — key props', () => {
  it('renders title when provided', () => {
    render(<SummaryStrip items={defaultItems} title="Key Metrics" />);
    expect(screen.getByText('Key Metrics')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <SummaryStrip items={defaultItems} description="Last 30 days" />,
    );
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('renders item note when provided', () => {
    const items = [
      { key: 'rev', label: 'Revenue', value: '$500', note: '+12% vs last month' },
    ];
    render(<SummaryStrip items={items} />);
    expect(screen.getByText('+12% vs last month')).toBeInTheDocument();
  });

  it('renders item trend slot', () => {
    const items = [
      { key: 'rev', label: 'Revenue', value: '$500', trend: <span data-testid="trend-up">Up</span> },
    ];
    render(<SummaryStrip items={items} />);
    expect(screen.getByTestId('trend-up')).toBeInTheDocument();
  });

  it('renders item icon slot', () => {
    const items = [
      { key: 'rev', label: 'Revenue', value: '$500', icon: <svg data-testid="rev-icon" /> },
    ];
    render(<SummaryStrip items={items} />);
    expect(screen.getByTestId('rev-icon')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('SummaryStrip contract — className merging', () => {
  it('merges custom className onto root', () => {
    const { container } = render(
      <SummaryStrip items={defaultItems} className="custom-strip" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('custom-strip');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('SummaryStrip — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<SummaryStrip items={defaultItems} />);
    await expectNoA11yViolations(container);
  });
});
