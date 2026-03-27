// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppSidebar } from '../AppSidebar';
import { useSidebar } from '../useSidebar';

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

/** Toggle button that exposes sidebar state for assertions. */
function ToggleButton() {
  const { toggle, isCollapsed } = useSidebar();
  return (
    <button data-testid="toggle" onClick={toggle}>
      {isCollapsed ? 'collapsed' : 'expanded'}
    </button>
  );
}

const HomeIcon = () => <span data-testid="home-icon">H</span>;
const SettingsIcon = () => <span data-testid="settings-icon">S</span>;
const UsersIcon = () => <span data-testid="users-icon">U</span>;

/* ================================================================== */
/*  1. Render (4 tests)                                                */
/* ================================================================== */

describe('AppSidebar — render', () => {
  it('renders with default expanded mode', () => {
    render(
      <AppSidebar>
        <ToggleButton />
      </AppSidebar>,
    );
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'expanded');
    expect(screen.getByTestId('toggle')).toHaveTextContent('expanded');
  });

  it('renders with collapsed mode', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <ToggleButton />
      </AppSidebar>,
    );
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'collapsed');
    expect(screen.getByTestId('toggle')).toHaveTextContent('collapsed');
  });

  it('renders header, nav, footer slots', () => {
    render(
      <AppSidebar>
        <AppSidebar.Header title="My App" />
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
        <AppSidebar.Footer>
          <span data-testid="footer">v1.0</span>
        </AppSidebar.Footer>
      </AppSidebar>,
    );

    expect(screen.getByText('My App')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <AppSidebar className="my-custom-sidebar">
        <span>content</span>
      </AppSidebar>,
    );

    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar.className).toContain('my-custom-sidebar');
  });
});

/* ================================================================== */
/*  2. Collapse / Expand (4 tests)                                     */
/* ================================================================== */

describe('AppSidebar — collapse/expand', () => {
  it('toggle switches between expanded and collapsed', async () => {
    const user = userEvent.setup();
    render(
      <AppSidebar>
        <ToggleButton />
      </AppSidebar>,
    );

    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar).toHaveAttribute('data-state', 'expanded');

    await user.click(screen.getByTestId('toggle'));
    expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    await user.click(screen.getByTestId('toggle'));
    expect(sidebar).toHaveAttribute('data-state', 'expanded');
  });

  it('Trigger button toggles sidebar', async () => {
    const user = userEvent.setup();
    render(
      <AppSidebar>
        <AppSidebar.Header action={<AppSidebar.Trigger />} />
        <ToggleButton />
      </AppSidebar>,
    );

    const triggerBtn = screen.getByLabelText('Collapse sidebar');
    await user.click(triggerBtn);
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'collapsed');

    const expandBtn = screen.getByLabelText('Expand sidebar');
    await user.click(expandBtn);
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'expanded');
  });

  it('collapsed mode shows narrow width', () => {
    render(
      <AppSidebar defaultMode="collapsed" collapsedWidth={48}>
        <span>content</span>
      </AppSidebar>,
    );

    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar.style.width).toBe('48px');
  });

  it('expanded mode shows full width', () => {
    render(
      <AppSidebar expandedWidth={300}>
        <span>content</span>
      </AppSidebar>,
    );

    const sidebar = screen.getByLabelText('Sidebar');
    expect(sidebar.style.width).toBe('300px');
  });
});

/* ================================================================== */
/*  3. Persistence (3 tests)                                           */
/* ================================================================== */

describe('AppSidebar — persistence', () => {
  it('saves mode to localStorage', async () => {
    const user = userEvent.setup();
    const key = 'test-sidebar-save';

    render(
      <AppSidebar storageKey={key}>
        <ToggleButton />
      </AppSidebar>,
    );

    await user.click(screen.getByTestId('toggle'));
    expect(localStorage.getItem(key)).toBe('collapsed');
  });

  it('restores mode from localStorage', () => {
    const key = 'test-sidebar-restore';
    localStorage.setItem(key, 'collapsed');

    render(
      <AppSidebar storageKey={key}>
        <ToggleButton />
      </AppSidebar>,
    );

    expect(screen.getByTestId('toggle')).toHaveTextContent('collapsed');
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'collapsed');
  });

  it('uses custom storageKey', async () => {
    const user = userEvent.setup();
    const customKey = 'my-app-sidebar-state';

    render(
      <AppSidebar storageKey={customKey}>
        <ToggleButton />
      </AppSidebar>,
    );

    await user.click(screen.getByTestId('toggle'));
    expect(localStorage.getItem(customKey)).toBe('collapsed');

    // Default key should not be set
    expect(localStorage.getItem('sidebar-state')).toBeNull();
  });
});

/* ================================================================== */
/*  4. Search (3 tests)                                                */
/* ================================================================== */

describe('AppSidebar.Search', () => {
  it('search input renders with placeholder', () => {
    render(
      <AppSidebar>
        <AppSidebar.Search placeholder="Find items..." />
      </AppSidebar>,
    );

    expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
  });

  it('search fires onChange callback on input', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <AppSidebar>
        <AppSidebar.Search placeholder="Search..." onChange={onChange} />
      </AppSidebar>,
    );

    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'hello');
    expect(onChange).toHaveBeenCalledTimes(5);
    expect(onChange).toHaveBeenLastCalledWith('hello');
  });

  it('Cmd+K shortcut hint renders', () => {
    render(
      <AppSidebar>
        <AppSidebar.Search shortcut="⌘K" />
      </AppSidebar>,
    );

    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  5. Navigation Items (4 tests)                                      */
/* ================================================================== */

describe('AppSidebar.NavItem', () => {
  it('NavItem renders icon and label', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('active NavItem has aria-current="page"', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" href="/" active />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const link = screen.getByRole('link', { name: /Home/ });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('disabled NavItem has aria-disabled', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" disabled />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const button = screen.getByRole('button', { name: /Settings/ });
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('badge renders on NavItem', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem
            icon={<HomeIcon />}
            label="Notifications"
            badge={<span data-testid="badge">5</span>}
          />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByTestId('badge')).toBeInTheDocument();
    expect(screen.getByTestId('badge')).toHaveTextContent('5');
  });
});

/* ================================================================== */
/*  6. Groups (3 tests)                                                */
/* ================================================================== */

describe('AppSidebar.Group', () => {
  it('Group renders with title', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Main Navigation" icon={<HomeIcon />}>
            <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByText('Main Navigation')).toBeInTheDocument();
  });

  it('Group collapses on header click', async () => {
    const user = userEvent.setup();
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Group label="Resources" collapsible defaultOpen>
            <AppSidebar.NavItem icon={<HomeIcon />} label="Docs" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByText('Docs')).toBeInTheDocument();

    const headerButton = screen.getByRole('button', { name: /Resources/ });
    await user.click(headerButton);

    // After collapsing, the content should be hidden (max-h-0 + opacity-0)
    expect(headerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('Group title hidden when sidebar collapsed', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Nav>
          <AppSidebar.Group label="Hidden Group" icon={<HomeIcon />}>
            <AppSidebar.NavItem icon={<HomeIcon />} label="Item" />
          </AppSidebar.Group>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    // In collapsed mode, group renders icon only, not the label text in a button
    const group = screen.getByRole('group', { name: 'Hidden Group' });
    expect(group).toBeInTheDocument();
    // The button with label text should not exist
    expect(screen.queryByRole('button', { name: /Hidden Group/ })).not.toBeInTheDocument();
  });
});

/* ================================================================== */
/*  7. Sections (2 tests)                                              */
/* ================================================================== */

describe('AppSidebar.Section', () => {
  it('Section renders with title and children', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Section title="General">
            <AppSidebar.NavItem icon={<HomeIcon />} label="Overview" />
          </AppSidebar.Section>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });

  it('collapsible Section toggles with aria-expanded', async () => {
    const user = userEvent.setup();
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.Section title="Collapsible" collapsible defaultOpen>
            <AppSidebar.NavItem icon={<HomeIcon />} label="Child" />
          </AppSidebar.Section>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    const headerBtn = screen.getByRole('button', { name: /Collapsible/ });
    expect(headerBtn).toHaveAttribute('aria-expanded', 'true');

    await user.click(headerBtn);
    expect(headerBtn).toHaveAttribute('aria-expanded', 'false');
  });
});

/* ================================================================== */
/*  8. Nested Items (2 tests)                                          */
/* ================================================================== */

describe('AppSidebar — nested items', () => {
  it('nested NavItem renders with indent', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Parent">
            <AppSidebar.NavItem label="Child" />
          </AppSidebar.NavItem>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByText('Parent')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();

    // Child should have depth=1 which results in 'pl-8' class
    const childButton = screen.getByRole('button', { name: /Child/ });
    expect(childButton.className).toContain('pl-8');
  });

  it('3-level nesting works', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Level 0">
            <AppSidebar.NavItem label="Level 1">
              <AppSidebar.NavItem label="Level 2" />
            </AppSidebar.NavItem>
          </AppSidebar.NavItem>
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByText('Level 0')).toBeInTheDocument();
    expect(screen.getByText('Level 1')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();

    // Level 2 should have pl-12 (depth=2)
    const level2Button = screen.getByRole('button', { name: /Level 2/ });
    expect(level2Button.className).toContain('pl-12');
  });
});

/* ================================================================== */
/*  9. Keyboard (2 tests)                                              */
/* ================================================================== */

describe('AppSidebar — keyboard', () => {
  it('Escape key collapses the sidebar', () => {
    render(
      <AppSidebar>
        <ToggleButton />
      </AppSidebar>,
    );

    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'expanded');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'collapsed');
  });

  it('Escape key does nothing when already collapsed', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <ToggleButton />
      </AppSidebar>,
    );

    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'collapsed');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getByLabelText('Sidebar')).toHaveAttribute('data-state', 'collapsed');
  });
});

/* ================================================================== */
/*  10. Resize (1 test)                                                */
/* ================================================================== */

describe('AppSidebar — resize', () => {
  it('Resizer handle renders when resizable', () => {
    render(
      <AppSidebar resizable>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
        <AppSidebar.Resizer />
      </AppSidebar>,
    );

    const resizer = screen.getByRole('separator', { name: /Resize sidebar/ });
    expect(resizer).toBeInTheDocument();
    expect(resizer).toHaveAttribute('aria-orientation', 'vertical');
  });
});

/* ================================================================== */
/*  11. Tooltip (1 test)                                               */
/* ================================================================== */

describe('AppSidebar — tooltip', () => {
  it('shows tooltip when sidebar is collapsed', () => {
    render(
      <AppSidebar defaultMode="collapsed">
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Dashboard" tooltip="Go to Dashboard" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByRole('tooltip')).toHaveTextContent('Go to Dashboard');
  });
});

/* ================================================================== */
/*  12. Footer (1 test)                                                */
/* ================================================================== */

describe('AppSidebar.Footer', () => {
  it('renders footer content', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
        </AppSidebar.Nav>
        <AppSidebar.Footer>
          <span data-testid="footer-content">v2.0.0</span>
        </AppSidebar.Footer>
      </AppSidebar>,
    );

    expect(screen.getByTestId('footer-content')).toHaveTextContent('v2.0.0');
  });
});

/* ================================================================== */
/*  13. Separator (1 test)                                             */
/* ================================================================== */

describe('AppSidebar.Separator', () => {
  it('renders separator between sections', () => {
    render(
      <AppSidebar>
        <AppSidebar.Nav>
          <AppSidebar.NavItem icon={<HomeIcon />} label="Home" />
          <AppSidebar.Separator />
          <AppSidebar.NavItem icon={<SettingsIcon />} label="Settings" />
        </AppSidebar.Nav>
      </AppSidebar>,
    );

    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  14. Header (1 test)                                                */
/* ================================================================== */

describe('AppSidebar.Header', () => {
  it('renders title, subtitle and logo', () => {
    render(
      <AppSidebar>
        <AppSidebar.Header
          title="Design Lab"
          subtitle="Component Library"
          logo={<span data-testid="logo">DL</span>}
        />
      </AppSidebar>,
    );

    expect(screen.getByText('Design Lab')).toBeInTheDocument();
    expect(screen.getByText('Component Library')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });
});
