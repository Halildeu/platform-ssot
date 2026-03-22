import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { PageHeader } from '../PageHeader';

describe('PageHeader Visual Regression', () => {
  it('page header with title and actions matches screenshot', async () => {
    render(
      <div style={{ background: '#fff', width: 800 }}>
        <PageHeader
          title="Order Management"
          subtitle="View and manage all orders"
          actions={<button>New Order</button>}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });

  it('page header with breadcrumb matches screenshot', async () => {
    render(
      <div style={{ background: '#fff', width: 800 }}>
        <PageHeader
          title="Product Detail"
          breadcrumb={<nav>Home / Products / Detail</nav>}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
