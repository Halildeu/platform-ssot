import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { Avatar } from '../Avatar';

describe('Avatar (Browser)', () => {
  it('renders initials', async () => {
    const screen = render(<Avatar initials="JD" />);
    await expect.element(screen.getByText('JD')).toBeVisible();
  });

  it('renders fallback icon when no src or initials', async () => {
    const screen = render(<Avatar data-testid="avatar-fallback" />);
    await expect.element(screen.getByTestId('avatar-fallback')).toBeVisible();
  });

  it('falls back to initials on image error', async () => {
    const screen = render(
      <Avatar src="https://invalid-url.test/img.png" initials="AB" />,
    );
    // Image error triggers fallback to initials
    await expect.element(screen.getByText('AB')).toBeVisible();
  });
});
