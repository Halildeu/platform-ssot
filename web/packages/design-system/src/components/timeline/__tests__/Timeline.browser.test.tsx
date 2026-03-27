import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Timeline } from '../Timeline';

const timelineItems = [
  { key: '1', children: 'Created account' },
  { key: '2', children: 'Verified email', color: 'success' as const },
  { key: '3', children: 'Completed profile' },
];

describe('Timeline (Browser)', () => {
  it('renders all timeline items', async () => {
    const screen = await render(<Timeline items={timelineItems} />);
    await expect.element(screen.getByText('Created account')).toBeVisible();
    await expect.element(screen.getByText('Verified email')).toBeVisible();
    await expect.element(screen.getByText('Completed profile')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    await render(<Timeline items={timelineItems} />);
    const el = document.querySelector('[data-component="timeline"]');
    expect(el).not.toBeNull();
  });

  it('renders with labels', async () => {
    const screen = await render(
      <Timeline items={[{ key: '1', children: 'Event', label: '2024-01-15' }]} />,
    );
    await expect.element(screen.getByText('2024-01-15')).toBeVisible();
  });

  it('renders pending item at the end', async () => {
    const screen = await render(
      <Timeline items={timelineItems} pending="Processing..." />,
    );
    await expect.element(screen.getByText('Processing...')).toBeVisible();
  });

  it('renders in alternate mode', async () => {
    const screen = await render(<Timeline items={timelineItems} mode="alternate" />);
    await expect.element(screen.getByText('Created account')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    await render(<Timeline items={timelineItems} access="hidden" />);
    expect(document.querySelector('[data-component="timeline"]')).toBeNull();
  });

  it('renders with custom dot icon', async () => {
    const screen = await render(
      <Timeline items={[{ key: '1', children: 'Custom', dot: <span data-testid="custom-dot">*</span> }]} />,
    );
    await expect.element(screen.getByTestId('custom-dot')).toBeVisible();
  });

  it('renders reversed order', async () => {
    const screen = await render(<Timeline items={timelineItems} reverse />);
    await expect.element(screen.getByText('Created account')).toBeVisible();
    await expect.element(screen.getByText('Completed profile')).toBeVisible();
  });
});
