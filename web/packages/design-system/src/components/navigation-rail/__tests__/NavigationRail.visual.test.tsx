import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { NavigationRail } from '../NavigationRail';

const items = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'orders', label: 'Orders' },
  { value: 'reports', label: 'Reports' },
];

describe('NavigationRail Visual Regression', () => {
  it('default navigation rail matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <NavigationRail items={items} defaultValue="dashboard" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('compact navigation rail matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <NavigationRail items={items} defaultValue="orders" compact />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
