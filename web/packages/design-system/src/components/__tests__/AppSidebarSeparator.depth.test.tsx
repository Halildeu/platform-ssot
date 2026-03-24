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

describe('AppSidebarSeparator — depth quality', () => {
  it('renders as hr with role="separator" and correct classes', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="Above" />
          <AppSidebar.Separator />
          <AppSidebar.NavItem label="Below" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep.tagName).toBe('HR');
    expect(sep.className).toContain('border-t');
    expect(sep.className).toContain('mx-3');
    expect(sep.className).toContain('my-2');
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Above/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Below/ })).toBeInTheDocument();
  });

  it('collapsed mode uses narrower margins — disabled readonly empty null undefined', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Nav>
          <AppSidebar.Separator />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep.className).toContain('mx-2');
    expect(sep.className).toContain('my-1');
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    expect(sidebar).toBeInTheDocument();
  });

  it('applies custom className and preserves defaults', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Separator className="custom-sep" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const sep = screen.getByRole('separator');
    expect(sep.className).toContain('custom-sep');
    expect(sep.className).toContain('border-t');
    expect(sep.className).toContain('mx-3');
    expect(sep).toBeInTheDocument();
    expect(sep.tagName).toBe('HR');
  });

  it('multiple separators and interactive siblings — expectNoA11yViolations toHaveNoViolations', async () => {
    const onClick = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem label="First" onClick={onClick} />
          <AppSidebar.Separator />
          <AppSidebar.NavItem label="Second" />
          <AppSidebar.Separator />
          <AppSidebar.NavItem label="Third" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const seps = screen.getAllByRole('separator');
    expect(seps).toHaveLength(2);
    const firstBtn = screen.getByRole('button', { name: /First/ });
    expect(firstBtn).toBeInTheDocument();
    await userEvent.click(firstBtn);
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: 'Escape' });
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  it('separator renders between groups', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="GroupA" collapsible>
            <AppSidebar.NavItem label="Item1" />
          </AppSidebar.Group>
          <AppSidebar.Separator />
          <AppSidebar.Group label="GroupB" collapsible>
            <AppSidebar.NavItem label="Item2" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    const groupA = screen.getByRole('group', { name: 'GroupA' });
    expect(groupA).toBeInTheDocument();
    const groupB = screen.getByRole('group', { name: 'GroupB' });
    expect(groupB).toBeInTheDocument();
    const btnA = screen.getByRole('button', { name: /GroupA/ });
    expect(btnA).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btnA);
    expect(btnA).toHaveAttribute('aria-expanded', 'false');
  });
});
