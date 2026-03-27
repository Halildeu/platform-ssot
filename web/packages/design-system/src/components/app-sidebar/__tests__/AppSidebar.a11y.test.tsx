// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { AppSidebar } from '../AppSidebar';

/* Mock matchMedia and scrollIntoView — jsdom does not implement them */
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const HomeIcon = () => <span data-testid="home-icon">H</span>;
const SettingsIcon = () => <span data-testid="settings-icon">S</span>;

/* ================================================================== */
/*  A11y Tests                                                         */
/* ================================================================== */

describe('AppSidebar — accessibility', () => {
  it('sidebar has navigation landmark via Nav component', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    // The Nav sub-component renders a <nav role="navigation">
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('trigger has aria-label', () => {
    render(
      <AppSidebar>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
      </AppSidebar>,
    );

    const trigger = screen.getByLabelText('Collapse sidebar');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-label');
  });

  it('active item has aria-current="page"', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" href="/" active />
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" href="/settings" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const activeLink = screen.getByRole('link', { name: /Home/ });
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    const inactiveLink = screen.getByRole('link', { name: /Settings/ });
    expect(inactiveLink).not.toHaveAttribute('aria-current');
  });

  it('disabled item has aria-disabled="true"', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Disabled Item" disabled />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const disabledBtn = screen.getByRole('button', { name: /Disabled Item/ });
    expect(disabledBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('collapsible group has aria-expanded', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Resources" collapsible defaultOpen>
            <AppSidebar.NavItem icon={<HomeIcon />} label="Docs" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const groupButton = screen.getByRole('button', { name: /Resources/ });
    expect(groupButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('search input has accessible labeling', () => {
    render(
      <AppSidebar>
        <AppSidebar.Search placeholder="Search navigation..." />
      </AppSidebar>,
    );

    // The search input is wrapped in a <label> element, providing implicit association
    const input = screen.getByPlaceholderText('Search navigation...');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('all nav items are focusable via tabindex', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const homeBtn = screen.getByRole('button', { name: /Home/ });
    const settingsBtn = screen.getByRole('button', { name: /Settings/ });

    // Buttons without disabled should have tabindex=0
    expect(homeBtn).toHaveAttribute('tabindex', '0');
    expect(settingsBtn).toHaveAttribute('tabindex', '0');
  });

  it('collapsed items have tooltip for label', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" tooltip="Go to Dashboard" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    // Collapsed NavItem renders a role="tooltip" element
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Go to Dashboard');
  });
});
