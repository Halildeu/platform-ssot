import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Watermark } from '../Watermark';

describe('Watermark Visual Regression', () => {
  it('watermark overlay matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 300, height: 200 }}>
        <Watermark content="Confidential">
          <div style={{ padding: 40, textAlign: 'center' }}>Protected Content</div>
        </Watermark>
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
