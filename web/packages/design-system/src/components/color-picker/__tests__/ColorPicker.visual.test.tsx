 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { ColorPicker } from '../ColorPicker';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('ColorPicker Visual Regression', () => {
  it('closed swatch matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <ColorPicker defaultValue="var(--action-primary)" label="Brand Color" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
