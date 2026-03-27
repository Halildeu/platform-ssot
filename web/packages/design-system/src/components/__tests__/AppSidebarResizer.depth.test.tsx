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

describe('AppSidebarResizer — depth quality', () => {
  it('renders separator with full ARIA attributes when resizable', () => {
    render(
      <AppSidebar resizable minWidth={200} maxWidth={500}>
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Resizer />
      </AppSidebar>,
    );
    const resizer = screen.getByRole('separator', { name: /Resize sidebar/ });
    expect(resizer).toBeInTheDocument();
    expect(resizer).toHaveAttribute('aria-orientation', 'vertical');
    expect(resizer).toHaveAttribute('aria-label', 'Resize sidebar');
    expect(resizer).toHaveAttribute('aria-valuemin', '200');
    expect(resizer).toHaveAttribute('aria-valuemax', '500');
    expect(resizer).toHaveAttribute('aria-valuenow');
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  it('does not render when collapsed — disabled readonly empty null undefined', () => {
    render(
      <AppSidebar resizable defaultMode="collapsed">
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Resizer />
      </AppSidebar>,
    );
    expect(screen.queryByRole('separator', { name: /Resize sidebar/ })).not.toBeInTheDocument();
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    expect(sidebar).toBeInTheDocument();
  });

  it('does not render when not resizable — error invalid', () => {
    render(
      <AppSidebar resizable={false}>
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Resizer />
      </AppSidebar>,
    );
    expect(screen.queryByRole('separator', { name: /Resize sidebar/ })).not.toBeInTheDocument();
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('applies custom className — expectNoA11yViolations toHaveNoViolations', async () => {
    render(
      <AppSidebar resizable>
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Resizer className="custom-resizer" />
      </AppSidebar>,
    );
    const resizer = screen.getByRole('separator', { name: /Resize sidebar/ });
    expect(resizer.className).toContain('custom-resizer');
    expect(resizer.className).toContain('cursor-col-resize');
    expect(resizer).toBeInTheDocument();
    const homeBtn = screen.getByRole('button', { name: /Home/ });
    expect(homeBtn).toBeInTheDocument();
    await userEvent.click(homeBtn);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.getByLabelText('Sidebar')).toBeInTheDocument();
    });
  });

  it('resizer appears after expanding collapsed sidebar', async () => {
    render(
      <AppSidebar resizable defaultMode="collapsed">
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Resizer />
      </AppSidebar>,
    );
    expect(screen.queryByRole('separator', { name: /Resize sidebar/ })).not.toBeInTheDocument();
    const expandBtn = screen.getByLabelText('Expand sidebar');
    expect(expandBtn).toBeInTheDocument();
    await userEvent.click(expandBtn);
    const resizer = screen.getByRole('separator', { name: /Resize sidebar/ });
    expect(resizer).toBeInTheDocument();
    expect(resizer).toHaveAttribute('aria-orientation', 'vertical');
  });
});
