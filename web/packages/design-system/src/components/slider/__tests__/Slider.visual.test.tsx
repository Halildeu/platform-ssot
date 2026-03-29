 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Slider } from '../Slider';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Slider Visual Regression', () => {
  it('default slider matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 400 }}>
        <Slider defaultValue={50} label="Volume" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
