// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { ShellHeaderNew } from '../ShellHeaderNew';

/* ---- mocks ---- */

let mockIsBelow = vi.fn(() => false);

vi.mock('@mfe/design-system', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@mfe/design-system');
  return {
    ...actual,
    useBreakpoint: () => ({
      current: 'lg',
      isAbove: () => true,
      isBelow: mockIsBelow,
      isExact: () => false,
      width: 1280,
    }),
    HeaderBar: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <header data-testid="header-bar" {...props}>{children}</header>
    ),
  };
});

vi.mock('../BrandMark', () => ({
  BrandMark: () => <div data-testid="brand-mark" />,
}));

vi.mock('../MegaNavigation', () => ({
  MegaNavigation: ({ mobile }: { mobile?: boolean }) => (
    <nav data-testid={mobile ? 'mega-nav-mobile' : 'mega-nav-desktop'} />
  ),
}));

vi.mock('../GlobalSearchTrigger', () => ({
  GlobalSearchTrigger: () => <div data-testid="global-search" />,
}));

vi.mock('../HeaderActions', () => ({
  HeaderActions: () => <div data-testid="header-actions" />,
}));

/* ---- tests ---- */

describe('ShellHeaderNew', () => {
  beforeEach(() => {
    mockIsBelow = vi.fn(() => false);
  });

  it('renders desktop layout with search and desktop nav', () => {
    render(<ShellHeaderNew />);
    expect(screen.getByTestId('mega-nav-desktop')).toBeInTheDocument();
    expect(screen.getByTestId('global-search')).toBeInTheDocument();
    expect(screen.queryByTestId('mega-nav-mobile')).not.toBeInTheDocument();
  });

  it('renders mobile layout with hamburger and no search', () => {
    mockIsBelow = vi.fn((bp: string) => bp === 'md');
    render(<ShellHeaderNew />);
    expect(screen.getByTestId('mega-nav-mobile')).toBeInTheDocument();
    expect(screen.queryByTestId('global-search')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mega-nav-desktop')).not.toBeInTheDocument();
  });

  it('always renders brand mark and actions', () => {
    render(<ShellHeaderNew />);
    expect(screen.getByTestId('brand-mark')).toBeInTheDocument();
    expect(screen.getByTestId('header-actions')).toBeInTheDocument();
  });
});
