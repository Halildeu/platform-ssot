import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { List } from '../List';

const items = [
  { key: '1', title: 'Item One' },
  { key: '2', title: 'Item Two' },
  { key: '3', title: 'Item Three' },
];

describe('List (Browser)', () => {
  it('renders all list items', async () => {
    const screen = await render(<List items={items} />);
    await expect.element(screen.getByText('Item One')).toBeVisible();
    await expect.element(screen.getByText('Item Two')).toBeVisible();
    await expect.element(screen.getByText('Item Three')).toBeVisible();
  });

  it('renders title when provided', async () => {
    const screen = await render(<List items={items} title="My List" />);
    await expect.element(screen.getByText('My List')).toBeVisible();
  });

  it('renders description when provided', async () => {
    const screen = await render(<List items={items} description="A helpful description" />);
    await expect.element(screen.getByText('A helpful description')).toBeVisible();
  });

  it('fires onItemSelect when clicking an item', async () => {
    const onItemSelect = vi.fn();
    const screen = await render(<List items={items} onItemSelect={onItemSelect} />);
    await screen.getByText('Item Two').click();
    expect(onItemSelect).toHaveBeenCalledWith('2');
  });

  it('shows loading skeleton when loading', async () => {
    const screen = await render(<List items={[]} loading />);
    const skeletons = document.querySelectorAll('[data-component="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no items', async () => {
    const screen = await render(<List items={[]} />);
    const emptyState = document.querySelector('[data-component="empty-state"]');
    expect(emptyState).not.toBeNull();
  });

  it('renders item with description', async () => {
    const richItems = [
      { key: '1', title: 'Task', description: 'Complete by Friday' },
    ];
    const screen = await render(<List items={richItems} />);
    await expect.element(screen.getByText('Complete by Friday')).toBeVisible();
  });

  it('renders item badges', async () => {
    const badgeItems = [
      { key: '1', title: 'Priority', badges: ['High'] },
    ];
    const screen = await render(<List items={badgeItems} />);
    await expect.element(screen.getByText('High')).toBeVisible();
  });
});
