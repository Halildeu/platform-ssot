import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { MasterDetail } from '../MasterDetail';

describe('MasterDetail (Browser)', () => {
  it('renders master and detail panels', async () => {
    render(
      <div style={{ height: 300 }}>
        <MasterDetail master={<div>Item list</div>} detail={<div>Item detail</div>} />
      </div>,
    );
    await expect.element(screen.getByText('Item list')).toBeVisible();
    await expect.element(screen.getByText('Item detail')).toBeVisible();
  });

  it('shows empty state when no selection', async () => {
    render(
      <div style={{ height: 300 }}>
        <MasterDetail master={<div>List</div>} detail={<div>Detail</div>} hasSelection={false} />
      </div>,
    );
    await expect.element(screen.getByText('Select an item to view details')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    render(
      <div style={{ height: 300 }}>
        <MasterDetail master={<div>M</div>} detail={<div>D</div>} />
      </div>,
    );
    const el = document.querySelector('[data-component="master-detail"]');
    expect(el).not.toBeNull();
  });

  it('renders custom detail empty state', async () => {
    render(
      <div style={{ height: 300 }}>
        <MasterDetail
          master={<div>List</div>}
          detail={<div>Detail</div>}
          hasSelection={false}
          detailEmpty={<div>Choose something</div>}
        />
      </div>,
    );
    await expect.element(screen.getByText('Choose something')).toBeVisible();
  });

  it('renders master header', async () => {
    render(
      <div style={{ height: 300 }}>
        <MasterDetail
          master={<div>List</div>}
          detail={<div>Detail</div>}
          masterHeader={<div>Master Header</div>}
        />
      </div>,
    );
    await expect.element(screen.getByText('Master Header')).toBeVisible();
  });

  it('renders detail header', async () => {
    render(
      <div style={{ height: 300 }}>
        <MasterDetail
          master={<div>List</div>}
          detail={<div>Detail</div>}
          detailHeader={<div>Detail Header</div>}
        />
      </div>,
    );
    await expect.element(screen.getByText('Detail Header')).toBeVisible();
  });

  it('renders with collapsible master panel', async () => {
    render(
      <div style={{ height: 300 }}>
        <MasterDetail master={<div>List</div>} detail={<div>Detail</div>} collapsible />
      </div>,
    );
    await expect.element(screen.getByText('List')).toBeVisible();
  });
});
