import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { MenuBar } from '../MenuBar';

const items = [
  { value: 'home', label: 'Home' },
  { value: 'products', label: 'Products' },
  { value: 'settings', label: 'Settings' },
];

describe('MenuBar (Browser)', () => {
  it('renders all menu items', async () => {
    const screen = await render(<MenuBar items={items} />);
    await expect.element(screen.getByText('Home')).toBeVisible();
    await expect.element(screen.getByText('Products')).toBeVisible();
    await expect.element(screen.getByText('Settings')).toBeVisible();
  });

  it('marks default value as active with aria-current', async () => {
    const screen = await render(<MenuBar items={items} defaultValue="products" />);
    const activeItem = document.querySelector('[aria-current="page"]');
    expect(activeItem).not.toBeNull();
    expect(activeItem!.textContent).toContain('Products');
  });

  it('fires onValueChange when clicking an item', async () => {
    const onValueChange = vi.fn();
    const screen = await render(
      <MenuBar items={items} onValueChange={onValueChange} />,
    );
    await screen.getByText('Settings').click();
    expect(onValueChange).toHaveBeenCalledWith('settings');
  });

  it('fires onItemClick with value and event', async () => {
    const onItemClick = vi.fn();
    const screen = await render(
      <MenuBar items={items} onItemClick={onItemClick} />,
    );
    await screen.getByText('Home').click();
    expect(onItemClick).toHaveBeenCalledWith('home', expect.anything());
  });

  it('renders navigation landmark with aria-label', async () => {
    const screen = await render(<MenuBar items={items} ariaLabel="Main menu" />);
    const nav = screen.getByRole('navigation');
    await expect.element(nav).toHaveAttribute('aria-label', 'Main menu');
  });

  it('disables items with disabled prop', async () => {
    const disabledItems = [
      { value: 'home', label: 'Home' },
      { value: 'products', label: 'Products', disabled: true },
    ];
    const onValueChange = vi.fn();
    const screen = await render(
      <MenuBar items={disabledItems} onValueChange={onValueChange} />,
    );
    await screen.getByText('Products').click();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders with different sizes', async () => {
    const screen = await render(<MenuBar items={items} size="sm" />);
    await expect.element(screen.getByText('Home')).toBeVisible();
  });

  it('renders start and end slots', async () => {
    const screen = await render(
      <MenuBar items={items} startSlot={<span data-testid="start">Logo</span>} endSlot={<span data-testid="end">User</span>} />,
    );
    await expect.element(screen.getByText('Logo')).toBeVisible();
    await expect.element(screen.getByText('User')).toBeVisible();
  });
});
