/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { CommandPalette } from '../CommandPalette';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { id: 'cmd1', title: 'Go to Dashboard', group: 'Navigation' },
  { id: 'cmd2', title: 'Create Invoice', group: 'Actions' },
];

describe('CommandPalette Visual Regression', () => {
  it('open state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600, height: 400 }}>
        <CommandPalette open items={items} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
