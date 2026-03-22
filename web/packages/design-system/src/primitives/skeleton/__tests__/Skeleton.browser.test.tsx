import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Skeleton } from '../Skeleton';

describe('Skeleton (Browser)', () => {
  it('renders with default animation', async () => {
    const screen = await render(<Skeleton data-testid="skeleton" />);
    await expect.element(screen.getByTestId('skeleton')).toBeVisible();
  });

  it('renders multiple lines', async () => {
    render(
      <div data-testid="skeleton-lines">
        <Skeleton lines={3} />
      </div>,
    );
    await expect.element(screen.getByTestId('skeleton-lines')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<Skeleton />);
    const el = document.querySelector('[data-component="skeleton"]');
    expect(el).not.toBeNull();
  });

  it('renders circle shape', async () => {
    const screen = await render(<Skeleton circle height={40} data-testid="circle" />);
    await expect.element(screen.getByTestId('circle')).toBeVisible();
  });

  it('renders with custom width and height', async () => {
    const screen = await render(<Skeleton width={200} height={24} data-testid="custom" />);
    await expect.element(screen.getByTestId('custom')).toBeVisible();
  });

  it('renders without animation when animated is false', async () => {
    const screen = await render(<Skeleton animated={false} data-testid="static" />);
    await expect.element(screen.getByTestId('static')).toBeVisible();
  });

  it('renders loading aria state', async () => {
    const screen = await render(<Skeleton />);
    const el = document.querySelector('[data-loading="true"]');
    expect(el).not.toBeNull();
  });
});
