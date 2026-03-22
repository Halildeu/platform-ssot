import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { InputNumber } from '../InputNumber';

describe('InputNumber Visual Regression', () => {
  it('default state matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <InputNumber defaultValue={10} label="Quantity" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
