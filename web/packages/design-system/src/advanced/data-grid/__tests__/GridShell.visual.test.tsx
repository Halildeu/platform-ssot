 
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { GridShell } from '../GridShell';
import { LIGHT_BG_HEX } from '../../../__tests__/visual-constants';

describe('GridShell Visual Regression', () => {
  it('grid shell matches screenshot', async () => {
    await render(
      <div style={{ padding: 20, background: LIGHT_BG_HEX, width: 500, height: 350 }}>
        <GridShell
          columnDefs={[{ field: 'name', headerName: 'Name' }]}
          rowData={[{ name: 'Alice' }, { name: 'Bob' }]}
          height={300}
        />
      </div>,
    );
    await expect(page.screenshot()).toMatchImageSnapshot();
  });
});
