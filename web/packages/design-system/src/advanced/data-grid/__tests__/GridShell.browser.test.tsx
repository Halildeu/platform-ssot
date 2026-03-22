import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { GridShell } from '../GridShell';

describe('GridShell (Browser)', () => {
  it('renders grid container with theme class', async () => {
    const screen = render(
      <GridShell
        columnDefs={[{ field: 'id' }]}
        rowData={[]}
        theme="quartz"
      />,
    );
    const el = screen.container.querySelector('.ag-theme-quartz');
    expect(el).not.toBeNull();
  });

  it('renders with density attribute', async () => {
    const screen = render(
      <GridShell
        columnDefs={[{ field: 'id' }]}
        rowData={[]}
        density="compact"
      />,
    );
    const el = screen.container.querySelector('[data-density="compact"]');
    expect(el).not.toBeNull();
  });
});
