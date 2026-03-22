import { describe, it, expect, vi } from 'vitest';
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
  it('renders all avatars in a group', async () => {
    const screen = render(<AvatarGroup items={items} />);
    await expect.element(screen.getByRole('group')).toBeVisible();
    const avatarItems = screen.container.querySelectorAll('[data-testid="avatar-group-item"]');
    expect(avatarItems).toHaveLength(5);
  });

  it('shows overflow badge when max is set', async () => {
    const screen = render(<AvatarGroup items={items} max={3} />);
    await expect.element(screen.getByText('+2')).toBeVisible();
  });

  it('renders initials for avatars without src', async () => {
    const screen = render(<AvatarGroup items={[{ key: '1', name: 'Alice' }]} />);
    await expect.element(screen.getByText('A')).toBeVisible();
  });

  it('fires onClick when an avatar is clicked', async () => {
    const onClick = vi.fn();
    const screen = render(<AvatarGroup items={items} onClick={onClick} max={5} />);
    const avatars = screen.container.querySelectorAll('[data-testid="avatar-group-item"]');
    (avatars[0] as HTMLElement).click();
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ key: '1', name: 'Alice' }));
  });

  it('renders correct count with max=1', async () => {
    const screen = render(<AvatarGroup items={items} max={1} />);
    await expect.element(screen.getByText('+4')).toBeVisible();
  });

  it('renders all items when max exceeds count', async () => {
    const screen = render(<AvatarGroup items={items} max={10} />);
    const avatarItems = screen.container.querySelectorAll('[data-testid="avatar-group-item"]');
    expect(avatarItems).toHaveLength(5);
  });

  it('renders with different sizes', async () => {
    const screen = render(<AvatarGroup items={items.slice(0, 2)} size="lg" />);
    await expect.element(screen.getByRole('group')).toBeVisible();
  });

  it('renders with square shape', async () => {
    const screen = render(<AvatarGroup items={items.slice(0, 2)} shape="square" />);
    await expect.element(screen.getByRole('group')).toBeVisible();
  });
});
