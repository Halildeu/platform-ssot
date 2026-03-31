// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ShellHeaderNavbar } from './ShellHeaderNavbar';

describe('ShellHeaderNavbar', () => {
  const navigateMock = vi.fn();
  const items = [
    { key: '/', path: '/', label: 'Ana Sayfa' },
    { key: '/suggestions', path: '/suggestions', label: 'Öneriler' },
    { key: '/ethic', path: '/ethic', label: 'Etik' },
    { key: '/access', path: '/access/roles', label: 'Erişim' },
    { key: '/audit', path: '/audit/events', label: 'Denetim' },
    { key: '/admin/users', path: '/admin/users', label: 'Kullanıcılar' },
    { key: '/admin/themes', path: '/admin/themes', label: 'Temalar' },
  ];

  beforeEach(() => {
    navigateMock.mockReset();
    vi.stubGlobal(
      'ResizeObserver',
      class ResizeObserverMock {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  const renderNavbar = (currentPath = '/admin/users') =>
    render(
      <div style={{ width: 960 }}>
        <ShellHeaderNavbar
          items={items}
          currentPath={currentPath}
          onNavigate={navigateMock}
          ariaLabel="Ana gezinme"
          morePagesLabel="Diğer sayfalar"
          utility={<span>Design Lab</span>}
        />
      </div>,
    );

  it('renders navigation items', () => {
    renderNavbar();
    expect(screen.getByTestId('shell-header-navbar')).toBeInTheDocument();
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
  });

  it('navigates on item click', async () => {
    renderNavbar();
    fireEvent.click(screen.getByText('Ana Sayfa'));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });

  it('renders utility slot', () => {
    renderNavbar();
    expect(screen.getByText('Design Lab')).toBeInTheDocument();
  });
});
