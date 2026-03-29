 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { MenuBar } from '../MenuBar';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { value: 'home', label: 'Home' },
  { value: 'products', label: 'Products' },
  { value: 'settings', label: 'Settings' },
];

describe('MenuBar Visual Regression', () => {
  it('default menu bar matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600 }}>
        <MenuBar items={items} defaultValue="home" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('ghost appearance matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600 }}>
        <MenuBar items={items} defaultValue="products" appearance="ghost" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
