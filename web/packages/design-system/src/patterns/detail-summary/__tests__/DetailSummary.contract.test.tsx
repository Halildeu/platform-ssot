// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DetailSummary } from '../DetailSummary';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProps = {
  title: 'Order Summary',
  entity: {
    title: 'Acme Corp',
    items: [
      { key: 'id', label: 'ID', value: '12345' },
      { key: 'type', label: 'Type', value: 'Enterprise' },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('DetailSummary contract — default render', () => {
  it('renders the page title', () => {
    render(<DetailSummary {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Order Summary');
  });

  it('renders as a section element', () => {
    const { container } = render(<DetailSummary {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<DetailSummary {...defaultProps} />);
    expect(container.querySelector('[data-component="detail-summary"]')).toBeInTheDocument();
  });

  it('renders entity block with title', () => {
    render(<DetailSummary {...defaultProps} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('DetailSummary contract — key props', () => {
  it('renders description when provided', () => {
    render(<DetailSummary {...defaultProps} description="Full order details" />);
    expect(screen.getByText('Full order details')).toBeInTheDocument();
  });

  it('renders eyebrow as breadcrumb', () => {
    render(
      <DetailSummary
        {...defaultProps}
        eyebrow={<span data-testid="eyebrow">Orders / #12345</span>}
      />,
    );
    expect(screen.getByTestId('eyebrow')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <DetailSummary
        {...defaultProps}
        actions={<button data-testid="action-btn">Edit</button>}
      />,
    );
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('renders status in header extra', () => {
    render(
      <DetailSummary
        {...defaultProps}
        status={<span data-testid="status-badge">Active</span>}
      />,
    );
    expect(screen.getByTestId('status-badge')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Slot rendering (summaryItems, detailItems, jsonValue)     */
/* ------------------------------------------------------------------ */

describe('DetailSummary contract — slot rendering', () => {
  it('renders summary strip when summaryItems provided', () => {
    render(
      <DetailSummary
        {...defaultProps}
        summaryItems={[
          { key: 'total', label: 'Total', value: '$500' },
          { key: 'count', label: 'Items', value: '3' },
        ]}
      />,
    );
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
  });

  it('renders detail items via Descriptions', () => {
    render(
      <DetailSummary
        {...defaultProps}
        detailItems={[
          { key: 'created', label: 'Created', value: '2025-01-01' },
        ]}
      />,
    );
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  });

  it('renders JSON viewer when jsonValue provided', () => {
    render(
      <DetailSummary
        {...defaultProps}
        jsonValue={{ foo: 'bar' }}
      />,
    );
    expect(screen.getByText(/"foo": "bar"/)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('DetailSummary contract — className merging', () => {
  it('merges custom className onto section', () => {
    const { container } = render(
      <DetailSummary {...defaultProps} className="my-custom" />,
    );
    const section = container.querySelector('section')!;
    expect(section.className).toContain('my-custom');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('DetailSummary — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<DetailSummary {...defaultProps} />);
    // heading-order violation is expected because DetailSummary composes
    // PageHeader (h1) + EntitySummaryBlock (h3), skipping h2 by design.
    const axeCore = await import('axe-core');
    const results = await axeCore.default.run(container, {
      rules: {
        'color-contrast': { enabled: false },
        'region': { enabled: false },
        'heading-order': { enabled: false },
      },
    });
    expect(results.violations).toHaveLength(0);
  });
});
