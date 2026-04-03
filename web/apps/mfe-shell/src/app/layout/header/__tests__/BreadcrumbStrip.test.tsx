// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { BreadcrumbStrip } from '../BreadcrumbStrip';

/* ---- mocks ---- */

const mockItems = [
  { path: '/', label: 'Home', onClick: vi.fn() },
  { path: '/admin', label: 'Admin', onClick: vi.fn() },
  { path: '/admin/users', label: 'Users', onClick: vi.fn() },
  { path: '/admin/users/123', label: 'User Detail', onClick: vi.fn() },
  { path: '/admin/users/123/edit', label: 'Edit', onClick: vi.fn() },
];

vi.mock('@mfe/design-system/motion', () => ({
  Transition: ({ show, children }: { show: boolean; children: React.ReactNode }) =>
    show ? <>{children}</> : null,
}));

vi.mock('../useBreadcrumb', () => ({
  useBreadcrumb: () => ({
    items: mockItems,
    hasContent: true,
  }),
}));

/* ---- tests ---- */

describe('BreadcrumbStrip', () => {
  it('renders all items without maxItems', () => {
    render(<BreadcrumbStrip />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('User Detail')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('truncates middle items when maxItems=3', () => {
    render(<BreadcrumbStrip maxItems={3} />);
    // maxItems=3 means 3 items after home: keep first 2 + last 1
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    // "User Detail" should be hidden (middle truncation)
    expect(screen.queryByText('User Detail')).not.toBeInTheDocument();
    // Ellipsis shown
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('renders home icon', () => {
    render(<BreadcrumbStrip />);
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
  });

  it('marks last item as current page', () => {
    render(<BreadcrumbStrip />);
    const lastButton = screen.getByText('Edit').closest('button');
    expect(lastButton).toHaveAttribute('aria-current', 'page');
  });
});
