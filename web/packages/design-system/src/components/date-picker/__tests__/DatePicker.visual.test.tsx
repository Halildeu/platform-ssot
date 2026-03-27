/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { DatePicker } from '../DatePicker';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('DatePicker Visual Regression', () => {
  it('empty date picker matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <DatePicker label="Start date" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('date picker with value matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <DatePicker label="End date" defaultValue="2024-06-15" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
