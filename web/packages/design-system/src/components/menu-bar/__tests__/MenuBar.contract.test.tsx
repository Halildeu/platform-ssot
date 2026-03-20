// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuBar, type MenuBarItem } from '../MenuBar';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makeItems = (): MenuBarItem[] => [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'contact', label: 'Contact' },
];

describe('MenuBar contract', () => {
  /* ---- Identity ---- */
  it('has displayName', () => {
    expect(MenuBar.displayName).toBe('MenuBar');
  });

  it('renders with required props', () => {
    render(<MenuBar items={makeItems()} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<MenuBar ref={ref} items={makeItems()} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  /* ---- ariaLabel ---- */
  it('renders with aria-label on menubar', () => {
    render(<MenuBar items={makeItems()} ariaLabel="Main navigation" />);
    expect(screen.getByRole('menubar', { name: 'Main navigation' })).toBeInTheDocument();
  });

  /* ---- Controlled value ---- */
  it('respects controlled value', () => {
    const { container } = render(<MenuBar items={makeItems()} value="about" />);
    const activeItem = container.querySelector('[data-active="true"]');
    expect(activeItem).toBeInTheDocument();
  });

  /* ---- onValueChange callback ---- */
  it('fires onValueChange on item click', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<MenuBar items={makeItems()} onValueChange={handler} />);
    await user.click(screen.getByText('About'));
    expect(handler).toHaveBeenCalledWith('about');
  });

  /* ---- Disabled item ---- */
  it('renders disabled items', () => {
    const items: MenuBarItem[] = [
      { value: 'a', label: 'Active' },
      { value: 'b', label: 'Disabled', disabled: true },
    ];
    render(<MenuBar items={items} />);
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  /* ---- Access control: hidden ---- */
  it('access=hidden returns null', () => {
    const { container } = render(<MenuBar items={makeItems()} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  /* ---- Sizes ---- */
  it.each(['sm', 'md'] as const)('renders size=%s', (size) => {
    render(<MenuBar items={makeItems()} size={size} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});

describe('MenuBar — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<MenuBar items={makeItems()} ariaLabel="Main nav" />);
    await expectNoA11yViolations(container);
  });
});
