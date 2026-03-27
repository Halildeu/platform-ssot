// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { EntitySummaryBlock } from '../EntitySummaryBlock';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultProps = {
  title: 'Acme Corporation',
  items: [
    { key: 'id', label: 'ID', value: 'ENT-001' },
    { key: 'type', label: 'Type', value: 'Enterprise' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Contract: Default render                                           */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock contract — default render', () => {
  it('renders title as h3 heading', () => {
    render(<EntitySummaryBlock {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Acme Corporation');
  });

  it('renders as a section element', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    expect(container.querySelector('[data-component="entity-summary-block"]')).toBeInTheDocument();
  });

  it('renders description items', () => {
    render(<EntitySummaryBlock {...defaultProps} />);
    expect(screen.getByText('ENT-001')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Key props                                                */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock contract — key props', () => {
  it('renders subtitle when provided', () => {
    render(<EntitySummaryBlock {...defaultProps} subtitle="Technology company" />);
    expect(screen.getByText('Technology company')).toBeInTheDocument();
  });

  it('renders badge slot', () => {
    render(
      <EntitySummaryBlock
        {...defaultProps}
        badge={<span data-testid="badge">Premium</span>}
      />,
    );
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <EntitySummaryBlock
        {...defaultProps}
        actions={<button data-testid="edit-btn">Edit</button>}
      />,
    );
    expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
  });

  it('returns null when access=hidden', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: className merging                                        */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock contract — className merging', () => {
  it('merges custom className onto section', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} className="custom-entity" />,
    );
    const section = container.querySelector('section')!;
    expect(section.className).toContain('custom-entity');
  });
});

/* ------------------------------------------------------------------ */
/*  Contract: Accessibility                                            */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});
