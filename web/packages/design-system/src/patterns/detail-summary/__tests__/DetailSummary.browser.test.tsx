import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { DetailSummary } from '../DetailSummary';

describe('DetailSummary (Browser)', () => {
  it('renders title and entity block', async () => {
    const screen = render(
      <DetailSummary
        title="Order #1234"
        entity={{
          title: 'Acme Corp',
          items: [{ key: 'status', label: 'Status', value: 'Active' }],
        }}
      />,
    );
    await expect.element(screen.getByText('Order #1234')).toBeVisible();
    await expect.element(screen.getByText('Acme Corp')).toBeVisible();
  });

  it('renders with description', async () => {
    const screen = render(
      <DetailSummary
        title="Invoice"
        description="Invoice details"
        entity={{
          title: 'Entity',
          items: [{ key: 'k1', label: 'L1', value: 'V1' }],
        }}
      />,
    );
    await expect.element(screen.getByText('Invoice details')).toBeVisible();
  });
});
