/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Rating } from '../Rating';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Rating Visual Regression', () => {
  it('empty rating matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Rating defaultValue={0} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('filled rating matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Rating defaultValue={4} showValue />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
