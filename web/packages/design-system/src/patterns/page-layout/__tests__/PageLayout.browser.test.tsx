import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { PageLayout } from '../PageLayout';

describe('PageLayout (Browser)', () => {
  it('renders title in header', async () => {
    render(
      <PageLayout title="Dashboard"><p>Content</p></PageLayout>,
    );
    await expect.element(screen.getByText('Dashboard')).toBeVisible();
  });

  it('renders children content', async () => {
    render(
      <PageLayout title="Page"><p>Body content here</p></PageLayout>,
    );
    await expect.element(screen.getByText('Body content here')).toBeVisible();
  });

  it('renders breadcrumb items', async () => {
    render(
      <PageLayout
        title="Detail"
        breadcrumbItems={[
          { title: 'Home', path: '/' },
          { title: 'Products', path: '/products' },
          { title: 'Detail', current: true },
        ]}
      >
        <p>Content</p>
      </PageLayout>,
    );
    await expect.element(screen.getByText('Home')).toBeVisible();
    await expect.element(screen.getByText('Products')).toBeVisible();
  });

  it('renders description', async () => {
    render(
      <PageLayout title="Orders" description="All orders"><p>Content</p></PageLayout>,
    );
    await expect.element(screen.getByText('All orders')).toBeVisible();
  });

  it('renders actions slot', async () => {
    render(
      <PageLayout title="Users" actions={<button>Add User</button>}>
        <p>Content</p>
      </PageLayout>,
    );
    await expect.element(screen.getByText('Add User')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    render(
      <PageLayout title="Test"><p>Content</p></PageLayout>,
    );
    const el = document.querySelector('[data-component="page-layout"]');
    expect(el).not.toBeNull();
  });

  it('renders footer slot', async () => {
    render(
      <PageLayout title="Page" footer={<div>Footer content</div>}>
        <p>Body</p>
      </PageLayout>,
    );
    await expect.element(screen.getByText('Footer content')).toBeVisible();
  });
});
