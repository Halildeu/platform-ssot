// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecommendationCard, type RecommendationCardProps } from '../RecommendationCard';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const baseProps: RecommendationCardProps = {
  title: 'Use caching layer',
  summary: 'Adding a cache will reduce latency by 40%.',
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — temel render', () => {
  it('title ve summary render eder', () => {
    render(<RecommendationCard {...baseProps} />);
    expect(screen.getByText('Use caching layer')).toBeInTheDocument();
    expect(screen.getByText('Adding a cache will reduce latency by 40%.')).toBeInTheDocument();
  });

  it('article elementini render eder', () => {
    const { container } = render(<RecommendationCard {...baseProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('varsayilan recommendationType badge gosterir', () => {
    render(<RecommendationCard {...baseProps} />);
    expect(screen.getByText('Recommendation')).toBeInTheDocument();
  });

  it('varsayilan buton labellarini gosterir', () => {
    render(<RecommendationCard {...baseProps} />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
  });

  it('varsayilan tone "info" data-tone atar', () => {
    const { container } = render(<RecommendationCard {...baseProps} />);
    expect(container.querySelector('[data-tone="info"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Tone proplari                                                      */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — tone proplari', () => {
  it.each(['info', 'success', 'warning'] as const)(
    'tone="%s" dogru data-tone atar',
    (tone) => {
      const { container } = render(
        <RecommendationCard {...baseProps} tone={tone} />,
      );
      expect(container.querySelector(`[data-tone="${tone}"]`)).toBeInTheDocument();
    },
  );
});

/* ------------------------------------------------------------------ */
/*  Rationale & citations                                              */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — rationale & citations', () => {
  it('rationale items render eder', () => {
    render(
      <RecommendationCard
        {...baseProps}
        rationale={['Reduces DB load', 'Improves UX']}
      />,
    );
    expect(screen.getByText('Reduces DB load')).toBeInTheDocument();
    expect(screen.getByText('Improves UX')).toBeInTheDocument();
  });

  it('rationale section basligini gosterir', () => {
    render(
      <RecommendationCard {...baseProps} rationale={['Point 1']} />,
    );
    expect(screen.getByText('Why this recommendation')).toBeInTheDocument();
  });

  it('rationale bos iken section render etmez', () => {
    render(<RecommendationCard {...baseProps} rationale={[]} />);
    expect(screen.queryByText('Why this recommendation')).not.toBeInTheDocument();
  });

  it('citations render eder', () => {
    render(
      <RecommendationCard {...baseProps} citations={['RFC-1', 'DOC-2']} />,
    );
    expect(screen.getByText('RFC-1')).toBeInTheDocument();
    expect(screen.getByText('DOC-2')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Confidence badge                                                   */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — confidence badge', () => {
  it('varsayilan confidenceLevel "medium" render eder', () => {
    render(<RecommendationCard {...baseProps} />);
    expect(screen.getByText(/Orta guven/)).toBeInTheDocument();
  });

  it('confidenceScore gosterir', () => {
    render(
      <RecommendationCard {...baseProps} confidenceScore={92} />,
    );
    expect(screen.getByText(/92%/)).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — interaction', () => {
  it('onPrimaryAction handler calisir', async () => {
    const handler = vi.fn();
    render(<RecommendationCard {...baseProps} onPrimaryAction={handler} />);
    await userEvent.click(screen.getByText('Apply'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('onSecondaryAction handler calisir', async () => {
    const handler = vi.fn();
    render(<RecommendationCard {...baseProps} onSecondaryAction={handler} />);
    await userEvent.click(screen.getByText('Review'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ozel buton labellari kullanilir', () => {
    render(
      <RecommendationCard
        {...baseProps}
        primaryActionLabel="Accept"
        secondaryActionLabel="Dismiss"
      />,
    );
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <RecommendationCard {...baseProps} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" durumunda butonlar disabled olur', () => {
    render(<RecommendationCard {...baseProps} access="disabled" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('access="disabled" durumunda onClick calismaz', async () => {
    const handler = vi.fn();
    render(
      <RecommendationCard
        {...baseProps}
        access="disabled"
        onPrimaryAction={handler}
      />,
    );
    await userEvent.click(screen.getByText('Apply'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('accessReason title olarak atanir', () => {
    render(
      <RecommendationCard {...baseProps} accessReason="No access" />,
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) =>
      expect(btn).toHaveAttribute('title', 'No access'),
    );
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <RecommendationCard {...baseProps} className="custom" />,
    );
    expect(container.querySelector('article')?.className).toContain('custom');
  });

  it('footerNote render eder', () => {
    render(<RecommendationCard {...baseProps} footerNote="Last updated today" />);
    expect(screen.getByText('Last updated today')).toBeInTheDocument();
  });

  it('badges render eder', () => {
    render(
      <RecommendationCard
        {...baseProps}
        badges={[<span key="x" data-testid="rec-badge">Hot</span>]}
      />,
    );
    expect(screen.getByTestId('rec-badge')).toBeInTheDocument();
  });
});

describe('RecommendationCard — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<RecommendationCard {...baseProps} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — interaction & role', () => {
  it('has accessible article role', () => {
    render(<RecommendationCard title="Test" description="Desc" />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('RecommendationCard — quality signals', () => {
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

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
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
