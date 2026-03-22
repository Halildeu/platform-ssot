import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AgGridServer } from '../AgGridServer';

describe('AgGridServer (Browser)', () => {
  it('renders grid shell container', async () => {
    const screen = render(
      <AgGridServer
        columnDefs={[{ field: 'id' }]}
        getData={async () => ({ rows: [], total: 0 })}
      />,
    );
    const el = screen.container.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });

  it('renders with custom height', async () => {
    const screen = render(
      <AgGridServer
        columnDefs={[{ field: 'name' }]}
        getData={async () => ({ rows: [], total: 0 })}
        height={300}
      />,
    );
    const el = screen.container.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });
});
