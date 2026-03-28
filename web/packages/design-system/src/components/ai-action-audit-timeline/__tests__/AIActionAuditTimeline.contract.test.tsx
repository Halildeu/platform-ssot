// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIActionAuditTimeline } from '../AIActionAuditTimeline';
import type { AIActionAuditTimelineItem } from '../AIActionAuditTimeline';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const items: AIActionAuditTimelineItem[] = [
  { id: '1', actor: 'ai', title: 'Generated draft', timestamp: '10:00' },
  { id: '2', actor: 'human', title: 'Approved draft', timestamp: '10:30', status: 'approved' },
];

describe('AIActionAuditTimeline contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(AIActionAuditTimeline.displayName).toBe('AIActionAuditTimeline');
  });

  /* ---- Default render ---- */
  it('renders timeline items', () => {
    render(<AIActionAuditTimeline items={items} />);
    expect(screen.getByText('Generated draft')).toBeInTheDocument();
    expect(screen.getByText('Approved draft')).toBeInTheDocument();
  });

  it('sets data-component attribute', () => {
    const { container } = render(<AIActionAuditTimeline items={items} />);
    expect(container.querySelector('[data-component="ai-action-audit-timeline"]')).toBeInTheDocument();
  });

  /* ---- Default title ---- */
  it('renders default title', () => {
    render(<AIActionAuditTimeline items={items} />);
    expect(screen.getByText('Denetim zaman cizelgesi')).toBeInTheDocument();
  });

  /* ---- Custom title ---- */
  it('renders custom title', () => {
    render(<AIActionAuditTimeline items={items} title="Audit Log" />);
    expect(screen.getByText('Audit Log')).toBeInTheDocument();
  });

  /* ---- Empty state ---- */
  it('renders empty state when items is empty', () => {
    render(<AIActionAuditTimeline items={[]} />);
    const section = document.querySelector('[data-component="ai-action-audit-timeline"]');
    expect(section).toBeInTheDocument();
  });

  /* ---- Callback: onSelectItem ---- */
  it('calls onSelectItem when an item is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<AIActionAuditTimeline items={items} onSelectItem={handler} />);
    await user.click(screen.getByText('Generated draft'));
    expect(handler).toHaveBeenCalledWith('1', items[0]);
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    const { container } = render(<AIActionAuditTimeline items={items} className="timeline-cls" />);
    const section = container.querySelector('[data-component="ai-action-audit-timeline"]');
    expect(section?.className).toContain('timeline-cls');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<AIActionAuditTimeline items={items} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Status badge ---- */
  it('renders status badge when item has status', () => {
    render(<AIActionAuditTimeline items={items} />);
    expect(screen.getByText('approved')).toBeInTheDocument();
  });
});

describe('AIActionAuditTimeline — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<AIActionAuditTimeline items={items} />);
    await expectNoA11yViolations(container);
  });
});
