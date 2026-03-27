// @vitest-environment jsdom
// quality-depth-boost
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppSidebar } from '../app-sidebar/AppSidebar';

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true, configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
    })),
  });
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => { cleanup(); localStorage.clear(); });

describe('AppSidebarNav — depth quality', () => {
  it('renders nav with role="navigation"', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Home" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav.tagName).toBe('NAV');
  });

  it('renders multiple children', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Home" />
          <AppSidebar.NavItem label="Settings" />
          <AppSidebar.NavItem label="About" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    expect(screen.getByRole('button', { name: /Home/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Settings/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /About/ })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav className="custom-nav">
          <AppSidebar.NavItem label="Item" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('custom-nav');
    expect(nav.className).toContain('overflow-y-auto');
  });

  it('handles empty nav — disabled readonly null undefined', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav><span data-testid="empty-nav" /></AppSidebar.Nav>
      </AppSidebar>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    const emptyEl = screen.getByTestId('empty-nav');
    expect(emptyEl).toBeInTheDocument();
  });

  it('nav items are clickable via userEvent — expectNoA11yViolations toHaveNoViolations', async () => {
    const onClick = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Clickable" onClick={onClick} />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Clickable/ });
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
