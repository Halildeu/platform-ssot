 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { NavigationRail } from '../NavigationRail';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'orders', label: 'Orders' },
  { value: 'reports', label: 'Reports' },
];

describe('NavigationRail Visual Regression', () => {
  it('default navigation rail matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <NavigationRail items={items} defaultValue="dashboard" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('compact navigation rail matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <NavigationRail items={items} defaultValue="orders" compact />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
