// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MegaNavigation } from '../MegaNavigation';

/* ---- mocks ---- */

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('@mfe/design-system', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@mfe/design-system');
  return {
    ...actual,
    Drawer: ({ open, onClose, title, children }: {
      open: boolean; onClose: () => void; title?: string; children: React.ReactNode;
    }) => open ? (
      <div data-testid="drawer" role="dialog" aria-label={title}>
        <button data-testid="drawer-close" onClick={onClose}>close</button>
        {children}
      </div>
    ) : null,
  };
});

vi.mock('@mfe/design-system/motion', () => ({
  Transition: ({ show, children }: { show: boolean; children: React.ReactNode }) =>
    show ? <>{children}</> : null,
}));

const mockGroups = [
  {
    key: 'hr',
    label: 'HR',
    icon: () => <span data-testid="icon-hr" />,
    items: [
      { key: 'users', label: 'Users', path: '/admin/users', icon: () => <span /> },
      { key: 'roles', label: 'Roles', path: '/admin/roles', icon: () => <span /> },
    ],
  },
  {
    key: 'home',
    label: 'Home',
    icon: () => <span data-testid="icon-home" />,
    directPath: '/',
  },
];

vi.mock('../useHeaderNavigation', () => ({
  useHeaderNavigation: () => ({
    groups: mockGroups,
    activeGroupKey: 'hr',
    activeItemKey: 'users',
  }),
}));

vi.mock('../../../i18n', () => ({
  useShellCommonI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../MegaMenuPanel', () => ({
  MegaMenuPanel: ({ items, onClose }: { items: unknown[]; onClose: () => void }) => (
    <div data-testid="mega-menu-panel">
      <span>{items.length} items</span>
      <button onClick={onClose}>close-panel</button>
    </div>
  ),
}));

/* ---- tests ---- */

describe('MegaNavigation — desktop', () => {
  it('renders nav groups as inline buttons', () => {
    render(<MegaNavigation />);
    expect(screen.getByText('HR')).toBeInTheDocument();
  });

  it('opens mega menu on click', () => {
    render(<MegaNavigation />);
    const hrButton = screen.getByText('HR').closest('button')!;
    fireEvent.click(hrButton);
    expect(screen.getByTestId('mega-menu-panel')).toBeInTheDocument();
  });

  it('navigates directly for directPath groups', () => {
    render(<MegaNavigation />);
    const homeButton = screen.getByText('Home').closest('button')!;
    fireEvent.click(homeButton);
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});

describe('MegaNavigation — mobile', () => {
  it('renders hamburger button', () => {
    render(<MegaNavigation mobile />);
    expect(screen.getByLabelText('shell.header.menuOpen')).toBeInTheDocument();
  });

  it('opens drawer on hamburger click', () => {
    render(<MegaNavigation mobile />);
    fireEvent.click(screen.getByLabelText('shell.header.menuOpen'));
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
  });

  it('shows nav groups inside drawer', () => {
    render(<MegaNavigation mobile />);
    fireEvent.click(screen.getByLabelText('shell.header.menuOpen'));
    expect(screen.getByText('HR')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('expands group to show sub-items', () => {
    render(<MegaNavigation mobile />);
    fireEvent.click(screen.getByLabelText('shell.header.menuOpen'));
    fireEvent.click(screen.getByText('HR'));
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Roles')).toBeInTheDocument();
  });

  it('navigates and closes drawer on item click', () => {
    render(<MegaNavigation mobile />);
    fireEvent.click(screen.getByLabelText('shell.header.menuOpen'));
    fireEvent.click(screen.getByText('HR'));
    fireEvent.click(screen.getByText('Users'));
    expect(navigateMock).toHaveBeenCalledWith('/admin/users');
  });
});
