import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AppSidebar } from '../AppSidebar';
import { useSidebar } from '../useSidebar';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const HomeIcon = () => <span data-testid="home-icon">H</span>;
const SettingsIcon = () => <span data-testid="settings-icon">S</span>;

function ToggleButton() {
  const { toggle, isCollapsed } = useSidebar();
  return (
    <button data-testid="toggle" onClick={toggle}>
      {isCollapsed ? 'collapsed' : 'expanded'}
    </button>
  );
}

/* ================================================================== */
/*  Browser Tests                                                      */
/* ================================================================== */

describe('AppSidebar (Browser)', () => {
  it('sidebar renders with correct width', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={280}>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const sidebar = screen.getByLabelText('Sidebar');
    await expect.element(sidebar).toBeVisible();
    expect(sidebar.element().style.width).toBe('280px');
  });

  it('collapse toggle changes width', async () => {
    const screen = await render(
      <AppSidebar expandedWidth={260} collapsedWidth={56}>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
        <ToggleButton />
      </AppSidebar>,
    );

    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar.element().style.width).toBe('260px');

    await screen.getByLabelText('Collapse sidebar').click();
    expect(sidebar.element().style.width).toBe('56px');
  });

  it('NavItem click triggers onClick', async () => {
    const onClick = vi.fn();
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" onClick={onClick} />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    await screen.getByText('Dashboard').click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('search input accepts text', async () => {
    const onChange = vi.fn();
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Search placeholder="Search..." onChange={onChange} />
      </AppSidebar>,
    );

    const input = screen.getByPlaceholderText('Search...');
    await input.fill('test query');
    expect(onChange).toHaveBeenCalled();
  });

  it('Group header click collapses content', async () => {
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Resources" collapsible defaultOpen>
            <AppSidebar.NavItem icon={<HomeIcon />} label="Docs" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    await expect.element(screen.getByText('Docs')).toBeVisible();

    const groupHeader = screen.getByRole('button', { name: /Resources/ });
    await groupHeader.click();
    await expect.element(groupHeader).toHaveAttribute('aria-expanded', 'false');
  });

  it('active item has visual indicator', async () => {
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" href="/" active />
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const activeLink = screen.getByRole('link', { name: /Home/ });
    await expect.element(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('nested items show proper indentation', async () => {
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Parent">
            <AppSidebar.NavItem label="Child Item" />
          </AppSidebar.NavItem>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    await expect.element(screen.getByText('Parent')).toBeVisible();
    await expect.element(screen.getByText('Child Item')).toBeVisible();

    // Child button should have deeper indentation class
    const childBtn = screen.getByRole('button', { name: /Child Item/ });
    expect(childBtn.element().className).toContain('pl-8');
  });

  it('footer stays at bottom', async () => {
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
        <AppSidebar.Footer>
          <span data-testid="footer">v1.0</span>
        </AppSidebar.Footer>
      </AppSidebar>,
    );

    await expect.element(screen.getByText('v1.0')).toBeVisible();
    // Footer uses mt-auto to push to the bottom
    const footer = screen.getByText('v1.0').element().parentElement!;
    expect(footer.className).toContain('mt-auto');
  });

  it('separator renders between groups', async () => {
    const screen = await render(
      <AppSidebar>
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

  it('trigger icon changes on collapse', async () => {
    const screen = await render(
      <AppSidebar>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
      </AppSidebar>,
    );

    // Expanded state shows "Collapse sidebar" label
    const collapseBtn = screen.getByLabelText('Collapse sidebar');
    await expect.element(collapseBtn).toBeVisible();

    await collapseBtn.click();

    // Collapsed state shows "Expand sidebar" label
    const expandBtn = screen.getByLabelText('Expand sidebar');
    await expect.element(expandBtn).toBeVisible();
  });
});
