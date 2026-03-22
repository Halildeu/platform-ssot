import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { DatePicker } from '../DatePicker';

describe('DatePicker Visual Regression', () => {
  it('empty date picker matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <DatePicker label="Start date" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('date picker with value matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 300 }}>
        <DatePicker label="End date" defaultValue="2024-06-15" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
