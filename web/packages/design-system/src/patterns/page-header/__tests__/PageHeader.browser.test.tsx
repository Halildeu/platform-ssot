import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { PageHeader } from '../PageHeader';

describe('PageHeader (Browser)', () => {
  it('renders title as heading', async () => {
    const screen = await render(<PageHeader title="Order List" />);
    const heading = screen.getByRole('heading', { level: 1 });
    await expect.element(heading).toBeVisible();
  });

  it('renders subtitle', async () => {
    const screen = await render(<PageHeader title="Users" subtitle="Manage all users" />);
    await expect.element(screen.getByText('Manage all users')).toBeVisible();
  });

  it('renders actions slot', async () => {
    render(
      <PageHeader title="Invoices" actions={<button>Create Invoice</button>} />,
    );
    await expect.element(screen.getByText('Create Invoice')).toBeVisible();
  });

  it('renders header element', async () => {
    const screen = await render(<PageHeader title="Test" />);
    const header = document.querySelector('header');
    expect(header).not.toBeNull();
  });

  it('renders breadcrumb slot', async () => {
    render(
      <PageHeader title="Detail" breadcrumb={<nav>Home / Detail</nav>} />,
    );
    await expect.element(screen.getByText('Home / Detail')).toBeVisible();
  });

  it('renders tags slot', async () => {
    render(
      <PageHeader title="Order" tags={<span>Urgent</span>} />,
    );
    await expect.element(screen.getByText('Urgent')).toBeVisible();
  });

  it('renders footer slot', async () => {
    render(
      <PageHeader title="Page" footer={<div>Tab bar</div>} />,
    );
    await expect.element(screen.getByText('Tab bar')).toBeVisible();
  });

  it('renders avatar slot', async () => {
    render(
      <PageHeader title="Profile" avatar={<span data-testid="avatar">AV</span>} />,
    );
    await expect.element(screen.getByTestId('avatar')).toBeVisible();
  });
});
