 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { EntityGridTemplate } from '../EntityGridTemplate';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('EntityGridTemplate Visual Regression', () => {
  it('grid container matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 600, height: 400 }}>
        <EntityGridTemplate
          gridId="visual-test"
          gridSchemaVersion={1}
          columnDefs={[{ field: 'name', headerName: 'Name' }]}
          rowData={[{ name: 'Row 1' }, { name: 'Row 2' }]}
          dataSourceMode="client"
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
