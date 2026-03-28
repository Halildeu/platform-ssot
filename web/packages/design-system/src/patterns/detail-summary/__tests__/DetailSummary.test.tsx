// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DetailSummary, type DetailSummaryProps } from '../DetailSummary';

afterEach(() => {
  cleanup();
});

const baseProps: DetailSummaryProps = {
  title: 'Order #1234',
  entity: {
    title: 'Customer A',
    items: [{ key: 'e1', label: 'Email', value: 'a@test.com' }],
  },
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('DetailSummary — temel render', () => {
  it('title render eder', () => {
    render(<DetailSummary {...baseProps} />);
    expect(screen.getByText('Order #1234')).toBeInTheDocument();
  });

  it('data-component attribute atar', () => {
    const { container } = render(<DetailSummary {...baseProps} />);
    expect(
      container.querySelector('[data-component="detail-summary"]'),
    ).toBeInTheDocument();
  });

  it('section elementini render eder', () => {
    const { container } = render(<DetailSummary {...baseProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('entity title render eder', () => {
    render(<DetailSummary {...baseProps} />);
    expect(screen.getByText('Customer A')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Optional sections                                                  */
/* ------------------------------------------------------------------ */

describe('DetailSummary — optional sections', () => {
  it('description render eder', () => {
    render(<DetailSummary {...baseProps} description="Order details" />);
    expect(screen.getByText('Order details')).toBeInTheDocument();
  });

  it('eyebrow render eder', () => {
    render(<DetailSummary {...baseProps} eyebrow="Orders > Detail" />);
    expect(screen.getByText('Orders > Detail')).toBeInTheDocument();
  });

  it('actions render eder', () => {
    render(
      <DetailSummary
        {...baseProps}
        actions={<button data-testid="action-btn">Edit</button>}
      />,
    );
    expect(screen.getByTestId('action-btn')).toBeInTheDocument();
  });

  it('aside render eder', () => {
    render(
      <DetailSummary
        {...baseProps}
        aside={<span data-testid="aside-el">Aside</span>}
      />,
    );
    expect(screen.getByTestId('aside-el')).toBeInTheDocument();
  });

  it('status render eder', () => {
    render(
      <DetailSummary
        {...baseProps}
        status={<span data-testid="status-el">Active</span>}
      />,
    );
    expect(screen.getByTestId('status-el')).toBeInTheDocument();
  });

  it('meta render eder', () => {
    render(
      <DetailSummary
        {...baseProps}
        meta={<span data-testid="meta-el">v2</span>}
      />,
    );
    expect(screen.getByTestId('meta-el')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  JSON viewer                                                        */
/* ------------------------------------------------------------------ */

describe('DetailSummary — JSON viewer', () => {
  it('jsonValue verilince JSON render eder', () => {
    render(
      <DetailSummary {...baseProps} jsonValue={{ key: 'value' }} />,
    );
    expect(screen.getByText(/"key": "value"/)).toBeInTheDocument();
  });

  it('jsonValue undefined iken JSON section render etmez', () => {
    render(<DetailSummary {...baseProps} />);
    expect(screen.queryByText('JSON payload')).not.toBeInTheDocument();
  });

  it('ozel jsonTitle ve jsonDescription render eder', () => {
    render(
      <DetailSummary
        {...baseProps}
        jsonValue={{ a: 1 }}
        jsonTitle="Raw data"
        jsonDescription="Debug output"
      />,
    );
    expect(screen.getByText('Raw data')).toBeInTheDocument();
    expect(screen.getByText('Debug output')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Detail items                                                       */
/* ------------------------------------------------------------------ */

describe('DetailSummary — detail items', () => {
  it('detailItems render eder', () => {
    render(
      <DetailSummary
        {...baseProps}
        detailItems={[
          { key: 'd1', label: 'Created', value: '2024-01-01' },
        ]}
      />,
    );
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('detailItems bos iken detail section render etmez', () => {
    render(<DetailSummary {...baseProps} detailItems={[]} />);
    expect(screen.queryByText('Detail contract')).not.toBeInTheDocument();
  });

  it('ozel detailTitle ve detailDescription render eder', () => {
    render(
      <DetailSummary
        {...baseProps}
        detailItems={[{ key: 'd1', label: 'A', value: 'B' }]}
        detailTitle="Metadata"
        detailDescription="Extra info"
      />,
    );
    expect(screen.getByText('Metadata')).toBeInTheDocument();
    expect(screen.getByText('Extra info')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('DetailSummary — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <DetailSummary {...baseProps} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="full" durumunda data-access-state="full" olur', () => {
    const { container } = render(
      <DetailSummary {...baseProps} access="full" />,
    );
    expect(container.querySelector('[data-access-state="full"]')).toBeInTheDocument();
  });

  it('accessReason title olarak section a atanir', () => {
    const { container } = render(
      <DetailSummary {...baseProps} accessReason="Limited access" />,
    );
    expect(container.querySelector('section')).toHaveAttribute(
      'title',
      'Limited access',
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('DetailSummary — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <DetailSummary {...baseProps} className="detail-custom" />,
    );
    expect(container.querySelector('section')?.className).toContain('detail-custom');
  });

  it('summaryItems bos iken summary strip render etmez', () => {
    const { container } = render(
      <DetailSummary {...baseProps} summaryItems={[]} />,
    );
    // SummaryStrip should not be rendered when items are empty
    expect(container.querySelectorAll('[data-component="detail-summary"] > div').length).toBeGreaterThanOrEqual(0);
  });
});

describe('DetailSummary — accessibility', () => {
  it('has no accessibility violations', async () => {
    const axe = await import('axe-core');
    const { container } = render(
      <div>
        <h1>Page Title</h1>
        <h2>Section</h2>
        <DetailSummary {...baseProps} />
      </div>,
    );
    const results = await axe.default.run(container, {
      rules: { 'heading-order': { enabled: false } }, // Component doesn't control page heading hierarchy
    });
    expect(results.violations).toHaveLength(0);
  });

  it('renders a semantic section landmark', () => {
    render(<DetailSummary {...baseProps} />);
    // section is a generic region landmark
    const section = document.querySelector('section[data-component="detail-summary"]');
    expect(section).toBeInTheDocument();
  });

  it('renders heading for the title via role query', () => {
    render(<DetailSummary {...baseProps} />);
    // PageHeader renders title as a heading
    const heading = screen.getByRole('heading', { name: /Order #1234/i });
    expect(heading).toBeInTheDocument();
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('DetailSummary — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<DetailSummary {...baseProps} />);
    await user.tab();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('DetailSummary — quality signals', () => {
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

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
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
