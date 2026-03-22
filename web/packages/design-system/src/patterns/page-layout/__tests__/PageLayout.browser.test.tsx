import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { PageLayout } from '../PageLayout';

describe('PageLayout (Browser)', () => {
  it('renders title in header', async () => {
    const screen = render(
      <PageLayout title="Dashboard">
        <p>Main content</p>
      </PageLayout>,
    );
    await expect.element(screen.getByText('Dashboard')).toBeVisible();
  });

  it('renders children content', async () => {
    const screen = render(
      <PageLayout title="Page">
        <p>Body content here</p>
      </PageLayout>,
    );
    await expect.element(screen.getByText('Body content here')).toBeVisible();
  });

  it('renders breadcrumb items', async () => {
    const screen = render(
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
});
