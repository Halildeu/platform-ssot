/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ContextMenu } from '../ContextMenu';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { key: 'copy', label: 'Copy' },
  { key: 'paste', label: 'Paste' },
];

describe('ContextMenu Visual Regression', () => {
  it('trigger matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <ContextMenu items={items}>
          <button>Right click me</button>
        </ContextMenu>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
