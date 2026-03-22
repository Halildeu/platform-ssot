import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Segmented } from '../Segmented';

const items = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('Segmented Visual Regression', () => {
  it('default segmented matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Segmented items={items} defaultValue="week" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });

  it('outline variant matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff' }}>
        <Segmented items={items} defaultValue="day" variant="outline" />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
