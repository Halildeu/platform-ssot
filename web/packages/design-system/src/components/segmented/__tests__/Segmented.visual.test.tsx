/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { Segmented } from '../Segmented';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

const items = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('Segmented Visual Regression', () => {
  it('default segmented matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Segmented items={items} defaultValue="week" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('outline variant matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX }}>
        <Segmented items={items} defaultValue="day" variant="outline" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
