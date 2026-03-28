/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { InputNumber } from '../InputNumber';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('InputNumber Visual Regression', () => {
  it('default state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <InputNumber defaultValue={10} label="Quantity" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
