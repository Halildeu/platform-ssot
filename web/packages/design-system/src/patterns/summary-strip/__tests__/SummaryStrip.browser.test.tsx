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
  it('renders all metric labels', async () => {
    const screen = render(<SummaryStrip items={items} />);
    await expect.element(screen.getByText('Revenue')).toBeVisible();
    await expect.element(screen.getByText('Orders')).toBeVisible();
    await expect.element(screen.getByText('Customers')).toBeVisible();
    await expect.element(screen.getByText('Conversion')).toBeVisible();
  });

  it('renders all metric values', async () => {
    const screen = render(<SummaryStrip items={items} />);
    await expect.element(screen.getByText('$12,500')).toBeVisible();
    await expect.element(screen.getByText('142')).toBeVisible();
    await expect.element(screen.getByText('89')).toBeVisible();
    await expect.element(screen.getByText('3.2%')).toBeVisible();
  });

  it('renders title when provided', async () => {
    const screen = render(<SummaryStrip items={items} title="Key Metrics" />);
    await expect.element(screen.getByText('Key Metrics')).toBeVisible();
  });

  it('renders description when provided', async () => {
    const screen = render(
      <SummaryStrip items={items} title="KPI" description="Last 30 days" />,
    );
    await expect.element(screen.getByText('Last 30 days')).toBeVisible();
  });

  it('renders with note text', async () => {
    const screen = render(
      <SummaryStrip items={[{ key: 'k1', label: 'Total', value: '100', note: 'vs last month' }]} />,
    );
    await expect.element(screen.getByText('vs last month')).toBeVisible();
  });

  it('renders with icon', async () => {
    const screen = render(
      <SummaryStrip
        items={[{ key: 'k1', label: 'Users', value: '50', icon: <span data-testid="icon">I</span> }]}
      />,
    );
    await expect.element(screen.getByTestId('icon')).toBeVisible();
  });

  it('renders with custom column count', async () => {
    const screen = render(<SummaryStrip items={items} columns={2} />);
    await expect.element(screen.getByText('Revenue')).toBeVisible();
  });
});
