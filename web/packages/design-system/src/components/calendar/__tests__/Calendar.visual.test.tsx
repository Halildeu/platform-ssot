import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Calendar } from '../Calendar';

describe('Calendar Visual Regression', () => {
  it('month view matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Calendar defaultMonth={new Date(2025, 0, 1)} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('with selected date matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Calendar defaultMonth={new Date(2025, 0, 1)} defaultValue={new Date(2025, 0, 15)} />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
