import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { PageHeader } from '../PageHeader';

describe('PageHeader (Browser)', () => {
  it('renders title', async () => {
    const screen = render(<PageHeader title="Order List" />);
    const heading = screen.getByRole('heading', { level: 1 });
    await expect.element(heading).toBeVisible();
  });

  it('renders subtitle', async () => {
    const screen = render(
      <PageHeader title="Users" subtitle="Manage all users" />,
    );
    await expect.element(screen.getByText('Manage all users')).toBeVisible();
  });

  it('renders actions slot', async () => {
    const screen = render(
      <PageHeader title="Invoices" actions={<button>Create Invoice</button>} />,
    );
    await expect.element(screen.getByText('Create Invoice')).toBeVisible();
  });
});
