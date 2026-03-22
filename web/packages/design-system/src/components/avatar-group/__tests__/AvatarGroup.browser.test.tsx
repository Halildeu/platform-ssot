import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { AvatarGroup } from '../AvatarGroup';

const items = [
  { key: '1', name: 'Alice' },
  { key: '2', name: 'Bob' },
  { key: '3', name: 'Charlie' },
  { key: '4', name: 'Diana' },
  { key: '5', name: 'Eve' },
];

describe('AvatarGroup (Browser)', () => {
  it('renders all avatars', async () => {
    const screen = render(<AvatarGroup items={items} />);
    await expect.element(screen.getByRole('group')).toBeVisible();
    const avatarItems = screen.container.querySelectorAll('[data-testid="avatar-group-item"]');
    expect(avatarItems).toHaveLength(5);
  });

  it('shows overflow badge when max is set', async () => {
    const screen = render(<AvatarGroup items={items} max={3} />);
    await expect.element(screen.getByText('+2')).toBeVisible();
  });
});
