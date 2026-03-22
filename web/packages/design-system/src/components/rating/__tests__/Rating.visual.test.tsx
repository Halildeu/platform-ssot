import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Rating } from '../Rating';

describe('Rating Visual Regression', () => {
  it('empty rating matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Rating defaultValue={0} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('filled rating matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Rating defaultValue={4} showValue />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
