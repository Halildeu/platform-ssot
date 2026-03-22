import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { List } from '../List';

const items = [
  { key: '1', title: 'Item One' },
  { key: '2', title: 'Item Two' },
  { key: '3', title: 'Item Three' },
];

describe('List (Browser)', () => {
  it('renders list items', async () => {
    const screen = render(<List items={items} />);
    await expect.element(screen.getByText('Item One')).toBeVisible();
    await expect.element(screen.getByText('Item Two')).toBeVisible();
    await expect.element(screen.getByText('Item Three')).toBeVisible();
  });

  it('renders title when provided', async () => {
    const screen = render(<List items={items} title="My List" />);
    await expect.element(screen.getByText('My List')).toBeVisible();
  });
});
