/* eslint-disable semantic-theme/no-inline-color-literals */
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { SummaryStrip } from '../SummaryStrip';

const items = [
  { key: 'revenue', label: 'Revenue', value: '$12,500' },
  { key: 'orders', label: 'Orders', value: '142' },
  { key: 'customers', label: 'Customers', value: '89' },
  { key: 'conversion', label: 'Conversion', value: '3.2%' },
];

describe('SummaryStrip Visual Regression', () => {
  it('4-column strip matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 800 }}>
        <SummaryStrip items={items} columns={4} />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('strip with title matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: '#fff', width: 800 }}>
        <SummaryStrip items={items} title="Monthly Overview" description="Last 30 days" />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
