// @vitest-environment jsdom
// Auto-generated contract test — do not edit manually
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AppSidebarGroup } from '../AppSidebarGroup';
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

describe('AppSidebarGroup — contract', () => {
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
  });

  it('renders without crash', () => {
    const { container } = wrap(<AppSidebarGroup label="Test"><span>child</span></AppSidebarGroup>);
    expect(container.firstElementChild).toBeTruthy();
  });

  it('has displayName', () => {
    expect(AppSidebarGroup.displayName).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = wrap(<AppSidebarGroup label="Test" className="custom"><span>child</span></AppSidebarGroup>);
    expect(container.innerHTML).toContain('custom');
  });

  it('renders with only required props', () => {
    const { container } = wrap(<AppSidebarGroup label="Test"><span>child</span></AppSidebarGroup>);
    expect(container.firstElementChild).toBeTruthy();
  });
});
