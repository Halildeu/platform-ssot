 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Calendar } from '../Calendar';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('Calendar Visual Regression', () => {
  it('month view matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Calendar defaultMonth={new Date(2025, 0, 1)} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('with selected date matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Calendar defaultMonth={new Date(2025, 0, 1)} defaultValue={new Date(2025, 0, 15)} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
