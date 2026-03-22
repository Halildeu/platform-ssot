import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ContextMenu } from '../ContextMenu';

const items = [
  { key: 'copy', label: 'Copy' },
  { key: 'paste', label: 'Paste' },
];

describe('ContextMenu (Browser)', () => {
  it('renders trigger element', async () => {
    const screen = render(
      <ContextMenu items={items}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    await expect.element(screen.getByText('Right click me')).toBeVisible();
  });

  it('menu is hidden by default', async () => {
    const screen = render(
      <ContextMenu items={items}>
        <button>Right click me</button>
      </ContextMenu>,
    );
    const menu = screen.container.querySelector('[role="menu"]');
    expect(menu).toBeNull();
  });
});
