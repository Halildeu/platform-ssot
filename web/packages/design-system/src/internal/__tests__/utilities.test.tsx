// @vitest-environment jsdom
import React, { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, act, renderHook, waitFor } from '@testing-library/react';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

/* ---- Imports under test ---- */
import { PortalProvider, usePortalConfig } from '../overlay-engine/PortalProvider';
import { Portal, usePortal as usePortalBasic } from '../overlay-engine/portal';
import { usePortal } from '../overlay-engine/usePortal';
import { AriaLiveRegion, announce, useAnnounce } from '../overlay-engine/aria-live';
import { FocusTrap, useFocusTrap } from '../overlay-engine/focus-trap';
import { useRovingTabindex } from '../overlay-engine/roving-tabindex';
import { MenuSurface, type MenuSurfaceItemBase } from '../MenuSurface';
import { OverlaySurface } from '../OverlaySurface';

afterEach(() => {
  cleanup();
});

/* ================================================================== */
/*  PortalProvider                                                     */
/* ================================================================== */

describe('PortalProvider', () => {
  it('renders children', () => {
    render(
      <PortalProvider>
        <span data-testid="child">Hello</span>
      </PortalProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides portal config via usePortalConfig', () => {
    const container = document.createElement('div');
    let config: ReturnType<typeof usePortalConfig> | undefined;

    function Consumer() {
      config = usePortalConfig();
      return null;
    }

    render(
      <PortalProvider container={container} enabled={false}>
        <Consumer />
      </PortalProvider>,
    );

    expect(config).toEqual({ container, enabled: false });
  });

  it('defaults to empty config when no provider', () => {
    let config: ReturnType<typeof usePortalConfig> | undefined;

    function Consumer() {
      config = usePortalConfig();
      return null;
    }

    render(<Consumer />);
    expect(config).toEqual({});
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <PortalProvider>
        <div>Content</div>
      </PortalProvider>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  Portal (portal.tsx)                                                */
/* ================================================================== */

describe('Portal (component)', () => {
  it('renders children into a portal container', async () => {
    render(
      <Portal>
        <span data-testid="portal-child">Portalled</span>
      </Portal>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('portal-child')).toBeInTheDocument();
    });
  });

  it('creates a div with data-overlay-portal attribute', async () => {
    render(
      <Portal>
        <span>Content</span>
      </Portal>,
    );
    await waitFor(() => {
      const portalDiv = document.querySelector('[data-overlay-portal]');
      expect(portalDiv).toBeInTheDocument();
    });
  });

  it('cleans up portal container on unmount', async () => {
    const { unmount } = render(
      <Portal>
        <span>Content</span>
      </Portal>,
    );
    await waitFor(() => {
      expect(document.querySelector('[data-overlay-portal]')).toBeInTheDocument();
    });
    unmount();
    expect(document.querySelector('[data-overlay-portal]')).not.toBeInTheDocument();
  });

  it('renders into a custom container', async () => {
    const customContainer = document.createElement('div');
    customContainer.setAttribute('data-testid', 'custom-container');
    document.body.appendChild(customContainer);

    render(
      <Portal container={customContainer}>
        <span data-testid="custom-child">Custom</span>
      </Portal>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(customContainer.querySelector('[data-overlay-portal]')).not.toBeNull();
    });

    document.body.removeChild(customContainer);
  });
});

/* ================================================================== */
/*  usePortal (usePortal.tsx — standardized version)                   */
/* ================================================================== */

describe('usePortal (standardized)', () => {
  it('returns a Portal component and portalElement ref', () => {
    let portalResult: ReturnType<typeof usePortal> | undefined;

    function TestComponent() {
      portalResult = usePortal();
      const { Portal: P } = portalResult;
      return (
        <P>
          <span data-testid="usePortal-child">Hello</span>
        </P>
      );
    }

    render(<TestComponent />);
    expect(portalResult).toBeDefined();
    expect(portalResult!.portalElement).toBeDefined();
  });

  it('creates a portal element with data-portal attribute', async () => {
    function TestComponent() {
      const { Portal: P } = usePortal();
      return (
        <P>
          <span>Content</span>
        </P>
      );
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(document.querySelector('[data-portal="true"]')).toBeInTheDocument();
    });
  });

  it('renders inline when enabled=false', () => {
    function TestComponent() {
      const { Portal: P } = usePortal({ enabled: false });
      return (
        <div data-testid="parent">
          <P>
            <span data-testid="inline-child">Inline</span>
          </P>
        </div>
      );
    }

    const { container } = render(<TestComponent />);
    const parent = screen.getByTestId('parent');
    expect(parent.querySelector('[data-testid="inline-child"]')).toBeInTheDocument();
  });

  it('sets custom id on portal element', async () => {
    function TestComponent() {
      const { Portal: P } = usePortal({ id: 'my-portal' });
      return (
        <P>
          <span>Content</span>
        </P>
      );
    }

    render(<TestComponent />);
    await waitFor(() => {
      expect(document.getElementById('my-portal')).toBeInTheDocument();
    });
  });

  it('multiple portals do not conflict', async () => {
    function TestComponent() {
      const p1 = usePortal({ id: 'portal-a' });
      const p2 = usePortal({ id: 'portal-b' });
      // Force re-render after portal refs are set in effects
      const [, setTick] = React.useState(0);
      React.useEffect(() => {
        setTick(1);
      }, []);
      return (
        <>
          <p1.Portal>
            <span data-testid="a">A</span>
          </p1.Portal>
          <p2.Portal>
            <span data-testid="b">B</span>
          </p2.Portal>
        </>
      );
    }

    render(<TestComponent />);
    await waitFor(() => {
      const portalA = document.getElementById('portal-a');
      const portalB = document.getElementById('portal-b');
      expect(portalA).toBeInTheDocument();
      expect(portalB).toBeInTheDocument();
      expect(portalA).not.toBe(portalB);
    });
  });
});

/* ================================================================== */
/*  AriaLiveRegion + announce                                          */
/* ================================================================== */

describe('AriaLiveRegion', () => {
  it('renders polite and assertive live regions', () => {
    const { container } = render(<AriaLiveRegion />);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    expect(container.querySelector('[aria-live="assertive"]')).toBeInTheDocument();
  });

  it('announces a polite message', async () => {
    const { container } = render(<AriaLiveRegion />);

    act(() => {
      announce('Item selected');
    });

    await waitFor(() => {
      const politeRegion = container.querySelector('[aria-live="polite"]');
      expect(politeRegion).toHaveTextContent('Item selected');
    });
  });

  it('announces an assertive message', async () => {
    const { container } = render(<AriaLiveRegion />);

    act(() => {
      announce('Error occurred', 'assertive');
    });

    await waitFor(() => {
      const assertiveRegion = container.querySelector('[aria-live="assertive"]');
      expect(assertiveRegion).toHaveTextContent('Error occurred');
    });
  });

  it('useAnnounce hook returns a callable function', () => {
    let announceFn: ReturnType<typeof useAnnounce> | undefined;

    function Consumer() {
      announceFn = useAnnounce();
      return null;
    }

    render(
      <>
        <AriaLiveRegion />
        <Consumer />
      </>,
    );

    expect(typeof announceFn).toBe('function');
  });

  it('has no a11y violations', async () => {
    const { container } = render(<AriaLiveRegion />);
    await expectNoA11yViolations(container);
  });

  it('does nothing when no AriaLiveRegion is mounted', () => {
    // Should not throw
    expect(() => announce('orphan message')).not.toThrow();
  });
});

/* ================================================================== */
/*  FocusTrap                                                          */
/* ================================================================== */

describe('FocusTrap', () => {
  it('renders children within a container div', () => {
    render(
      <FocusTrap active={false}>
        <button type="button">Button A</button>
        <button type="button">Button B</button>
      </FocusTrap>,
    );
    expect(screen.getByText('Button A')).toBeInTheDocument();
    expect(screen.getByText('Button B')).toBeInTheDocument();
  });

  it('sets data-focus-trap attribute when active', () => {
    const { container } = render(
      <FocusTrap active={true}>
        <button type="button">Btn</button>
      </FocusTrap>,
    );
    expect(container.querySelector('[data-focus-trap]')).toBeInTheDocument();
  });

  it('does not set data-focus-trap when inactive', () => {
    const { container } = render(
      <FocusTrap active={false}>
        <button type="button">Btn</button>
      </FocusTrap>,
    );
    expect(container.querySelector('[data-focus-trap]')).not.toBeInTheDocument();
  });

  it('Tab is prevented when trap is active (traps focus)', () => {
    render(
      <FocusTrap active={true} autoFocus={false}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </FocusTrap>,
    );

    // In jsdom, offsetParent is null so getFocusableElements returns empty.
    // The focus trap handler still calls preventDefault on Tab to trap focus.
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    act(() => { document.dispatchEvent(event); });

    expect(event.defaultPrevented).toBe(true);
  });

  it('Tab is NOT prevented when trap is inactive', () => {
    render(
      <FocusTrap active={false} autoFocus={false}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </FocusTrap>,
    );

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    act(() => { document.dispatchEvent(event); });

    expect(event.defaultPrevented).toBe(false);
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <FocusTrap active={true} autoFocus={false}>
        <button type="button">Action</button>
      </FocusTrap>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  useRovingTabindex                                                  */
/* ================================================================== */

describe('useRovingTabindex', () => {
  function TabList({ itemCount = 3, direction = 'horizontal' as const }) {
    const roving = useRovingTabindex({ itemCount, direction });
    return (
      <div role="tablist">
        {Array.from({ length: itemCount }, (_, i) => (
          <button key={i} role="tab" {...roving.getItemProps(i)}>
            Tab {i}
          </button>
        ))}
      </div>
    );
  }

  it('first item has tabIndex=0, others have tabIndex=-1', () => {
    render(<TabList />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight moves active index forward', () => {
    render(<TabList />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
  });

  it('ArrowLeft moves active index backward', () => {
    render(<TabList />);
    const tabs = screen.getAllByRole('tab');
    // Move to index 1 first
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    fireEvent.keyDown(tabs[1], { key: 'ArrowLeft' });
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
  });

  it('wraps around from last to first', () => {
    render(<TabList />);
    const tabs = screen.getAllByRole('tab');
    // Move to last
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    // Now at index 2, move right should wrap to 0
    fireEvent.keyDown(tabs[2], { key: 'ArrowRight' });
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
  });

  it('Home key moves to first item', () => {
    render(<TabList />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
    fireEvent.keyDown(tabs[2], { key: 'Home' });
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
  });

  it('End key moves to last item', () => {
    render(<TabList />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0], { key: 'End' });
    expect(tabs[2]).toHaveAttribute('tabindex', '0');
  });

  it('vertical direction uses ArrowDown/ArrowUp', () => {
    render(<TabList direction="vertical" />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0], { key: 'ArrowDown' });
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(tabs[1], { key: 'ArrowUp' });
    expect(tabs[0]).toHaveAttribute('tabindex', '0');
  });

  it('skips disabled indices', () => {
    function DisabledTabList() {
      const roving = useRovingTabindex({
        itemCount: 3,
        direction: 'horizontal',
        disabledIndices: new Set([1]),
      });
      return (
        <div role="tablist">
          {[0, 1, 2].map((i) => (
            <button key={i} role="tab" {...roving.getItemProps(i)}>
              Tab {i}
            </button>
          ))}
        </div>
      );
    }

    render(<DisabledTabList />);
    const tabs = screen.getAllByRole('tab');
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    // Should skip index 1 and go to index 2
    expect(tabs[2]).toHaveAttribute('tabindex', '0');
  });
});

/* ================================================================== */
/*  MenuSurface                                                        */
/* ================================================================== */

describe('MenuSurface', () => {
  const items: MenuSurfaceItemBase[] = [
    { key: 'cut', label: 'Cut' },
    { key: 'copy', label: 'Copy' },
    { key: 'paste', label: 'Paste' },
  ];

  function renderMenuSurface(props: Partial<React.ComponentProps<typeof MenuSurface>> = {}) {
    const ownerRef = { current: document.createElement('button') };
    const anchorRef = { current: document.createElement('button') };
    document.body.appendChild(ownerRef.current);
    document.body.appendChild(anchorRef.current);

    const result = render(
      <MenuSurface
        open={true}
        items={items}
        ownerRef={ownerRef}
        anchorRef={anchorRef}
        ariaLabel="Test menu"
        disablePortal
        {...props}
      />,
    );

    return { ...result, ownerRef, anchorRef };
  }

  it('renders menu with role="menu"', () => {
    renderMenuSurface();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    renderMenuSurface();
    expect(screen.getByText('Cut')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Paste')).toBeInTheDocument();
  });

  it('does not render when open=false', () => {
    renderMenuSurface({ open: false });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('ArrowDown moves focus to next item', async () => {
    renderMenuSurface({ preferredFocusIndex: 0 });
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowDown' });

    await waitFor(() => {
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems[1]).toHaveFocus();
    });
  });

  it('ArrowUp moves focus to previous item', async () => {
    renderMenuSurface({ preferredFocusIndex: 1 });
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'ArrowUp' });

    await waitFor(() => {
      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems[0]).toHaveFocus();
    });
  });

  it('Enter key triggers onSelect for focused item', async () => {
    const onSelect = vi.fn();
    renderMenuSurface({ onSelect, preferredFocusIndex: 0 });
    const menu = screen.getByRole('menu');

    fireEvent.keyDown(menu, { key: 'Enter' });

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled();
    });
  });

  it('Escape key triggers onRequestClose', () => {
    const onRequestClose = vi.fn();
    renderMenuSurface({ onRequestClose });

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onRequestClose).toHaveBeenCalledWith('escape', { restoreFocus: true });
  });

  it('renders with aria-label', () => {
    renderMenuSurface();
    expect(screen.getByRole('menu')).toHaveAttribute('aria-label', 'Test menu');
  });

  it('disabled items cannot be selected', async () => {
    const onSelect = vi.fn();
    const disabledItems: MenuSurfaceItemBase[] = [
      { key: 'action', label: 'Action', disabled: true },
    ];
    renderMenuSurface({ items: disabledItems, onSelect, preferredFocusIndex: 0 });

    const menuItems = screen.getAllByRole('menuitem');
    fireEvent.click(menuItems[0]);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = renderMenuSurface();
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  OverlaySurface                                                     */
/* ================================================================== */

describe('OverlaySurface', () => {
  it('renders children when open', () => {
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test overlay">
        <span data-testid="overlay-content">Overlay</span>
      </OverlaySurface>,
    );
    expect(screen.getByTestId('overlay-content')).toBeInTheDocument();
  });

  it('does not render when closed and not keepMounted', async () => {
    render(
      <OverlaySurface open={false} disablePortal ariaLabel="Test overlay">
        <span data-testid="overlay-content">Overlay</span>
      </OverlaySurface>,
    );
    // After unmount delay
    await waitFor(() => {
      expect(screen.queryByTestId('overlay-content')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('renders dialog role with aria-modal', () => {
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test overlay">
        <span>Content</span>
      </OverlaySurface>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Test overlay');
  });

  it('Escape key calls onClose with "escape" reason', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test overlay" onClose={onClose}>
        <span>Content</span>
      </OverlaySurface>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith('escape');
  });

  it('backdrop click calls onClose with "overlay" reason', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test overlay" onClose={onClose}>
        <span>Content</span>
      </OverlaySurface>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledWith('overlay');
  });

  it('does not close on backdrop click when closeOnOverlayClick=false', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface
        open={true}
        disablePortal
        ariaLabel="Test overlay"
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <span>Content</span>
      </OverlaySurface>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not close on Escape when closeOnEscape=false', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface
        open={true}
        disablePortal
        ariaLabel="Test overlay"
        onClose={onClose}
        closeOnEscape={false}
      >
        <span>Content</span>
      </OverlaySurface>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test overlay">
        <button type="button">Close</button>
      </OverlaySurface>,
    );
    await expectNoA11yViolations(container);
  });

  it('keeps mounted when keepMounted=true', async () => {
    const { rerender } = render(
      <OverlaySurface open={true} disablePortal keepMounted ariaLabel="Test overlay">
        <span data-testid="keep-content">Content</span>
      </OverlaySurface>,
    );

    rerender(
      <OverlaySurface open={false} disablePortal keepMounted ariaLabel="Test overlay">
        <span data-testid="keep-content">Content</span>
      </OverlaySurface>,
    );

    // Should still be in the document since keepMounted=true
    await waitFor(() => {
      expect(screen.getByTestId('keep-content')).toBeInTheDocument();
    });
  });
});
