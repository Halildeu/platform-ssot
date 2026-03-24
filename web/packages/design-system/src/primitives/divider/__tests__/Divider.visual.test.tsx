/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Divider } from '../Divider';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Divider Visual Regression', () => {
  it('horizontal divider matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <p>Above</p>
        <Divider />
        <p>Below</p>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('vertical divider matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, display: 'flex', height: 40, alignItems: 'center', gap: 8 }}>
        <span>Left</span>
        <Divider orientation="vertical" />
        <span>Right</span>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
