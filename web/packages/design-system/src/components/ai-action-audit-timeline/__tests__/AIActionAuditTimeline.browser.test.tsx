import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AIActionAuditTimeline } from '../AIActionAuditTimeline';

describe('AIActionAuditTimeline (Browser)', () => {
  it('renders timeline with items', async () => {
    const screen = render(
      <AIActionAuditTimeline
        items={[
          { id: '1', actor: 'ai', title: 'Generated report', timestamp: '10:00' },
          { id: '2', actor: 'human', title: 'Approved', timestamp: '10:05', status: 'approved' },
        ]}
      />,
    );
    await expect.element(screen.getByText('Generated report')).toBeVisible();
    await expect.element(screen.getByText('Approved')).toBeVisible();
  });

  it('renders empty state when no items', async () => {
    const screen = render(<AIActionAuditTimeline items={[]} />);
    await expect.element(screen.getByText('Timeline kaydi bulunamadi.')).toBeVisible();
  });
});
