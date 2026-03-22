import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { GridShell } from '../GridShell';

describe('GridShell (Browser)', () => {
  it('renders grid container with theme class', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]} theme="quartz" />,
    );
    const el = screen.container.querySelector('.ag-theme-quartz');
    expect(el).not.toBeNull();
  });

  it('renders with density attribute', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]} density="compact" />,
    );
    const el = screen.container.querySelector('[data-density="compact"]');
    expect(el).not.toBeNull();
  });

  it('renders data-component attribute', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]} />,
    );
    const el = screen.container.querySelector('[data-component="grid-shell"]');
    expect(el).not.toBeNull();
  });

  it('renders with alpine theme', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]} theme="alpine" />,
    );
    const el = screen.container.querySelector('.ag-theme-alpine');
    expect(el).not.toBeNull();
  });

  it('renders with material theme', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]} theme="material" />,
    );
    const el = screen.container.querySelector('.ag-theme-material');
    expect(el).not.toBeNull();
  });

  it('renders children below the grid', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]}>
        <div data-testid="grid-footer">Footer content</div>
      </GridShell>,
    );
    await expect.element(screen.getByTestId('grid-footer')).toBeVisible();
  });

  it('applies custom className', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]} className="my-custom-grid" />,
    );
    const el = screen.container.querySelector('.my-custom-grid');
    expect(el).not.toBeNull();
  });

  it('renders comfortable density by default', async () => {
    const screen = render(
      <GridShell columnDefs={[{ field: 'id' }]} rowData={[]} />,
    );
    const el = screen.container.querySelector('[data-density="comfortable"]');
    expect(el).not.toBeNull();
  });
});
