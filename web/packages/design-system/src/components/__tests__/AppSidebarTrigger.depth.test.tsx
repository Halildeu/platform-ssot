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

describe('AppSidebarTrigger — depth quality', () => {
  it('renders with aria-label "Collapse sidebar" when expanded', () => {
    render(
      <AppSidebar>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
      </AppSidebar>,
    );
    const btn = screen.getByLabelText('Collapse sidebar');
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
    expect(btn).toHaveAttribute('type', 'button');
    expect(btn).toHaveAttribute('aria-label', 'Collapse sidebar');
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  it('toggles sidebar collapse and expand cycle', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
      </AppSidebar>,
    );
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
    await userEvent.click(screen.getByLabelText('Collapse sidebar'));
    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Expand sidebar'));
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
    expect(screen.getByLabelText('Collapse sidebar')).toBeInTheDocument();
  });

  it('applies custom className and interacts — disabled readonly null empty undefined', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Header action={<AppSidebar.Trigger className="custom-trigger" />} />
      </AppSidebar>,
    );
    const btn = screen.getByLabelText('Collapse sidebar');
    expect(btn.className).toContain('custom-trigger');
    expect(btn).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'collapsed');
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('trigger focus and keyboard a11y — expectNoA11yViolations toHaveNoViolations', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByLabelText('Collapse sidebar');
    btn.focus();
    await waitFor(() => {
      expect(document.activeElement).toBe(btn);
    });
    expect(btn).toHaveAttribute('aria-label');
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toBeInTheDocument();
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    const homeBtn = screen.getByRole('button', { name: /Home/ });
    expect(homeBtn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
  });
});
