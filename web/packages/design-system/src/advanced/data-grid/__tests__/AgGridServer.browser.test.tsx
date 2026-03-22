import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AgGridServer } from '../AgGridServer';

const mockGetData = async () => ({ rows: [], total: 0 });

describe('AgGridServer (Browser)', () => {
  it('renders grid shell container', async () => {
    const screen = render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />,
    );
    const el = screen.container.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });

  it('renders with custom height', async () => {
    const screen = render(
      <AgGridServer columnDefs={[{ field: 'name' }]} getData={mockGetData} height={300} />,
    );
    const el = screen.container.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });

  it('renders with quartz theme by default', async () => {
    const screen = render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />,
    );
    const themeEl = screen.container.querySelector('.ag-theme-quartz');
    expect(themeEl).not.toBeNull();
  });

  it('renders with balham theme', async () => {
    const screen = render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} theme="balham" />,
    );
    const themeEl = screen.container.querySelector('.ag-theme-balham');
    expect(themeEl).not.toBeNull();
  });

  it('renders with comfortable density by default', async () => {
    const screen = render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />,
    );
    const el = screen.container.querySelector('[data-density="comfortable"]');
    expect(el).not.toBeNull();
  });

  it('renders with compact density', async () => {
    const screen = render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} density="compact" />,
    );
    const el = screen.container.querySelector('[data-density="compact"]');
    expect(el).not.toBeNull();
  });

  it('applies custom className', async () => {
    const screen = render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} className="custom-grid" />,
    );
    const el = screen.container.querySelector('.custom-grid');
    expect(el).not.toBeNull();
  });

  it('renders with multiple column definitions', async () => {
    const screen = render(
      <AgGridServer
        columnDefs={[{ field: 'name' }, { field: 'age' }, { field: 'email' }]}
        getData={mockGetData}
      />,
    );
    const el = screen.container.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });
});
