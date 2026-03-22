import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { CommandPalette } from '../CommandPalette';

const items = [
  { id: 'cmd1', title: 'Go to Dashboard', group: 'Navigation' },
  { id: 'cmd2', title: 'Create Invoice', group: 'Actions' },
];

describe('CommandPalette (Browser)', () => {
  it('renders dialog when open', async () => {
    const screen = render(<CommandPalette open items={items} />);
    await expect.element(screen.getByRole('dialog')).toBeVisible();
  });

  it('renders nothing when closed', async () => {
    const screen = render(<CommandPalette open={false} items={items} />);
    const dialog = screen.container.querySelector('[role="dialog"]');
    expect(dialog).toBeNull();
  });
});
