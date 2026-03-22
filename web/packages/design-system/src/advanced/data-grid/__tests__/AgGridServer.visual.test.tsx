import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AgGridServer } from '../AgGridServer';

describe('AgGridServer Visual Regression', () => {
  it('server grid matches screenshot', async () => {
    const screen = render(
      <div style={{ padding: 20, background: '#fff', width: 500, height: 350 }}>
        <AgGridServer
          columnDefs={[{ field: 'name', headerName: 'Name' }]}
          getData={async () => ({ rows: [], total: 0 })}
          height={300}
        />
      </div>,
    );
    await expect(screen.container).toMatchScreenshot();
  });
});
