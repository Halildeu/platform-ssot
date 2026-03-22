import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Rating } from '../Rating';

describe('Rating Visual Regression', () => {
  it('empty rating matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Rating defaultValue={0} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('filled rating matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Rating defaultValue={4} showValue />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
