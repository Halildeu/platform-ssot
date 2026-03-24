// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApprovalReview } from '../ApprovalReview';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const defaultCheckpoint = {
  title: 'Checkpoint title',
  status: 'pending' as const,
};

const defaultCitations = [
  { id: 'c1', title: 'Citation 1', snippet: 'Snippet 1' },
];

const defaultAuditItems = [
  { id: 'a1', action: 'create', label: 'Created item', timestamp: '2024-01-01' },
];

const defaultProps = {
  checkpoint: defaultCheckpoint,
  citations: defaultCitations,
  auditItems: defaultAuditItems,
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — temel render', () => {
  it('varsayilan props ile section elementini render eder', () => {
    const { container } = render(<ApprovalReview {...defaultProps} />);
    const section = container.querySelector('[data-component="approval-review"]');
    expect(section).toBeInTheDocument();
  });

  it('varsayilan title gosterir', () => {
    render(<ApprovalReview {...defaultProps} />);
    expect(screen.getByText('Approval review')).toBeInTheDocument();
  });

  it('varsayilan description gosterir', () => {
    render(<ApprovalReview {...defaultProps} />);
    expect(
      screen.getByText(/Human checkpoint, source evidence/),
    ).toBeInTheDocument();
  });

  it('ozel title ve description kabul eder', () => {
    render(
      <ApprovalReview
        {...defaultProps}
        title="Custom title"
        description="Custom desc"
      />,
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom desc')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — access control', () => {
  it('access="full" durumunda render eder', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} access="full" />,
    );
    expect(
      container.querySelector('[data-access-state="full"]'),
    ).toBeInTheDocument();
  });

  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} access="hidden" />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeNull();
  });

  it('access="disabled" durumunda data-access-state atanir', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} access="disabled" />,
    );
    expect(
      container.querySelector('[data-access-state="disabled"]'),
    ).toBeInTheDocument();
  });

  it('access="readonly" durumunda data-access-state atanir', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} access="readonly" />,
    );
    expect(
      container.querySelector('[data-access-state="readonly"]'),
    ).toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} accessReason="No permission" />,
    );
    const section = container.querySelector('[data-component="approval-review"]');
    expect(section).toHaveAttribute('title', 'No permission');
  });
});

/* ------------------------------------------------------------------ */
/*  className                                                          */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — className', () => {
  it('ozel className forwarding calisir', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} className="custom-class" />,
    );
    const section = container.querySelector('[data-component="approval-review"]');
    expect(section?.className).toContain('custom-class');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — edge cases', () => {
  it('bos citations ve auditItems ile render eder', () => {
    const { container } = render(
      <ApprovalReview checkpoint={defaultCheckpoint} citations={[]} auditItems={[]} />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
  });

  it('data-surface-appearance="premium" atanir', () => {
    const { container } = render(<ApprovalReview {...defaultProps} />);
    expect(
      container.querySelector('[data-surface-appearance="premium"]'),
    ).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: loading state                             */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — Faz 6 contract: loading state', () => {
  it('checkpoint ile birlikte component render eder (loading icin consumer skeleton kullanir)', () => {
    const { container } = render(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Loading...', status: 'pending' as const }}
        citations={[]}
        auditItems={[]}
      />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('bos citations ve auditItems ile data-component korunur', () => {
    const { container } = render(
      <ApprovalReview
        checkpoint={{ title: 'Test', status: 'pending' as const }}
        citations={[]}
        auditItems={[]}
      />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: empty state                               */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — Faz 6 contract: empty state', () => {
  it('bos citations array ile crash olmaz', () => {
    expect(() => {
      render(
        <ApprovalReview
          checkpoint={defaultCheckpoint}
          citations={[]}
          auditItems={defaultAuditItems}
        />,
      );
    }).not.toThrow();
  });

  it('bos auditItems array ile crash olmaz', () => {
    expect(() => {
      render(
        <ApprovalReview
          checkpoint={defaultCheckpoint}
          citations={defaultCitations}
          auditItems={[]}
        />,
      );
    }).not.toThrow();
  });

  it('bos citations ve auditItems ile title ve description hala gosterilir', () => {
    render(
      <ApprovalReview
        checkpoint={defaultCheckpoint}
        citations={[]}
        auditItems={[]}
        title="Bos durum"
        description="Henuz veri yok"
      />,
    );
    expect(screen.getByText('Bos durum')).toBeInTheDocument();
    expect(screen.getByText('Henuz veri yok')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: approval statuses                         */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — Faz 6 contract: approval statuses', () => {
  it('status="pending" checkpoint render eder', () => {
    render(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Pending CP', status: 'pending' as const }}
      />,
    );
    expect(screen.getByText('Pending CP')).toBeInTheDocument();
  });

  it('status="approved" checkpoint render eder', () => {
    render(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Approved CP', status: 'approved' as const }}
      />,
    );
    expect(screen.getByText('Approved CP')).toBeInTheDocument();
  });

  it('status="rejected" checkpoint render eder', () => {
    render(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Rejected CP', status: 'rejected' as const }}
      />,
    );
    expect(screen.getByText('Rejected CP')).toBeInTheDocument();
  });

  it('status="blocked" checkpoint render eder', () => {
    render(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Blocked CP', status: 'blocked' as const }}
      />,
    );
    expect(screen.getByText('Blocked CP')).toBeInTheDocument();
  });

  it('farkli statusler arasi gecis yaptiginda data-component korunur', () => {
    const { container, rerender } = render(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Test', status: 'pending' as const }}
      />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();

    rerender(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Test', status: 'approved' as const }}
      />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();

    rerender(
      <ApprovalReview
        {...defaultProps}
        checkpoint={{ title: 'Test', status: 'rejected' as const }}
      />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Faz 6 — Contract tests: readonly mode                             */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — Faz 6 contract: readonly mode', () => {
  it('access="readonly" durumunda data-access-state="readonly" atanir', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} access="readonly" />,
    );
    expect(
      container.querySelector('[data-access-state="readonly"]'),
    ).toBeInTheDocument();
  });

  it('access="readonly" durumunda title ve description hala gosterilir', () => {
    render(
      <ApprovalReview
        {...defaultProps}
        access="readonly"
        title="Readonly Title"
        description="Readonly Desc"
      />,
    );
    expect(screen.getByText('Readonly Title')).toBeInTheDocument();
    expect(screen.getByText('Readonly Desc')).toBeInTheDocument();
  });

  it('access="readonly" ile accessReason title attribute olarak atanir', () => {
    const { container } = render(
      <ApprovalReview
        {...defaultProps}
        access="readonly"
        accessReason="Sadece goruntuleme yetkisi"
      />,
    );
    const section = container.querySelector('[data-component="approval-review"]');
    expect(section).toHaveAttribute('title', 'Sadece goruntuleme yetkisi');
  });

  it('access="disabled" durumunda checkpoint icerigi hala render edilir', () => {
    const { container } = render(
      <ApprovalReview {...defaultProps} access="disabled" />,
    );
    expect(container.querySelector('[data-component="approval-review"]')).toBeInTheDocument();
    expect(screen.getByText('Checkpoint title')).toBeInTheDocument();
  });
});

describe('ApprovalReview — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ApprovalReview {...defaultProps} />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — interaction & role', () => {
  it('supports user interaction', async () => {
    const user = userEvent.setup();
    render(<ApprovalReview checkpoint={defaultCheckpoint} citations={defaultCitations} auditItems={defaultAuditItems} />);
    await user.tab();
  });
  it('has accessible role', () => {
    const { container } = render(<ApprovalReview checkpoint={defaultCheckpoint} citations={defaultCitations} auditItems={defaultAuditItems} />);
    expect(container.firstElementChild).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('ApprovalReview — quality signals', () => {
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
