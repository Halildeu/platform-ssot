import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Calendar } from '../Calendar';

describe('Calendar Visual Regression', () => {
  it('month view matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Calendar defaultMonth={new Date(2025, 0, 1)} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('with selected date matches screenshot', async () => {
    render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Calendar defaultMonth={new Date(2025, 0, 1)} defaultValue={new Date(2025, 0, 15)} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
