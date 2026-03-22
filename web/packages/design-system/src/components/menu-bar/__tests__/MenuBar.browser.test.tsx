import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { MenuBar } from '../MenuBar';

const items = [
  { value: 'home', label: 'Home' },
  { value: 'products', label: 'Products' },
  { value: 'settings', label: 'Settings' },
];

describe('MenuBar (Browser)', () => {
  it('renders all menu items', async () => {
    const screen = render(<MenuBar items={items} />);
    await expect.element(screen.getByText('Home')).toBeVisible();
    await expect.element(screen.getByText('Products')).toBeVisible();
    await expect.element(screen.getByText('Settings')).toBeVisible();
  });

  it('selects default value', async () => {
    const screen = render(<MenuBar items={items} defaultValue="products" />);
    await expect.element(screen.getByText('Products')).toBeVisible();
  });
});
