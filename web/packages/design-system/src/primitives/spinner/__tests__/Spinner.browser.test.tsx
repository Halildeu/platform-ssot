import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Spinner } from '../Spinner';

describe('Spinner (Browser)', () => {
  it('renders with status role', async () => {
    const screen = await render(<Spinner />);
    await expect.element(screen.getByRole('status')).toBeVisible();
  });

  it('has default Loading aria-label', async () => {
    const screen = await render(<Spinner />);
    const spinner = screen.getByRole('status');
    await expect.element(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('has custom accessible label', async () => {
    const screen = await render(<Spinner label="Processing" />);
    const spinner = screen.getByRole('status');
    await expect.element(spinner).toHaveAttribute('aria-label', 'Processing');
  });

  it('renders in block mode with visible label', async () => {
    const screen = await render(<Spinner mode="block" label="Loading data" />);
    await expect.element(screen.getByText('Loading data')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<Spinner />);
    const el = document.querySelector('[data-component="spinner"]');
    expect(el).not.toBeNull();
  });

  it('renders different sizes', async () => {
    const screen = await render(
      <div>
        <Spinner size="xs" label="XS" />
        <Spinner size="lg" label="LG" />
        <Spinner size="xl" label="XL" />
      </div>,
    );
    expect(document.querySelectorAll('[role="status"]').length).toBe(3);
  });

  it('renders loading data attribute', async () => {
    const screen = await render(<Spinner />);
    const el = document.querySelector('[data-loading="true"]');
    expect(el).not.toBeNull();
  });
});
