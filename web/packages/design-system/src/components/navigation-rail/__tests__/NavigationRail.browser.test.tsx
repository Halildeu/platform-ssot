import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { NavigationRail } from '../NavigationRail';

const items = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'orders', label: 'Orders' },
  { value: 'reports', label: 'Reports' },
];

describe('NavigationRail (Browser)', () => {
  it('renders all destinations', async () => {
    const screen = await render(<NavigationRail items={items} />);
    await expect.element(screen.getByText('Dashboard')).toBeVisible();
    await expect.element(screen.getByText('Orders')).toBeVisible();
    await expect.element(screen.getByText('Reports')).toBeVisible();
  });

  it('renders navigation landmark with aria-label', async () => {
    const screen = await render(
      <NavigationRail items={items} ariaLabel="Main navigation" />,
    );
    const nav = screen.getByRole('navigation');
    await expect.element(nav).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('marks default value as active with aria-current', async () => {
    const screen = await render(<NavigationRail items={items} defaultValue="orders" />);
    const activeItem = document.querySelector('[aria-current="page"]');
    expect(activeItem).not.toBeNull();
    expect(activeItem!.textContent).toContain('Orders');
  });

  it('fires onValueChange when clicking a destination', async () => {
    const onValueChange = vi.fn();
    const screen = await render(
      <NavigationRail items={items} onValueChange={onValueChange} />,
    );
    await screen.getByText('Reports').click();
    expect(onValueChange).toHaveBeenCalledWith('reports');
  });

  it('navigates with ArrowDown/ArrowUp keyboard', async () => {
    const screen = await render(<NavigationRail items={items} defaultValue="dashboard" />);
    const firstItem = document.querySelector('[data-slot="item"][tabindex="0"]') as HTMLElement;
    firstItem.focus();
    await userEvent.keyboard('{ArrowDown}');
    const focused = document.activeElement;
    expect(focused?.textContent).toContain('Orders');
  });

  it('renders badge on item', async () => {
    const badgeItems = [
      { value: 'dashboard', label: 'Dashboard', badge: '5' },
      { value: 'orders', label: 'Orders' },
    ];
    const screen = await render(<NavigationRail items={badgeItems} />);
    await expect.element(screen.getByText('5')).toBeVisible();
  });

  it('disables items with disabled prop', async () => {
    const disabledItems = [
      { value: 'dashboard', label: 'Dashboard' },
      { value: 'orders', label: 'Orders', disabled: true },
    ];
    const screen = await render(
      <NavigationRail items={disabledItems} />,
    );
    const disabledBtn = screen.container.querySelector('button[disabled]');
    expect(disabledBtn).not.toBeNull();
  });

  it('renders footer slot', async () => {
    const screen = await render(
      <NavigationRail items={items} footer={<span>Footer</span>} />,
    );
    await expect.element(screen.getByText('Footer')).toBeVisible();
  });
});
