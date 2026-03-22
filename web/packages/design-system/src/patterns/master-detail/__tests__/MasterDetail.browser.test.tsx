import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { MasterDetail } from '../MasterDetail';

describe('MasterDetail (Browser)', () => {
  it('renders master and detail panels', async () => {
    const screen = render(
      <div style={{ height: 300 }}>
        <MasterDetail
          master={<div>Item list</div>}
          detail={<div>Item detail</div>}
        />
      </div>,
    );
    await expect.element(screen.getByText('Item list')).toBeVisible();
    await expect.element(screen.getByText('Item detail')).toBeVisible();
  });

  it('shows empty state when no selection', async () => {
    const screen = render(
      <div style={{ height: 300 }}>
        <MasterDetail
          master={<div>List</div>}
          detail={<div>Detail</div>}
          hasSelection={false}
        />
      </div>,
    );
    await expect.element(screen.getByText('Select an item to view details')).toBeVisible();
  });
});
