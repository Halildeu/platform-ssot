import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { EntityGridTemplate } from '../EntityGridTemplate';

describe('EntityGridTemplate Visual Regression', () => {
  it('grid container matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 600, height: 400 }}>
        <EntityGridTemplate
          gridId="visual-test"
          gridSchemaVersion={1}
          columnDefs={[{ field: 'name', headerName: 'Name' }]}
          rowData={[{ name: 'Row 1' }, { name: 'Row 2' }]}
          dataSourceMode="client"
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
