import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AIActionAuditTimeline } from '../AIActionAuditTimeline';

const sampleItems = [
  { id: '1', actor: 'ai' as const, title: 'Generated report', timestamp: '10:00' },
  { id: '2', actor: 'human' as const, title: 'Approved', timestamp: '10:05', status: 'approved' as const },
];

describe('AIActionAuditTimeline (Browser)', () => {
  it('renders timeline with items', async () => {
    const screen = await render(<AIActionAuditTimeline items={sampleItems} />);
    await expect.element(screen.getByText('Generated report')).toBeVisible();
    await expect.element(screen.getByText('Approved')).toBeVisible();
  });

  it('renders empty state when no items', async () => {
    const screen = await render(<AIActionAuditTimeline items={[]} />);
    await expect.element(screen.getByText('Timeline kaydi bulunamadi.')).toBeVisible();
  });

  it('renders actor badge for each item', async () => {
    const screen = await render(<AIActionAuditTimeline items={sampleItems} />);
    await expect.element(screen.getByText('ai')).toBeVisible();
    await expect.element(screen.getByText('human')).toBeVisible();
  });

  it('renders status badge when provided', async () => {
    render(
      <AIActionAuditTimeline
        items={[{ id: '1', actor: 'ai', title: 'Scan', timestamp: '09:00', status: 'rejected' }]}
      />,
    );
    await expect.element(screen.getByText('rejected')).toBeVisible();
  });

  it('calls onSelectItem when item is clicked', async () => {
    const onSelect = vi.fn();
    render(
      <AIActionAuditTimeline items={sampleItems} onSelectItem={onSelect} />,
    );
    await screen.getByText('Generated report').click();
    expect(onSelect).toHaveBeenCalledWith('1', expect.objectContaining({ id: '1' }));
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<AIActionAuditTimeline items={sampleItems} />);
    const el = document.querySelector('[data-component="ai-action-audit-timeline"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<AIActionAuditTimeline items={sampleItems} access="hidden" />);
    expect(document.querySelector('[data-component="ai-action-audit-timeline"]')).toBeNull();
  });

  it('renders custom title and description', async () => {
    render(
      <AIActionAuditTimeline items={[]} title="Audit Log" description="Review actions" />,
    );
    await expect.element(screen.getByText('Audit Log')).toBeVisible();
    await expect.element(screen.getByText('Review actions')).toBeVisible();
  });
});
