import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { ContextMenu } from '../ContextMenu';

const items = [
  { key: 'copy', label: 'Copy' },
  { key: 'paste', label: 'Paste' },
  { key: 'delete', label: 'Delete', danger: true },
];

describe('ContextMenu (Browser)', () => {
  it('renders trigger element', async () => {
    render(
      <ContextMenu items={items}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    await expect.element(screen.getByText('Right click me')).toBeVisible();
  });

  it('menu is hidden by default', async () => {
    render(
      <ContextMenu items={items}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it('opens menu on right-click (contextmenu event)', async () => {
    render(
      <ContextMenu items={items}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    const trigger = screen.getByText('Right click me');
    trigger.element().dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 }));
    await expect.element(screen.getByText('Copy')).toBeVisible();
    await expect.element(screen.getByText('Paste')).toBeVisible();
  });

  it('fires onClick when menu item is clicked', async () => {
    const onClick = vi.fn();
    const clickableItems = [
      { key: 'copy', label: 'Copy', onClick },
      { key: 'paste', label: 'Paste' },
    ];
    render(
      <ContextMenu items={clickableItems}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    screen.getByText('Right click me').element().dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 }),
    );
    await screen.getByText('Copy').click();
    expect(onClick).toHaveBeenCalled();
  });

  it('closes menu on Escape', async () => {
    render(
      <ContextMenu items={items}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    screen.getByText('Right click me').element().dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 }),
    );
    await expect.element(screen.getByText('Copy')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it('does not open when disabled', async () => {
    render(
      <ContextMenu items={items} disabled>
        <button>Right click me</button>
      </ContextMenu>,
    );
    screen.getByText('Right click me').element().dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 }),
    );
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it('renders separator entries', async () => {
    const itemsWithSep = [
      { key: 'copy', label: 'Copy' },
      { type: 'separator' as const, key: 'sep1' },
      { key: 'delete', label: 'Delete' },
    ];
    render(
      <ContextMenu items={itemsWithSep}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    screen.getByText('Right click me').element().dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 }),
    );
    const separator = document.querySelector('[role="separator"]');
    expect(separator).not.toBeNull();
  });
});
