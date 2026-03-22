import { describe, it, expect } from 'vitest';
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
});
