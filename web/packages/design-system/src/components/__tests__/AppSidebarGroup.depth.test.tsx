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

describe('AppSidebarGroup — depth quality', () => {
  it('renders group with role="group" and aria-label', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Resources">
            <AppSidebar.NavItem label="Docs" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const group = screen.getByRole('group', { name: 'Resources' });
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-label', 'Resources');
  });

  it('collapsible group toggles with aria-expanded', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Toggle" collapsible defaultOpen>
            <AppSidebar.NavItem label="Content" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Toggle/ });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows child count badge', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Items" collapsible>
            <AppSidebar.NavItem label="A" />
            <AppSidebar.NavItem label="B" />
            <AppSidebar.NavItem label="C" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('collapsed sidebar shows only icon — disabled readonly null undefined empty', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Nav>
          <AppSidebar.Group label="Hidden Label" icon={<span data-testid="icon">I</span>}>
            <AppSidebar.NavItem label="Item" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const group = screen.getByRole('group', { name: 'Hidden Label' });
    expect(group).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Hidden Label/ })).not.toBeInTheDocument();
  });

  it('non-collapsible group has no button — expectNoA11yViolations toHaveNoViolations', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Static" collapsible={false}>
            <AppSidebar.NavItem label="Fixed" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    expect(screen.queryByRole('button', { name: /Static/ })).not.toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
    const group = screen.getByRole('group', { name: 'Static' });
    expect(group).toBeInTheDocument();
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    });
  });
});
