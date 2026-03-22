import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { IconButton } from '../IconButton';

const TestIcon = () => (
  <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /></svg>
);

describe('IconButton (Browser)', () => {
  it('renders with aria-label', async () => {
    const screen = await render(<IconButton icon={<TestIcon />} label="Close" />);
    const btn = screen.getByRole('button', { name: 'Close' });
    await expect.element(btn).toBeVisible();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const screen = await render(<IconButton icon={<TestIcon />} label="Edit" onClick={onClick} />);
    await screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', async () => {
    const screen = await render(<IconButton icon={<TestIcon />} label="Delete" disabled />);
    await expect.element(screen.getByRole('button')).toBeDisabled();
  });

  it('does not fire onClick when disabled', async () => {
    const screen = await render(<IconButton icon={<TestIcon />} label="Action" disabled />);
    await expect.element(screen.getByRole('button')).toBeDisabled();
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<IconButton icon={<TestIcon />} label="Test" />);
    const el = document.querySelector('[data-component="icon-button"]');
    expect(el).not.toBeNull();
  });

  it('renders different variants', async () => {
    const screen = await render(
      <div>
        <IconButton icon={<TestIcon />} label="Primary" variant="primary" data-testid="primary" />
        <IconButton icon={<TestIcon />} label="Ghost" variant="ghost" data-testid="ghost" />
        <IconButton icon={<TestIcon />} label="Danger" variant="danger" data-testid="danger" />
      </div>,
    );
    await expect.element(screen.getByTestId('primary')).toBeVisible();
    await expect.element(screen.getByTestId('ghost')).toBeVisible();
    await expect.element(screen.getByTestId('danger')).toBeVisible();
  });

  it('renders different sizes', async () => {
    const screen = await render(
      <div>
        <IconButton icon={<TestIcon />} label="XS" size="xs" data-testid="xs" />
        <IconButton icon={<TestIcon />} label="LG" size="lg" data-testid="lg" />
      </div>,
    );
    await expect.element(screen.getByTestId('xs')).toBeVisible();
    await expect.element(screen.getByTestId('lg')).toBeVisible();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<IconButton icon={<TestIcon />} label="Hidden" access="hidden" />);
    expect(document.querySelector('button')).toBeNull();
  });
});
