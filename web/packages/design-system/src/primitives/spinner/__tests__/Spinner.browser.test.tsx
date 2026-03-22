import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Spinner } from '../Spinner';

describe('Spinner (Browser)', () => {
  it('renders with status role', async () => {
    const screen = render(<Spinner />);
    await expect.element(screen.getByRole('status')).toBeVisible();
  });

  it('has accessible label', async () => {
    const screen = render(<Spinner label="Processing" />);
    const spinner = screen.getByRole('status');
    await expect.element(spinner).toHaveAttribute('aria-label', 'Processing');
  });

  it('renders in block mode with visible label', async () => {
    const screen = render(<Spinner mode="block" label="Loading data" />);
    await expect.element(screen.getByText('Loading data')).toBeVisible();
  });
});
