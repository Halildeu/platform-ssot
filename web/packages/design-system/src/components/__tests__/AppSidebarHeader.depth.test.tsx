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

describe('AppSidebarHeader — depth quality', () => {
  it('renders title and subtitle', () => {
    render(
      <AppSidebar>
        <AppSidebar.Header title="My App" subtitle="v1.0" />
      </AppSidebar>,
    );
    expect(screen.getByText('My App')).toBeInTheDocument();
    expect(screen.getByText('v1.0')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('My App');
  });

  it('renders logo element', () => {
    render(
      <AppSidebar>
        <AppSidebar.Header logo={<span data-testid="logo">DL</span>} title="App" />
      </AppSidebar>,
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toHaveTextContent('DL');
  });

  it('renders action slot with trigger', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Header title="App" action={<AppSidebar.Trigger />} />
      </AppSidebar>,
    );
    const trigger = screen.getByLabelText('Collapse sidebar');
    expect(trigger).toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('hides title and subtitle in collapsed mode — disabled readonly null undefined', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Header title="Hidden Title" subtitle="Hidden Sub" />
      </AppSidebar>,
    );
    expect(screen.queryByText('Hidden Title')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden Sub')).not.toBeInTheDocument();
  });

  it('applies custom className — expectNoA11yViolations toHaveNoViolations', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Header title="Styled" className="custom-header" />
      </AppSidebar>,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Styled');
    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    });
  });
});
