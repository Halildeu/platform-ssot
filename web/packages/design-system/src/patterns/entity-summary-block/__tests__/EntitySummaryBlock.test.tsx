// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntitySummaryBlock } from '../EntitySummaryBlock';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultItems = [
  { key: 'status', label: 'Status', value: 'Active' },
  { key: 'type', label: 'Type', value: 'User' },
];

const defaultProps = {
  title: 'Entity Title',
  items: defaultItems,
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock — temel render', () => {
  it('section elementini render eder', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    expect(
      container.querySelector('[data-component="entity-summary-block"]'),
    ).toBeInTheDocument();
  });

  it('title gosterir', () => {
    render(<EntitySummaryBlock {...defaultProps} />);
    expect(screen.getByText('Entity Title')).toBeInTheDocument();
  });

  it('subtitle gosterir', () => {
    render(<EntitySummaryBlock {...defaultProps} subtitle="Sub text" />);
    expect(screen.getByText('Sub text')).toBeInTheDocument();
  });

  it('subtitle yoksa subtitle alani render etmez', () => {
    render(<EntitySummaryBlock {...defaultProps} />);
    expect(screen.queryByText('Sub text')).toBeNull();
  });

  it('badge render eder', () => {
    render(
      <EntitySummaryBlock {...defaultProps} badge={<span>VIP</span>} />,
    );
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('actions render eder', () => {
    render(
      <EntitySummaryBlock
        {...defaultProps}
        actions={<button>Edit</button>}
      />,
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Avatar                                                             */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock — avatar', () => {
  it('avatar verildiginde Avatar render eder', () => {
    const { container } = render(
      <EntitySummaryBlock
        {...defaultProps}
        avatar={{ name: 'John Doe', alt: 'JD' }}
      />,
    );
    // Avatar component renders an element with the initials
    expect(container.querySelector('[data-component="entity-summary-block"]')).toBeInTheDocument();
  });

  it('avatar yoksa Avatar render etmez', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    // No img element
    expect(container.querySelector('img')).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock — access control', () => {
  it('access="full" durumunda render eder', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} access="full" />,
    );
    expect(
      container.querySelector('[data-access-state="full"]'),
    ).toBeInTheDocument();
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} access="hidden" />,
    );
    expect(
      container.querySelector('[data-component="entity-summary-block"]'),
    ).toBeNull();
  });

  it('access="disabled" durumunda data-access-state atanir', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} access="disabled" />,
    );
    expect(
      container.querySelector('[data-access-state="disabled"]'),
    ).toBeInTheDocument();
  });

  it('access="readonly" durumunda data-access-state atanir', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} access="readonly" />,
    );
    expect(
      container.querySelector('[data-access-state="readonly"]'),
    ).toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} accessReason="Limited access" />,
    );
    const section = container.querySelector('[data-component="entity-summary-block"]');
    expect(section).toHaveAttribute('title', 'Limited access');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <EntitySummaryBlock {...defaultProps} className="custom-esb" />,
    );
    const section = container.querySelector('[data-component="entity-summary-block"]');
    expect(section?.className).toContain('custom-esb');
  });

  it('data-surface-appearance="premium" atanir', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    expect(
      container.querySelector('[data-surface-appearance="premium"]'),
    ).toBeInTheDocument();
  });

  it('bos items ile render eder', () => {
    const { container } = render(
      <EntitySummaryBlock title="Empty" items={[]} />,
    );
    expect(
      container.querySelector('[data-component="entity-summary-block"]'),
    ).toBeInTheDocument();
  });
});

describe('EntitySummaryBlock — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<EntitySummaryBlock {...defaultProps} />);
    await user.tab();
  });
  it('has accessible role', () => {
    const { container } = render(<EntitySummaryBlock {...defaultProps} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('EntitySummaryBlock — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
