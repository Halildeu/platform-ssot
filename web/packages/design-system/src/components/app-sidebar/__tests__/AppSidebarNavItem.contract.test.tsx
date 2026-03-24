// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AppSidebarNavItem } from '../AppSidebarNavItem';
import { SidebarContext } from '../useSidebar';
import type { SidebarContextValue } from '../types';

const mockCtx: SidebarContextValue = {
  mode: 'expanded',
  toggle: () => {},
  expand: () => {},
  collapse: () => {},
  isCollapsed: false,
  resize: null,
  setWidth: () => {},
  setIsResizing: () => {},
};

const wrap = (ui: React.ReactElement) =>
  render(<SidebarContext.Provider value={mockCtx}>{ui}</SidebarContext.Provider>);

describe('AppSidebarNavItem — contract', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((q: string) => ({
        matches: false, media: q, onchange: null,
        addListener: vi.fn(), removeListener: vi.fn(),
        addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
      })),
    });
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders without crash', () => {
    const { container } = wrap(<AppSidebarNavItem label="Home" />);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarNavItem.displayName).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = wrap(<AppSidebarNavItem label="Home" className="custom" />);
    expect(container.innerHTML).toContain('custom');
  });

  it('renders with only required props', () => {
    const { container } = wrap(<AppSidebarNavItem label="Home" />);
    expect(container.firstElementChild).toBeTruthy();
  });
});
