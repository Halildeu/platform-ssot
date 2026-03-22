import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { EntityGridTemplate } from '../EntityGridTemplate';

describe('EntityGridTemplate (Browser)', () => {
  it('renders grid wrapper container', async () => {
    render(
      <EntityGridTemplate
        gridId="test-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[{ name: 'Test' }]}
        dataSourceMode="client"
      />,
    );
    const el = document.querySelector('[data-component="entity-grid-template"]');
    expect(el).not.toBeNull();
  });

  it('renders with data-grid-id attribute', async () => {
    render(
      <EntityGridTemplate
        gridId="orders-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        rowData={[]}
        dataSourceMode="client"
      />,
    );
    const el = document.querySelector('[data-grid-id="orders-grid"]');
    expect(el).not.toBeNull();
  });

  it('renders toolbar with quick filter', async () => {
    render(
      <EntityGridTemplate
        gridId="toolbar-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[]}
        dataSourceMode="client"
      />,
    );
    const toolbar = document.querySelector('[data-component="grid-toolbar"]');
    expect(toolbar).not.toBeNull();
  });

  it('renders GridShell with ag-theme class', async () => {
    render(
      <EntityGridTemplate
        gridId="theme-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[]}
        dataSourceMode="client"
        initialTheme="quartz"
      />,
    );
    const themeEl = document.querySelector('.ag-theme-quartz');
    expect(themeEl).not.toBeNull();
  });

  it('renders pagination footer in client mode', async () => {
    render(
      <EntityGridTemplate
        gridId="page-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[{ name: 'A' }, { name: 'B' }]}
        dataSourceMode="client"
        total={2}
      />,
    );
    const pagination = document.querySelector('[data-component="table-pagination"]');
    expect(pagination).not.toBeNull();
  });

  it('renders toolbar extras slot', async () => {
    render(
      <EntityGridTemplate
        gridId="extras-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        rowData={[]}
        dataSourceMode="client"
        toolbarExtras={<button>Custom Action</button>}
      />,
    );
    await expect.element(screen.getByText('Custom Action')).toBeVisible();
  });

  it('renders with multiple column definitions', async () => {
    render(
      <EntityGridTemplate
        gridId="multi-col-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }, { field: 'age' }, { field: 'email' }]}
        rowData={[]}
        dataSourceMode="client"
      />,
    );
    const el = document.querySelector('[data-component="entity-grid-template"]');
    expect(el).not.toBeNull();
  });

  it('accepts custom messages prop', async () => {
    render(
      <EntityGridTemplate
        gridId="msg-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        rowData={[]}
        dataSourceMode="client"
        messages={{ quickFilterPlaceholder: 'Search items...' }}
      />,
    );
    const el = document.querySelector('[data-component="entity-grid-template"]');
    expect(el).not.toBeNull();
  });
});
