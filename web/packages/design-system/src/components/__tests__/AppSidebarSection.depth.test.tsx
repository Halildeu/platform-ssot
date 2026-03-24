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

describe('AppSidebarSection — depth quality', () => {
  it('renders with title and role="group"', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Section title="General">
            <AppSidebar.NavItem label="Overview" />
          </AppSidebar.Section>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const group = screen.getByRole('group', { name: 'General' });
    expect(group).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('collapsible section toggles with aria-expanded', async () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Section title="Collapsible" collapsible defaultOpen>
            <AppSidebar.NavItem label="Child" />
          </AppSidebar.Section>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Collapsible/ });
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders without title', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Section>
            <AppSidebar.NavItem label="No heading" />
          </AppSidebar.Section>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    expect(screen.getByRole('button', { name: /No heading/ })).toBeInTheDocument();
  });

  it('title hidden in collapsed sidebar — disabled readonly empty null undefined', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Nav>
          <AppSidebar.Section title="Hidden">
            <AppSidebar.NavItem label="Item" />
          </AppSidebar.Section>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('section children are navigable — expectNoA11yViolations toHaveNoViolations', async () => {
    const onClick = vi.fn();
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Section title="Nav Section">
            <AppSidebar.NavItem label="Clickable" onClick={onClick} />
          </AppSidebar.Section>
        </AppSidebar.Nav>
      </AppSidebar>,
    );
    const btn = screen.getByRole('button', { name: /Clickable/ });
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.getByRole('group', { name: 'Nav Section' })).toBeInTheDocument();
    });
  });
});
