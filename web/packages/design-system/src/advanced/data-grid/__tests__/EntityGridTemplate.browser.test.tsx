import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { EntityGridTemplate } from '../EntityGridTemplate';

describe('EntityGridTemplate (Browser)', () => {
  it('renders grid wrapper container', async () => {
    const screen = render(
      <EntityGridTemplate
        gridId="test-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[{ name: 'Test' }]}
        dataSourceMode="client"
      />,
    );
    const el = screen.container.querySelector('[data-component="entity-grid-template"]');
    expect(el).not.toBeNull();
  });

  it('renders with data-grid-id attribute', async () => {
    const screen = render(
      <EntityGridTemplate
        gridId="orders-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        rowData={[]}
        dataSourceMode="client"
      />,
    );
    const el = screen.container.querySelector('[data-grid-id="orders-grid"]');
    expect(el).not.toBeNull();
  });

  it('renders toolbar with quick filter', async () => {
    const screen = render(
      <EntityGridTemplate
        gridId="toolbar-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[]}
        dataSourceMode="client"
      />,
    );
    const toolbar = screen.container.querySelector('[data-component="grid-toolbar"]');
    expect(toolbar).not.toBeNull();
  });

  it('renders GridShell with ag-theme class', async () => {
    const screen = render(
      <EntityGridTemplate
        gridId="theme-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[]}
        dataSourceMode="client"
        initialTheme="quartz"
      />,
    );
    const themeEl = screen.container.querySelector('.ag-theme-quartz');
    expect(themeEl).not.toBeNull();
  });

  it('renders pagination footer in client mode', async () => {
    const screen = render(
      <EntityGridTemplate
        gridId="page-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }]}
        rowData={[{ name: 'A' }, { name: 'B' }]}
        dataSourceMode="client"
        total={2}
      />,
    );
    const pagination = screen.container.querySelector('[data-component="table-pagination"]');
    expect(pagination).not.toBeNull();
  });

  it('renders toolbar extras slot', async () => {
    const screen = render(
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
    const screen = render(
      <EntityGridTemplate
        gridId="multi-col-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'name' }, { field: 'age' }, { field: 'email' }]}
        rowData={[]}
        dataSourceMode="client"
      />,
    );
    const el = screen.container.querySelector('[data-component="entity-grid-template"]');
    expect(el).not.toBeNull();
  });

  it('accepts custom messages prop', async () => {
    const screen = render(
      <EntityGridTemplate
        gridId="msg-grid"
        gridSchemaVersion={1}
        columnDefs={[{ field: 'id' }]}
        rowData={[]}
        dataSourceMode="client"
        messages={{ quickFilterPlaceholder: 'Search items...' }}
      />,
    );
    const el = screen.container.querySelector('[data-component="entity-grid-template"]');
    expect(el).not.toBeNull();
  });
});
