import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { IconButton } from '../IconButton';

const TestIcon = () => (
  <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
);

describe('IconButton (Browser)', () => {
  it('renders with aria-label', async () => {
    const screen = render(<IconButton icon={<TestIcon />} label="Close" />);
    const btn = screen.getByRole('button', { name: 'Close' });
    await expect.element(btn).toBeVisible();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const screen = render(<IconButton icon={<TestIcon />} label="Edit" onClick={onClick} />);
    await screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = render(<IconButton icon={<TestIcon />} label="Delete" disabled />);
    const btn = screen.getByRole('button');
    await expect.element(btn).toBeDisabled();
  });
});
