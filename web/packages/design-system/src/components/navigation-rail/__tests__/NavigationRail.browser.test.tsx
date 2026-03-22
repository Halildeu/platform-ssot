import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { NavigationRail } from '../NavigationRail';

const items = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'orders', label: 'Orders' },
  { value: 'reports', label: 'Reports' },
];

describe('NavigationRail (Browser)', () => {
  it('renders all destinations', async () => {
    const screen = render(<NavigationRail items={items} />);
    await expect.element(screen.getByText('Dashboard')).toBeVisible();
    await expect.element(screen.getByText('Orders')).toBeVisible();
    await expect.element(screen.getByText('Reports')).toBeVisible();
  });

  it('selects default value', async () => {
    const screen = render(<NavigationRail items={items} defaultValue="orders" />);
    await expect.element(screen.getByText('Orders')).toBeVisible();
  });

  it('renders with aria label', async () => {
    const screen = render(
      <NavigationRail items={items} ariaLabel="Main navigation" />,
    );
    const nav = screen.getByRole('navigation');
    await expect.element(nav).toBeVisible();
  });
});
