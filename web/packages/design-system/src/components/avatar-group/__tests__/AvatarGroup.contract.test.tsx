// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvatarGroup } from '../AvatarGroup';
import type { AvatarGroupItem } from '../AvatarGroup';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const items: AvatarGroupItem[] = [
  { key: '1', name: 'Alice Johnson' },
  { key: '2', name: 'Bob Smith' },
  { key: '3', name: 'Carol White' },
  { key: '4', name: 'Dan Brown' },
];

describe('AvatarGroup contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(AvatarGroup.displayName).toBe('AvatarGroup');
  });

  /* ---- Default render ---- */
  it('renders all avatars', () => {
    render(<AvatarGroup items={items} />);
    const avatarItems = screen.getAllByTestId('avatar-group-item');
    expect(avatarItems).toHaveLength(4);
  });

  it('renders with role=group', () => {
    render(<AvatarGroup items={items} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('has aria-label on group', () => {
    render(<AvatarGroup items={items} />);
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Avatar grubu');
  });

  /* ---- Max prop with excess badge ---- */
  it('renders excess badge when max is less than items length', () => {
    render(<AvatarGroup items={items} max={2} />);
    const excess = screen.getByTestId('avatar-group-excess');
    expect(excess).toHaveTextContent('+2');
  });

  it('limits visible avatars to max', () => {
    render(<AvatarGroup items={items} max={2} />);
    const avatarItems = screen.getAllByTestId('avatar-group-item');
    expect(avatarItems).toHaveLength(2);
  });

  /* ---- Callback: onClick ---- */
  it('calls onClick when avatar is clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<AvatarGroup items={items} onClick={handler} />);
    const firstAvatar = screen.getAllByTestId('avatar-group-item')[0];
    const clickable = firstAvatar.querySelector('[class*="cursor-pointer"]') ?? firstAvatar;
    await user.click(clickable);
    expect(handler).toHaveBeenCalled();
  });

  /* ---- className merging ---- */
  it('merges className', () => {
    render(<AvatarGroup items={items} className="my-group" />);
    expect(screen.getByRole('group').className).toContain('my-group');
  });

  /* ---- Access hidden ---- */
  it('renders nothing when access=hidden', () => {
    const { container } = render(<AvatarGroup items={items} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });
});

describe('AvatarGroup — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<AvatarGroup items={items} />);
    await expectNoA11yViolations(container);
  });
});
