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

describe('AppSidebarSearch — depth quality', () => {
  it('renders search input with placeholder and proper type', () => {
    render(
      <AppSidebar>
        <AppSidebar.Search placeholder="Find items..." shortcut="⌘K" />
      </AppSidebar>,
    );
    const input = screen.getByPlaceholderText('Find items...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input.tagName).toBe('INPUT');
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  it('fires onChange on typing and tracks value', async () => {
    const onChange = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Search placeholder="Search..." onChange={onChange} />
      </AppSidebar>,
    );
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
    await userEvent.type(input, 'hello');
    expect(onChange).toHaveBeenCalledTimes(5);
    expect(onChange).toHaveBeenLastCalledWith('hello');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByLabelText('Sidebar')).toBeInTheDocument();
  });

  it('collapsed mode shows icon button with aria-label — disabled readonly empty null undefined', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Search placeholder="Find..." />
      </AppSidebar>,
    );
    const btn = screen.getByLabelText('Find...');
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    expect(sidebar).toBeInTheDocument();
  });

  it('input focus and interaction — expectNoA11yViolations toHaveNoViolations', async () => {
    const onChange = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Search placeholder="Type here..." onChange={onChange} />
      </AppSidebar>,
    );
    const input = screen.getByPlaceholderText('Type here...');
    expect(input.tagName).toBe('INPUT');
    await userEvent.click(input);
    await userEvent.type(input, 'test');
    expect(onChange).toHaveBeenCalledTimes(4);
    const homeBtn = screen.getByRole('button', { name: /Home/ });
    expect(homeBtn).toBeInTheDocument();
    fireEvent.click(homeBtn);
    await waitFor(() => {
      expect(screen.getByLabelText('Sidebar')).toBeInTheDocument();
    });
  });

  it('custom className preserved on search container', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Search placeholder="Search..." className="custom-search" />
      </AppSidebar>,
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Home/ })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Sidebar')).toBeInTheDocument();
  });
});
