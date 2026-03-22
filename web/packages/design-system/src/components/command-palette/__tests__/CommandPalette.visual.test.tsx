import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { CommandPalette } from '../CommandPalette';

const items = [
  { id: 'cmd1', title: 'Go to Dashboard', group: 'Navigation' },
  { id: 'cmd2', title: 'Create Invoice', group: 'Actions' },
];

describe('CommandPalette Visual Regression', () => {
  it('open state matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 600, height: 400 }}>
        <CommandPalette open items={items} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
