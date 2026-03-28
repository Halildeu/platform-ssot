import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AgGridServer } from '../AgGridServer';

const mockGetData = async () => ({ rows: [], total: 0 });

describe('AgGridServer (Browser)', () => {
  it('renders grid shell container', async () => {
    await render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />,
    );
    const el = document.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });

  it('renders with custom height', async () => {
    await render(
      <AgGridServer columnDefs={[{ field: 'name' }]} getData={mockGetData} height={300} />,
    );
    const el = document.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });

  it('renders with quartz theme by default', async () => {
    await render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />,
    );
    const themeEl = document.querySelector('.ag-theme-quartz');
    expect(themeEl).not.toBeNull();
  });

  it('renders with balham theme', async () => {
    await render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} theme="balham" />,
    );
    const themeEl = document.querySelector('.ag-theme-balham');
    expect(themeEl).not.toBeNull();
  });

  it('renders with comfortable density by default', async () => {
    await render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} />,
    );
    const el = document.querySelector('[data-density="comfortable"]');
    expect(el).not.toBeNull();
  });

  it('renders with compact density', async () => {
    await render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} density="compact" />,
    );
    const el = document.querySelector('[data-density="compact"]');
    expect(el).not.toBeNull();
  });

  it('applies custom className', async () => {
    await render(
      <AgGridServer columnDefs={[{ field: 'id' }]} getData={mockGetData} className="custom-grid" />,
    );
    const el = document.querySelector('.custom-grid');
    expect(el).not.toBeNull();
  });

  it('renders with multiple column definitions', async () => {
    await render(
      <AgGridServer
        columnDefs={[{ field: 'name' }, { field: 'age' }, { field: 'email' }]}
        getData={mockGetData}
      />,
    );
    const el = document.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });
});
