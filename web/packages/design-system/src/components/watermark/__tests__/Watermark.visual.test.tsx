 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Watermark } from '../Watermark';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Watermark Visual Regression', () => {
  it('watermark overlay matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300, height: 200 }}>
        <Watermark content="Confidential">
          <div style={{ padding: 40, textAlign: 'center' }}>Protected Content</div>
        </Watermark>
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
