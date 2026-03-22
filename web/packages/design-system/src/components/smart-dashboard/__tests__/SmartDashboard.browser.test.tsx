import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { SmartDashboard } from '../SmartDashboard';

const widgets = [
  { key: 'w1', title: 'Users', type: 'kpi' as const, value: '1,234' },
  { key: 'w2', title: 'Revenue', type: 'kpi' as const, value: '$56K' },
];

describe('SmartDashboard (Browser)', () => {
  it('renders widget titles', async () => {
    const screen = render(<SmartDashboard widgets={widgets} />);
    await expect.element(screen.getByText('Users')).toBeVisible();
    await expect.element(screen.getByText('Revenue')).toBeVisible();
  });

  it('renders widget values', async () => {
    const screen = render(<SmartDashboard widgets={widgets} />);
    await expect.element(screen.getByText('1,234')).toBeVisible();
    await expect.element(screen.getByText('$56K')).toBeVisible();
  });

  it('renders greeting banner', async () => {
    const screen = render(
      <SmartDashboard widgets={[]} greeting="Good morning, Admin" />,
    );
    await expect.element(screen.getByText('Good morning, Admin')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = render(<SmartDashboard widgets={widgets} />);
    const el = screen.container.querySelector('[data-component="smart-dashboard"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(<SmartDashboard widgets={widgets} access="hidden" />);
    expect(screen.container.querySelector('[data-component="smart-dashboard"]')).toBeNull();
  });

  it('renders custom title and description', async () => {
    const screen = render(
      <SmartDashboard widgets={[]} title="My Dashboard" description="Overview" />,
    );
    await expect.element(screen.getByText('My Dashboard')).toBeVisible();
    await expect.element(screen.getByText('Overview')).toBeVisible();
  });

  it('renders with trend indicators', async () => {
    const screen = render(
      <SmartDashboard
        widgets={[
          { key: 'w1', title: 'Sales', type: 'kpi', value: '100', trend: { direction: 'up', percentage: 12 } },
        ]}
      />,
    );
    await expect.element(screen.getByText('Sales')).toBeVisible();
    await expect.element(screen.getByText('100')).toBeVisible();
  });

  it('renders pinned widgets', async () => {
    const screen = render(
      <SmartDashboard
        widgets={[
          { key: 'pinned', title: 'Pinned Widget', type: 'kpi', value: '42', pinned: true },
          { key: 'normal', title: 'Normal Widget', type: 'kpi', value: '10' },
        ]}
      />,
    );
    await expect.element(screen.getByText('Pinned Widget')).toBeVisible();
    await expect.element(screen.getByText('Normal Widget')).toBeVisible();
  });
});
