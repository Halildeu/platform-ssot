import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { MenuBar } from '../MenuBar';

const items = [
  { value: 'home', label: 'Home' },
  { value: 'products', label: 'Products' },
  { value: 'settings', label: 'Settings' },
];

describe('MenuBar Visual Regression', () => {
  it('default menu bar matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <MenuBar items={items} defaultValue="home" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('ghost appearance matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 600 }}>
        <MenuBar items={items} defaultValue="products" appearance="ghost" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
