import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { Dropdown } from '../Dropdown';

const items = [
  { key: 'edit', label: 'Edit' },
  { key: 'duplicate', label: 'Duplicate' },
  { key: 'delete', label: 'Delete', danger: true },
];

describe('Dropdown (Browser)', () => {
  /* ------------------------------------------------------------------ */
  /*  1. Basic render                                                     */
  /* ------------------------------------------------------------------ */
  it('renders trigger element', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await expect.element(screen.getByText('Open Menu')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  2. Click opens menu                                                 */
  /* ------------------------------------------------------------------ */
  it('opens menu on trigger click', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByText('Edit')).toBeVisible();
    await expect.element(screen.getByText('Duplicate')).toBeVisible();
    await expect.element(screen.getByText('Delete')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  3. Item click fires callback                                        */
  /* ------------------------------------------------------------------ */
  it('fires onClick on item and closes menu', async () => {
    const onEdit = vi.fn();
    const clickItems = [
      { key: 'edit', label: 'Edit', onClick: onEdit },
      { key: 'delete', label: 'Delete' },
    ];
    const screen = await render(
      <Dropdown items={clickItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await screen.getByText('Edit').click();
    expect(onEdit).toHaveBeenCalledOnce();
    // Menu should close after selection
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  4. Escape closes                                                    */
  /* ------------------------------------------------------------------ */
  it('closes menu on Escape key', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByRole('menu')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  5. Keyboard navigation                                              */
  /* ------------------------------------------------------------------ */
  it('opens menu on ArrowDown key', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    screen.getByText('Open Menu').element().focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('menu')).toBeVisible();
  });

  it('opens menu on Enter key', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    screen.getByText('Open Menu').element().focus();
    await userEvent.keyboard('{Enter}');
    await expect.element(screen.getByRole('menu')).toBeVisible();
  });

  it('opens menu on Space key', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    screen.getByText('Open Menu').element().focus();
    await userEvent.keyboard(' ');
    await expect.element(screen.getByRole('menu')).toBeVisible();
  });

  it('navigates items with ArrowDown/ArrowUp', async () => {
    const onEdit = vi.fn();
    const onDuplicate = vi.fn();
    const navItems = [
      { key: 'edit', label: 'Edit', onClick: onEdit },
      { key: 'duplicate', label: 'Duplicate', onClick: onDuplicate },
    ];
    const screen = await render(
      <Dropdown items={navItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    screen.getByText('Open Menu').element().focus();
    // Open and focus first item
    await userEvent.keyboard('{ArrowDown}');
    // Move to second item
    await userEvent.keyboard('{ArrowDown}');
    // Select it with Enter
    await userEvent.keyboard('{Enter}');
    expect(onDuplicate).toHaveBeenCalledOnce();
  });

  /* ------------------------------------------------------------------ */
  /*  6. ARIA attributes                                                  */
  /* ------------------------------------------------------------------ */
  it('trigger has aria-haspopup="menu"', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await expect.element(screen.getByText('Open Menu')).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('trigger has aria-expanded when open', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await expect.element(screen.getByText('Open Menu')).toHaveAttribute('aria-expanded', 'false');
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByText('Open Menu')).toHaveAttribute('aria-expanded', 'true');
  });

  it('items have role="menuitem"', async () => {
    const screen = await render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    expect(menuItems.length).toBe(3);
  });

  /* ------------------------------------------------------------------ */
  /*  7. Disabled dropdown                                                */
  /* ------------------------------------------------------------------ */
  it('does not open when disabled', async () => {
    const screen = await render(
      <Dropdown items={items} disabled>
        <button>Open Menu</button>
      </Dropdown>,
    );
    // Trigger should be disabled
    const trigger = screen.container.querySelector('button');
    expect(trigger?.disabled || trigger?.getAttribute('aria-disabled') === 'true').toBe(true);
    // Menu should not be rendered
    expect(screen.container.querySelector('[role="menu"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Disabled items                                                   */
  /* ------------------------------------------------------------------ */
  it('renders disabled items', async () => {
    const disabledItems = [
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete', disabled: true },
    ];
    const screen = await render(
      <Dropdown items={disabledItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    const deleteBtn = screen.getByRole('menuitem', { name: 'Delete' });
    await expect.element(deleteBtn).toBeDisabled();
  });

  /* ------------------------------------------------------------------ */
  /*  9. Separator and label entries                                      */
  /* ------------------------------------------------------------------ */
  it('renders separators and labels', async () => {
    const richItems = [
      { type: 'label' as const, label: 'Actions' },
      { key: 'edit', label: 'Edit' },
      { type: 'separator' as const },
      { key: 'delete', label: 'Delete', danger: true },
    ];
    const screen = await render(
      <Dropdown items={richItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByText('Actions')).toBeVisible();
    await expect.element(screen.getByText('Edit')).toBeVisible();
    await expect.element(screen.getByText('Delete')).toBeVisible();
  });
});
