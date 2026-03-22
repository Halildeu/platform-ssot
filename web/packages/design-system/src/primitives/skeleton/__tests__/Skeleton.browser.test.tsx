import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Skeleton } from '../Skeleton';

describe('Skeleton (Browser)', () => {
  it('renders with default animation', async () => {
    const screen = render(<Skeleton data-testid="skeleton" />);
    await expect.element(screen.getByTestId('skeleton')).toBeVisible();
  });

  it('renders multiple lines', async () => {
    const screen = render(
      <div data-testid="skeleton-lines">
        <Skeleton lines={3} />
      </div>,
    );
    await expect.element(screen.getByTestId('skeleton-lines')).toBeVisible();
  });
});
