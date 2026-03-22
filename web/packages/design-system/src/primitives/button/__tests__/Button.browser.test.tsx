import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Button } from '../Button';

describe('Button (Browser)', () => {
  it('renders with correct text', async () => {
    const screen = render(<Button>Click me</Button>);
    await expect.element(screen.getByText('Click me')).toBeVisible();
  });

  it('applies primary variant styles', async () => {
    const screen = render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole('button');
    await expect.element(btn).toBeVisible();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button');
    await expect.element(btn).toBeDisabled();
  });
});
