import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { DetailSummary } from '../DetailSummary';

const baseEntity = {
  title: 'Acme Corp',
  items: [{ key: 'status', label: 'Status', value: 'Active' }],
};

describe('DetailSummary (Browser)', () => {
  it('renders title', async () => {
    const screen = render(<DetailSummary title="Order #1234" entity={baseEntity} />);
    await expect.element(screen.getByText('Order #1234')).toBeVisible();
  });

  it('renders entity block', async () => {
    const screen = render(<DetailSummary title="Order" entity={baseEntity} />);
    await expect.element(screen.getByText('Acme Corp')).toBeVisible();
  });

  it('renders description', async () => {
    const screen = render(
      <DetailSummary title="Invoice" description="Invoice details" entity={baseEntity} />,
    );
    await expect.element(screen.getByText('Invoice details')).toBeVisible();
  });

  it('renders entity description items', async () => {
    const screen = render(<DetailSummary title="Order" entity={baseEntity} />);
    await expect.element(screen.getByText('Status')).toBeVisible();
    await expect.element(screen.getByText('Active')).toBeVisible();
  });

  it('renders summary strip items', async () => {
    const screen = render(
      <DetailSummary
        title="Dashboard"
        entity={baseEntity}
        summaryItems={[{ key: 'total', label: 'Total', value: '$1,200' }]}
      />,
    );
    await expect.element(screen.getByText('Total')).toBeVisible();
    await expect.element(screen.getByText('$1,200')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = render(
      <DetailSummary title="Hidden" entity={baseEntity} access="hidden" />,
    );
    expect(screen.container.textContent).toBe('');
  });

  it('renders actions slot', async () => {
    const screen = render(
      <DetailSummary title="Order" entity={baseEntity} actions={<button>Edit</button>} />,
    );
    await expect.element(screen.getByText('Edit')).toBeVisible();
  });
});
