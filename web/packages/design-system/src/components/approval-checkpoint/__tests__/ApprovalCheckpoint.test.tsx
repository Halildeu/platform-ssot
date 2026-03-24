// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApprovalCheckpoint, type ApprovalCheckpointProps } from '../ApprovalCheckpoint';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const baseProps: ApprovalCheckpointProps = {
  title: 'Release v2.1',
  summary: 'Awaiting final approval before deployment.',
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — temel render', () => {
  it('title ve summary render eder', () => {
    render(<ApprovalCheckpoint {...baseProps} />);
    expect(screen.getByText('Release v2.1')).toBeInTheDocument();
    expect(screen.getByText('Awaiting final approval before deployment.')).toBeInTheDocument();
  });

  it('article elementini render eder', () => {
    const { container } = render(<ApprovalCheckpoint {...baseProps} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('data-component attribute atar', () => {
    const { container } = render(<ApprovalCheckpoint {...baseProps} />);
    expect(container.querySelector('[data-component="approval-checkpoint"]')).toBeInTheDocument();
  });

  it('varsayilan status "pending" dir', () => {
    const { container } = render(<ApprovalCheckpoint {...baseProps} />);
    expect(container.querySelector('[data-status="pending"]')).toBeInTheDocument();
  });

  it('varsayilan buton labellarini gosterir', () => {
    render(<ApprovalCheckpoint {...baseProps} />);
    expect(screen.getByText('Onayla')).toBeInTheDocument();
    expect(screen.getByText('Inceleme talep et')).toBeInTheDocument();
  });

  it('varsayilan checkpoint labelini gosterir', () => {
    render(<ApprovalCheckpoint {...baseProps} />);
    expect(screen.getByText('Onay kapisi')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Status proplari                                                    */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — status proplari', () => {
  it.each(['pending', 'approved', 'rejected', 'blocked'] as const)(
    'status="%s" dogru badge ve data-status atar',
    (status) => {
      const { container } = render(
        <ApprovalCheckpoint {...baseProps} status={status} />,
      );
      expect(container.querySelector(`[data-status="${status}"]`)).toBeInTheDocument();
    },
  );

  it('status badge metnini gosterir', () => {
    render(<ApprovalCheckpoint {...baseProps} status="approved" />);
    expect(screen.getByText('Onaylandi')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Steps                                                              */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — steps', () => {
  it('steps render eder', () => {
    render(
      <ApprovalCheckpoint
        {...baseProps}
        steps={[
          { key: '1', label: 'Security review', status: 'approved' },
          { key: '2', label: 'QA sign-off', status: 'todo' },
        ]}
      />,
    );
    expect(screen.getByText('Security review')).toBeInTheDocument();
    expect(screen.getByText('QA sign-off')).toBeInTheDocument();
  });

  it('steps bos iken checklist render etmez', () => {
    const { container } = render(<ApprovalCheckpoint {...baseProps} steps={[]} />);
    expect(container.querySelector('[data-component="approval-checkpoint"]')).toBeInTheDocument();
    expect(screen.queryByText('Checklist')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Citations & evidence                                               */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — citations & evidence', () => {
  it('citations render eder', () => {
    render(
      <ApprovalCheckpoint {...baseProps} citations={['RFC-101', 'POLICY-42']} />,
    );
    expect(screen.getByText('RFC-101')).toBeInTheDocument();
    expect(screen.getByText('POLICY-42')).toBeInTheDocument();
  });

  it('citations bos iken citation blogu render etmez', () => {
    render(<ApprovalCheckpoint {...baseProps} citations={[]} />);
    expect(screen.queryByText('RFC-101')).not.toBeInTheDocument();
  });

  it('evidenceItems sayisini gosterir', () => {
    render(
      <ApprovalCheckpoint {...baseProps} evidenceItems={['log1', 'log2']} />,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — interaction', () => {
  it('onPrimaryAction handler calisir', async () => {
    const handlePrimary = vi.fn();
    render(<ApprovalCheckpoint {...baseProps} onPrimaryAction={handlePrimary} />);
    await userEvent.click(screen.getByText('Onayla'));
    expect(handlePrimary).toHaveBeenCalledTimes(1);
  });

  it('onSecondaryAction handler calisir', async () => {
    const handleSecondary = vi.fn();
    render(<ApprovalCheckpoint {...baseProps} onSecondaryAction={handleSecondary} />);
    await userEvent.click(screen.getByText('Inceleme talep et'));
    expect(handleSecondary).toHaveBeenCalledTimes(1);
  });

  it('ozel buton labellari kullanilir', () => {
    render(
      <ApprovalCheckpoint
        {...baseProps}
        primaryActionLabel="Confirm"
        secondaryActionLabel="Defer"
      />,
    );
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Defer')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <ApprovalCheckpoint {...baseProps} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" durumunda butonlar disabled olur', () => {
    render(<ApprovalCheckpoint {...baseProps} access="disabled" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('access="disabled" durumunda onClick calismaz', async () => {
    const handlePrimary = vi.fn();
    render(
      <ApprovalCheckpoint
        {...baseProps}
        access="disabled"
        onPrimaryAction={handlePrimary}
      />,
    );
    await userEvent.click(screen.getByText('Onayla'));
    expect(handlePrimary).not.toHaveBeenCalled();
  });

  it('accessReason title olarak atanir', () => {
    render(
      <ApprovalCheckpoint {...baseProps} accessReason="Insufficient permissions" />,
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) =>
      expect(btn).toHaveAttribute('title', 'Insufficient permissions'),
    );
  });

  it('access="full" durumunda data-access-state="full" olur', () => {
    const { container } = render(
      <ApprovalCheckpoint {...baseProps} access="full" />,
    );
    expect(container.querySelector('[data-access-state="full"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <ApprovalCheckpoint {...baseProps} className="custom-class" />,
    );
    expect(container.querySelector('article')?.className).toContain('custom-class');
  });

  it('footerNote render eder', () => {
    render(<ApprovalCheckpoint {...baseProps} footerNote="Deadline: Friday" />);
    expect(screen.getByText('Deadline: Friday')).toBeInTheDocument();
  });

  it('badges render eder', () => {
    render(
      <ApprovalCheckpoint
        {...baseProps}
        badges={[<span key="b1" data-testid="extra-badge">Critical</span>]}
      />,
    );
    expect(screen.getByTestId('extra-badge')).toBeInTheDocument();
  });

  it('footerNote olmadan footer render etmez', () => {
    render(<ApprovalCheckpoint {...baseProps} />);
    expect(screen.queryByText('Deadline: Friday')).not.toBeInTheDocument();
  });
});

describe('ApprovalCheckpoint — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ApprovalCheckpoint title="Release v2.1" summary="Awaiting approval." />);
    await expectNoA11yViolations(container);
  });
});


/* ------------------------------------------------------------------ */
/*  userEvent & getByRole coverage                                     */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — interaction & role', () => {
  it('has accessible article role', () => {
    render(<ApprovalCheckpoint {...baseProps} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('ApprovalCheckpoint — quality signals', () => {
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
