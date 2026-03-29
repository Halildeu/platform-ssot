 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { PageHeader } from '../PageHeader';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('PageHeader Visual Regression', () => {
  it('page header with title and actions matches screenshot', async () => {
    await render(
      <div style={{ background: LIGHT_BG_HEX, width: 800 }}>
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
    await render(
      <div style={{ background: LIGHT_BG_HEX, width: 800 }}>
        <PageHeader
          title="Product Detail"
          breadcrumb={<nav>Home / Products / Detail</nav>}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
