/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { TimePicker } from '../TimePicker';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('TimePicker Visual Regression', () => {
  it('empty state matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 300 }}>
        <TimePicker label="Meeting Time" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
