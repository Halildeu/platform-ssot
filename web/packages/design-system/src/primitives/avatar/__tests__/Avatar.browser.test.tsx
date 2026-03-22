import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Avatar } from '../Avatar';

describe('Avatar (Browser)', () => {
  it('renders initials', async () => {
    const screen = await render(<Avatar initials="JD" />);
    await expect.element(screen.getByText('JD')).toBeVisible();
  });

  it('renders fallback when no src or initials', async () => {
    const screen = await render(<Avatar data-testid="avatar-fallback" />);
    await expect.element(screen.getByTestId('avatar-fallback')).toBeVisible();
  });

  it('falls back to initials on image error', async () => {
    const screen = await render(<Avatar src="https://invalid-url.test/img.png" initials="AB" />);
    await expect.element(screen.getByText('AB')).toBeVisible();
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<Avatar initials="X" />);
    const el = document.querySelector('[data-component="avatar"]');
    expect(el).not.toBeNull();
  });

  it('renders different sizes', async () => {
    const screen = await render(
      <div>
        <Avatar initials="SM" size="sm" data-testid="sm" />
        <Avatar initials="LG" size="lg" data-testid="lg" />
        <Avatar initials="XL" size="xl" data-testid="xl" />
      </div>,
    );
    await expect.element(screen.getByTestId('sm')).toBeVisible();
    await expect.element(screen.getByTestId('lg')).toBeVisible();
    await expect.element(screen.getByTestId('xl')).toBeVisible();
  });

  it('renders square shape', async () => {
    const screen = await render(<Avatar initials="SQ" shape="square" data-testid="square" />);
    await expect.element(screen.getByTestId('square')).toBeVisible();
  });

  it('renders custom icon fallback', async () => {
    const screen = await render(
      <Avatar icon={<svg data-testid="custom-icon"><circle cx="8" cy="8" r="6" /></svg>} />,
    );
    await expect.element(screen.getByTestId('custom-icon')).toBeVisible();
  });
});
