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
    render(
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
    render(
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
    render(
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
    render(
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
    render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    screen.getByText('Open Menu').element().focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('menu')).toBeVisible();
  });

  it('opens menu on Enter key', async () => {
    render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    screen.getByText('Open Menu').element().focus();
    await userEvent.keyboard('{Enter}');
    await expect.element(screen.getByRole('menu')).toBeVisible();
  });

  it('opens menu on Space key', async () => {
    render(
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
    render(
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
    render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await expect.element(screen.getByText('Open Menu')).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('trigger has aria-expanded when open', async () => {
    render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await expect.element(screen.getByText('Open Menu')).toHaveAttribute('aria-expanded', 'false');
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByText('Open Menu')).toHaveAttribute('aria-expanded', 'true');
  });

  it('menu has role="menu"', async () => {
    render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByRole('menu')).toBeVisible();
  });

  it('items have role="menuitem"', async () => {
    render(
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
    render(
      <Dropdown items={items} disabled>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  /* ------------------------------------------------------------------ */
  /*  8. Disabled items                                                   */
  /* ------------------------------------------------------------------ */
  it('renders disabled items', async () => {
    const disabledItems = [
      { key: 'edit', label: 'Edit' },
      { key: 'delete', label: 'Delete', disabled: true },
    ];
    render(
      <Dropdown items={disabledItems}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    const deleteBtn = screen.getByRole('menuitem', { name: 'Delete' });
    await expect.element(deleteBtn).toBeDisabled();
  });

  /* ------------------------------------------------------------------ */
  /*  9. Danger item styling                                              */
  /* ------------------------------------------------------------------ */
  it('renders danger items', async () => {
    render(
      <Dropdown items={items}>
        <button>Open Menu</button>
      </Dropdown>,
    );
    await screen.getByText('Open Menu').click();
    await expect.element(screen.getByText('Delete')).toBeVisible();
  });

  /* ------------------------------------------------------------------ */
  /*  10. Separator and label entries                                      */
  /* ------------------------------------------------------------------ */
  it('renders separators and labels', async () => {
    const richItems = [
      { type: 'label' as const, label: 'Actions' },
      { key: 'edit', label: 'Edit' },
      { type: 'separator' as const },
      { key: 'delete', label: 'Delete', danger: true },
    ];
    render(
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
