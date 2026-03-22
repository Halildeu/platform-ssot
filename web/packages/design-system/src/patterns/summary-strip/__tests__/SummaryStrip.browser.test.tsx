import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { SummaryStrip } from '../SummaryStrip';

const items = [
  { key: 'revenue', label: 'Revenue', value: '$12,500' },
  { key: 'orders', label: 'Orders', value: '142' },
  { key: 'customers', label: 'Customers', value: '89' },
  { key: 'conversion', label: 'Conversion', value: '3.2%' },
];

describe('SummaryStrip (Browser)', () => {
  it('renders all metric cards', async () => {
    const screen = render(<SummaryStrip items={items} />);
    await expect.element(screen.getByText('Revenue')).toBeVisible();
    await expect.element(screen.getByText('$12,500')).toBeVisible();
    await expect.element(screen.getByText('Orders')).toBeVisible();
    await expect.element(screen.getByText('142')).toBeVisible();
  });

  it('renders title when provided', async () => {
    const screen = render(<SummaryStrip items={items} title="Key Metrics" />);
    await expect.element(screen.getByText('Key Metrics')).toBeVisible();
  });
});
