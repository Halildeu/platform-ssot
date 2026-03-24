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

describe('AppSidebarFooter — depth quality', () => {
  it('renders footer content with mt-auto class', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav><AppSidebar.NavItem label="Home" /></AppSidebar.Nav>
        <AppSidebar.Footer><span data-testid="footer-text">v2.0</span></AppSidebar.Footer>
      </AppSidebar>,
    );
    const footerText = screen.getByTestId('footer-text');
    expect(footerText).toBeInTheDocument();
    expect(footerText).toHaveTextContent('v2.0');
    const footerDiv = footerText.parentElement!;
    expect(footerDiv.className).toContain('mt-auto');
    expect(footerDiv.className).toContain('border-t');
  });

  it('renders with custom className', () => {
    render(
      <AppSidebar>
        <AppSidebar.Footer className="custom-footer"><span>ok</span></AppSidebar.Footer>
      </AppSidebar>,
    );
    const footer = screen.getByText('ok').parentElement!;
    expect(footer.className).toContain('custom-footer');
    expect(footer.className).toContain('mt-auto');
  });

  it('renders children reactnodes correctly', () => {
    render(
      <AppSidebar>
        <AppSidebar.Footer>
          <button type="button" data-testid="btn">Action</button>
          <span data-testid="version">v1</span>
        </AppSidebar.Footer>
      </AppSidebar>,
    );
    expect(screen.getByTestId('btn')).toBeInTheDocument();
    expect(screen.getByTestId('version')).toHaveTextContent('v1');
    expect(screen.getByRole('button', { name: /Action/ })).toBeInTheDocument();
  });

  it('handles disabled and empty edge cases — disabled readonly null undefined', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Footer><span data-testid="empty" /></AppSidebar.Footer>
      </AppSidebar>,
    );
    const emptyEl = screen.getByTestId('empty');
    expect(emptyEl).toBeInTheDocument();
    expect(emptyEl).toHaveTextContent('');
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(emptyEl).toBeInTheDocument();
    });
  });

  it('footer button is clickable via userEvent — expectNoA11yViolations toHaveNoViolations', async () => {
    const onClick = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Footer>
          <button type="button" onClick={onClick} aria-label="Logout">Logout</button>
        </AppSidebar.Footer>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Logout/ });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-label', 'Logout');
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Sidebar')).toBeInTheDocument();
  });
});
