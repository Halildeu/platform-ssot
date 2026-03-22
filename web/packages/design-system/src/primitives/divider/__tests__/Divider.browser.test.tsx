import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Divider } from '../Divider';

describe('Divider (Browser)', () => {
  it('renders horizontal divider', async () => {
    const screen = await render(<Divider data-testid="h-divider" />);
    await expect.element(screen.getByTestId('h-divider')).toBeVisible();
  });

  it('renders vertical divider', async () => {
    render(
      <div style={{ height: 40, display: 'flex' }}>
        <Divider orientation="vertical" data-testid="v-divider" />
      </div>,
    );
    await expect.element(screen.getByTestId('v-divider')).toBeVisible();
  });

  it('renders with separator role for horizontal', async () => {
    const screen = await render(<Divider />);
    const sep = document.querySelector('[role="separator"]');
    expect(sep).not.toBeNull();
  });

  it('renders with separator role for vertical', async () => {
    render(
      <div style={{ height: 40, display: 'flex' }}>
        <Divider orientation="vertical" />
      </div>,
    );
    const sep = document.querySelector('[aria-orientation="vertical"]');
    expect(sep).not.toBeNull();
  });

  it('renders with label', async () => {
    const screen = await render(<Divider label="OR" />);
    await expect.element(screen.getByText('OR')).toBeVisible();
  });

  it('renders with different spacing', async () => {
    render(
      <div>
        <Divider spacing="sm" data-testid="sm" />
        <Divider spacing="lg" data-testid="lg" />
      </div>,
    );
    await expect.element(screen.getByTestId('sm')).toBeVisible();
    await expect.element(screen.getByTestId('lg')).toBeVisible();
  });

  it('renders with no spacing', async () => {
    const screen = await render(<Divider spacing="none" data-testid="none" />);
    await expect.element(screen.getByTestId('none')).toBeVisible();
  });
});
