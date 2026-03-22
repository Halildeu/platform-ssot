import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { GridShell } from '../GridShell';

describe('GridShell Visual Regression', () => {
  it('grid shell matches screenshot', async () => {
    const screen = await render(
      <div style={{ padding: 20, background: '#fff', width: 500, height: 350 }}>
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
