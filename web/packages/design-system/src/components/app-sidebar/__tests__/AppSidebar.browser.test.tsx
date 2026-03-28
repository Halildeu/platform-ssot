import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AppSidebar } from '../AppSidebar';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const HomeIcon = () => <span data-testid="home-icon">H</span>;
const SettingsIcon = () => <span data-testid="settings-icon">S</span>;

/* ================================================================== */
/*  Browser Tests                                                      */
/* ================================================================== */

describe('AppSidebar (Browser)', () => {
  it('sidebar renders and is visible', async () => {
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    // Sidebar uses aside element with data-sidebar attribute
    const sidebar = screen.container.querySelector('[data-sidebar]');
    expect(sidebar).toBeTruthy();
  });

  it('NavItem click triggers onClick', async () => {
    const onClick = vi.fn();
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" onClick={onClick} />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    // NavItem may render as button or link depending on props
    const item = screen.getByText('Dashboard');
    await item.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('search renders in sidebar', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Search placeholder="Search..." />
      </AppSidebar>,
    );

    // Search component renders — may be input or button depending on collapsed state
    const searchEl = screen.container.querySelector('input, [type="button"]');
    expect(searchEl).toBeTruthy();
  });

  it('active item has aria-current', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" href="/" active />
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const activeLink = screen.getByRole('link', { name: /Home/ });
    await expect.element(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('footer renders', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
        <AppSidebar.Footer>
          <span data-testid="footer-text">v1.0</span>
        </AppSidebar.Footer>
      </AppSidebar>,
    );

    await expect.element(screen.getByText('v1.0')).toBeVisible();
  });

  it('separator renders between items', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
          <AppSidebar.Separator />
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const separator = screen.getByRole('separator');
    await expect.element(separator).toBeVisible();
  });

  it('trigger button renders in header', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
      </AppSidebar>,
    );

    // Trigger has either "Collapse sidebar" or "Expand sidebar" label
    const trigger = screen.container.querySelector('[aria-label*="sidebar"]');
    expect(trigger).toBeTruthy();
  });

  it('data-sidebar attribute present', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const sidebar = screen.container.querySelector('[data-sidebar]');
    expect(sidebar).toBeTruthy();
    expect(sidebar?.tagName.toLowerCase()).toBe('aside');
  });
});
