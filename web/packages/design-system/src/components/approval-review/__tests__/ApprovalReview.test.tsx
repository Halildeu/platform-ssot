// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
