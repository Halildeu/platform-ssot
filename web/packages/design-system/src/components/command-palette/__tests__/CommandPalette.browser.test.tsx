import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { CommandPalette } from '../CommandPalette';

const items = [
  { id: 'cmd1', title: 'Go to Dashboard', group: 'Navigation' },
  { id: 'cmd2', title: 'Create Invoice', group: 'Actions' },
  { id: 'cmd3', title: 'Go to Settings', group: 'Navigation' },
];

describe('CommandPalette (Browser)', () => {
  it('renders dialog when open', async () => {
    const screen = await render(<CommandPalette open items={items} />);
    await expect.element(screen.getByRole('dialog')).toBeVisible();
  });

  it('renders nothing when closed', async () => {
    const screen = await render(<CommandPalette open={false} items={items} />);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders all command items', async () => {
    const screen = await render(<CommandPalette open items={items} />);
    await expect.element(screen.getByText('Go to Dashboard')).toBeVisible();
    await expect.element(screen.getByText('Create Invoice')).toBeVisible();
  });

  it('filters items when typing in search', async () => {
    const screen = await render(<CommandPalette open items={items} />);
    const input = document.querySelector('input');
    expect(input).not.toBeNull();
    await userEvent.type(input!, 'Invoice');
    await expect.element(screen.getByText('Create Invoice')).toBeVisible();
  });

  it('fires onSelect when clicking a command', async () => {
    const onSelect = vi.fn();
    const screen = await render(<CommandPalette open items={items} onSelect={onSelect} />);
    await screen.getByText('Go to Dashboard').click();
    expect(onSelect).toHaveBeenCalledWith('cmd1', expect.objectContaining({ id: 'cmd1' }));
  });

  it('fires onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const screen = await render(<CommandPalette open items={items} onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows empty state when no items match', async () => {
    const screen = await render(<CommandPalette open items={items} />);
    const input = document.querySelector('input');
    await userEvent.type(input!, 'zzzzz');
    await expect.element(screen.getByText('Eslesen komut bulunamadi.')).toBeVisible();
  });

  it('renders search placeholder', async () => {
    const screen = await render(<CommandPalette open items={items} placeholder="Search commands..." />);
    const input = document.querySelector('input');
    expect(input?.getAttribute('placeholder')).toBe('Search commands...');
  });
});
