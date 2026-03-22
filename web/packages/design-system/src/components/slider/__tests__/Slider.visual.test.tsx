import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Slider } from '../Slider';

describe('Slider Visual Regression', () => {
  it('default slider matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 400 }}>
        <Slider defaultValue={50} label="Volume" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
