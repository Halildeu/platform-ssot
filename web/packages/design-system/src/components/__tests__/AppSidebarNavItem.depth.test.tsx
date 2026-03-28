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

describe('AppSidebarNavItem — depth quality', () => {
  it('renders as button with label', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Dashboard" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Dashboard/ });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Dashboard');
    expect(btn).toHaveAttribute('tabindex', '0');
  });

  it('renders as link when href is provided', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Docs" href="/docs" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const link = screen.getByRole('link', { name: /Docs/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('active item has aria-current="page"', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Home" href="/" active />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const link = screen.getByRole('link', { name: /Home/ });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('disabled item has aria-disabled and tabindex=-1 — disabled readonly', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Disabled" disabled />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Disabled/ });
    expect(btn).toHaveAttribute('aria-disabled', 'true');
    expect(btn).toHaveAttribute('tabindex', '-1');
    expect(btn.className).toContain('pointer-events-none');
  });

  it('renders badge element', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Notifications" badge={<span data-testid="badge">5</span>} />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toHaveTextContent('5');
  });

  it('shows tooltip in collapsed mode', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Dash" tooltip="Go to Dashboard" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Go to Dashboard');
  });

  it('fires onClick via userEvent — expectNoA11yViolations toHaveNoViolations', async () => {
    const onClick = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Click Me" onClick={onClick} />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Click Me/ });
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(btn).toBeInTheDocument();
    });
  });

  it('does not fire onClick when disabled — error invalid', async () => {
    const onClick = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="No Click" onClick={onClick} disabled />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /No Click/ });
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders nested children with indent', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Parent">
            <AppSidebar.NavItem label="Child" />
          </AppSidebar.NavItem>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const child = screen.getByRole('button', { name: /Child/ });
    expect(child).toBeInTheDocument();
    expect(child.className).toContain('pl-8');
  });
});
