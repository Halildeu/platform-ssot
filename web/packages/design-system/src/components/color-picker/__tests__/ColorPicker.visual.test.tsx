import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ColorPicker } from '../ColorPicker';

describe('ColorPicker Visual Regression', () => {
  it('closed swatch matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <ColorPicker defaultValue="#3b82f6" label="Brand Color" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
