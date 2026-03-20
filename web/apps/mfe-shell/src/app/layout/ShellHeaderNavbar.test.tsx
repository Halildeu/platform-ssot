import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ShellHeaderNavbar, __shellHeaderNavbarTestUtils } from './ShellHeaderNavbar';

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

  const setMeasuredWidths = (rootWidth: number, utilityWidth = 120) => {
    const root = screen.getByTestId('shell-header-navbar');
    const utility = screen.getByTestId('shell-header-navbar-utility');

    Object.defineProperty(root, 'getBoundingClientRect', {
      configurable: true,
      value: () => __shellHeaderNavbarTestUtils.rectWithWidth(rootWidth),
    });
    Object.defineProperty(utility, 'getBoundingClientRect', {
      configurable: true,
      value: () => __shellHeaderNavbarTestUtils.rectWithWidth(utilityWidth),
    });

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };

  it('gorunen nav item tiklandiginda navigate eder', async () => {
    renderNavbar();
    setMeasuredWidths(960, 120);

    fireEvent.click(screen.getByText('Ana Sayfa'));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });

  it('dar alanda overflow menusu acilir ve item secimi navigate eder', async () => {
    renderNavbar('/audit/events');
    setMeasuredWidths(360, 128);

    await waitFor(() => {
      expect(screen.getByTestId('shell-header-navbar-overflow-trigger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('shell-header-navbar-overflow-trigger'));
    fireEvent.click(screen.getByTestId('shell-header-navbar-overflow-admin-users'));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/admin/users');
    });
  });
});
