// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import {
  AIActionAuditTimeline,
  type AIActionAuditTimelineProps,
  type AIActionAuditTimelineItem,
} from '../AIActionAuditTimeline';

afterEach(() => {
  cleanup();
});

const sampleItem: AIActionAuditTimelineItem = {
  id: 'a1',
  actor: 'ai',
  title: 'Generated draft',
  timestamp: '10:30 AM',
};

const baseProps: AIActionAuditTimelineProps = {
  items: [sampleItem],
};

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('AIActionAuditTimeline — temel render', () => {
  it('varsayilan title render eder', () => {
    render(<AIActionAuditTimeline {...baseProps} />);
    expect(screen.getByText('Denetim zaman cizelgesi')).toBeInTheDocument();
  });

  it('item title ve timestamp gosterir', () => {
    render(<AIActionAuditTimeline {...baseProps} />);
    expect(screen.getByText('Generated draft')).toBeInTheDocument();
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
  });

  it('data-component attribute atar', () => {
    const { container } = render(<AIActionAuditTimeline {...baseProps} />);
    expect(
      container.querySelector('[data-component="ai-action-audit-timeline"]'),
    ).toBeInTheDocument();
  });

  it('section elementini render eder', () => {
    const { container } = render(<AIActionAuditTimeline {...baseProps} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('actor badge render eder', () => {
    render(<AIActionAuditTimeline {...baseProps} />);
    expect(screen.getByText('ai')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('AIActionAuditTimeline — empty state', () => {
  it('items bos iken empty state render eder', () => {
    render(<AIActionAuditTimeline items={[]} />);
    expect(screen.queryByText('Generated draft')).not.toBeInTheDocument();
  });

  it('ozel emptyStateLabel kullanilir', () => {
    render(
      <AIActionAuditTimeline items={[]} emptyStateLabel="No audit records" />,
    );
    expect(screen.getByText('No audit records')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Actor & status badges                                              */
/* ------------------------------------------------------------------ */

describe('AIActionAuditTimeline — actor & status', () => {
  it.each(['ai', 'human', 'system'] as const)(
    'actor="%s" badge render eder',
    (actor) => {
      render(
        <AIActionAuditTimeline
          items={[{ ...sampleItem, actor }]}
        />,
      );
      expect(screen.getByText(actor)).toBeInTheDocument();
    },
  );

  it.each(['drafted', 'approved', 'executed', 'rejected', 'observed'] as const)(
    'status="%s" badge render eder',
    (status) => {
      render(
        <AIActionAuditTimeline
          items={[{ ...sampleItem, status }]}
        />,
      );
      expect(screen.getByText(status)).toBeInTheDocument();
    },
  );

  it('status olmadan status badge render etmez', () => {
    render(<AIActionAuditTimeline {...baseProps} />);
    expect(screen.queryByText('drafted')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Interaction                                                        */
/* ------------------------------------------------------------------ */

describe('AIActionAuditTimeline — interaction', () => {
  it('onSelectItem handler calisir', async () => {
    const handler = vi.fn();
    render(
      <AIActionAuditTimeline {...baseProps} onSelectItem={handler} />,
    );
    await userEvent.click(screen.getByText('Generated draft'));
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith('a1', sampleItem);
  });

  it('onSelectItem olmadan button yerine icerik render eder', () => {
    const { container } = render(<AIActionAuditTimeline {...baseProps} />);
    expect(container.querySelector('button')).toBeNull();
  });

  it('onSelectItem verilince button render eder', () => {
    render(
      <AIActionAuditTimeline {...baseProps} onSelectItem={vi.fn()} />,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('selectedId secili iteme aria-current atar', () => {
    render(
      <AIActionAuditTimeline
        {...baseProps}
        selectedId="a1"
        onSelectItem={vi.fn()}
      />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('AIActionAuditTimeline — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <AIActionAuditTimeline {...baseProps} access="hidden" />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="disabled" durumunda onClick calismaz', async () => {
    const handler = vi.fn();
    render(
      <AIActionAuditTimeline
        {...baseProps}
        access="disabled"
        onSelectItem={handler}
      />,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('accessReason title olarak atanir', () => {
    render(
      <AIActionAuditTimeline
        {...baseProps}
        accessReason="Admin only"
        onSelectItem={vi.fn()}
      />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Admin only');
  });

  it('access="full" durumunda data-access-state="full" olur', () => {
    const { container } = render(
      <AIActionAuditTimeline {...baseProps} access="full" />,
    );
    expect(container.querySelector('[data-access-state="full"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('AIActionAuditTimeline — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <AIActionAuditTimeline {...baseProps} className="my-timeline" />,
    );
    expect(container.querySelector('section')?.className).toContain('my-timeline');
  });

  it('ozel title ve description render eder', () => {
    render(
      <AIActionAuditTimeline
        {...baseProps}
        title="Action log"
        description="All events"
      />,
    );
    expect(screen.getByText('Action log')).toBeInTheDocument();
    expect(screen.getByText('All events')).toBeInTheDocument();
  });

  it('birden fazla item render eder', () => {
    const items: AIActionAuditTimelineItem[] = [
      sampleItem,
      { id: 'a2', actor: 'human', title: 'Approved change', timestamp: '11:00 AM' },
    ];
    render(<AIActionAuditTimeline items={items} />);
    expect(screen.getByText('Generated draft')).toBeInTheDocument();
    expect(screen.getByText('Approved change')).toBeInTheDocument();
  });

  it('summary render eder', () => {
    render(
      <AIActionAuditTimeline
        items={[{ ...sampleItem, summary: 'Details about the action' }]}
      />,
    );
    expect(screen.getByText('Details about the action')).toBeInTheDocument();
  });

  it('item badges render eder', () => {
    render(
      <AIActionAuditTimeline
        items={[
          {
            ...sampleItem,
            badges: [<span key="b" data-testid="audit-badge">Priority</span>],
          },
        ]}
      />,
    );
    expect(screen.getByTestId('audit-badge')).toBeInTheDocument();
  });

  it('ordered list render eder', () => {
    const { container } = render(<AIActionAuditTimeline {...baseProps} />);
    expect(container.querySelector('ol')).toBeInTheDocument();
  });
});

describe('AIActionAuditTimeline — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<AIActionAuditTimeline items={[{ id: 'a1', actor: 'ai', title: 'Generated draft', timestamp: '10:30 AM' }]} />);
    await expectNoA11yViolations(container);
  });
});
