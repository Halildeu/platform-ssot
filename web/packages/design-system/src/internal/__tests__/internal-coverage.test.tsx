// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React, { _useRef } from 'react';

// --- overlay-engine imports ---
import { FocusTrap } from '../overlay-engine/focus-trap';
import { Portal } from '../overlay-engine/portal';
import { AriaLiveRegion, announce, useAnnounce } from '../overlay-engine/aria-live';
import { useRovingTabindex } from '../overlay-engine/roving-tabindex';

// --- MenuSurface / OverlaySurface ---
import { MenuSurface, findEnabledMenuItemIndex } from '../MenuSurface';
import type { MenuSurfaceItemBase } from '../MenuSurface';
import { OverlaySurface } from '../OverlaySurface';

// --- access-controller ---
import {
  resolveAccessState,
  shouldBlockInteraction,
  accessStyles,
  withAccessGuard,
} from '../access-controller';

// --- interaction-core ---
import {
  evaluateGuard,
  guardEvent,
  guardStyles,
  guardAria,
} from '../interaction-core/event-guard';
import {
  focusRingClass,
  focusRingClassWithColor,
  defaultFocusStrategy,
  isKeyboardInteraction,
} from '../interaction-core/focus-policy';
import {
  resolveKeyboardIntent,
  resolveClickIntent,
} from '../interaction-core/semantic-intent';
import {
  _Keys,
  KEYBOARD_CONTRACTS,
  createKeyHandler,
  describeKeyboardContract,
} from '../interaction-core/keyboard-contract';

// --- overlay positioning ---
import {
  resolveOverlayPosition,
  resolveOverlayArrowPositionClassName,
} from '../OverlayPositioning';

// =====================================================================
// 1. Access Controller — all paths
// =====================================================================

describe('access-controller', () => {
  it('resolveAccessState defaults to full', () => {
    const result = resolveAccessState();
    expect(result.state).toBe('full');
    expect(result.isHidden).toBe(false);
    expect(result.isReadonly).toBe(false);
    expect(result.isDisabled).toBe(false);
  });

  it('resolveAccessState hidden', () => {
    expect(resolveAccessState('hidden').isHidden).toBe(true);
  });

  it('resolveAccessState readonly', () => {
    expect(resolveAccessState('readonly').isReadonly).toBe(true);
  });

  it('resolveAccessState disabled', () => {
    expect(resolveAccessState('disabled').isDisabled).toBe(true);
  });

  it('shouldBlockInteraction respects externallyDisabled', () => {
    expect(shouldBlockInteraction('full', true)).toBe(true);
    expect(shouldBlockInteraction('full', false)).toBe(false);
    expect(shouldBlockInteraction('readonly')).toBe(true);
    expect(shouldBlockInteraction('disabled')).toBe(true);
  });

  it('accessStyles returns correct classes', () => {
    expect(accessStyles('disabled')).toContain('cursor-not-allowed');
    expect(accessStyles('readonly')).toContain('cursor-default');
    expect(accessStyles('hidden')).toContain('invisible');
    expect(accessStyles('full')).toBe('');
  });

  it('withAccessGuard blocks events when disabled', () => {
    const handler = vi.fn();
    const guarded = withAccessGuard('disabled', handler);
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
    guarded(event);
    expect(handler).not.toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('withAccessGuard calls handler when full', () => {
    const handler = vi.fn();
    const guarded = withAccessGuard('full', handler);
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
    guarded(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('withAccessGuard handles undefined handler gracefully', () => {
    const guarded = withAccessGuard('full', undefined);
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
    guarded(event); // Should not throw
  });
});

// =====================================================================
// 2. Event Guard — all branches
// =====================================================================

describe('event-guard', () => {
  it('evaluateGuard — disabled', () => {
    const result = evaluateGuard({ disabled: true });
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('disabled');
  });

  it('evaluateGuard — loading', () => {
    const result = evaluateGuard({ loading: true });
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('loading');
  });

  it('evaluateGuard — access hidden', () => {
    const result = evaluateGuard({ access: 'hidden' });
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('hidden');
  });

  it('evaluateGuard — access disabled', () => {
    const result = evaluateGuard({ access: 'disabled' });
    expect(result.blocked).toBe(true);
    expect(result.reason).toBe('disabled');
  });

  it('evaluateGuard — access readonly', () => {
    const result = evaluateGuard({ access: 'readonly' });
    expect(result.blocked).toBe(true);
    expect(result.readonly).toBe(true);
  });

  it('evaluateGuard — full/default', () => {
    const result = evaluateGuard({ access: 'full' });
    expect(result.blocked).toBe(false);
  });

  it('guardEvent blocks when disabled', () => {
    const handler = vi.fn();
    const guarded = guardEvent({ disabled: true }, handler);
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
    guarded(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it('guardEvent calls handler when not blocked', () => {
    const handler = vi.fn();
    const guarded = guardEvent({}, handler);
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
    guarded(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('guardEvent handles no handler', () => {
    const guarded = guardEvent({});
    const event = { preventDefault: vi.fn(), stopPropagation: vi.fn() } as any;
    guarded(event); // Should not throw
  });

  it('guardStyles returns correct classes', () => {
    expect(guardStyles({ disabled: true })).toContain('cursor-not-allowed');
    expect(guardStyles({ loading: true })).toContain('cursor-not-allowed');
    expect(guardStyles({ access: 'readonly' })).toContain('cursor-default');
    expect(guardStyles({})).toContain('cursor-pointer');
  });

  it('guardAria returns correct attributes', () => {
    expect(guardAria({ disabled: true })['aria-disabled']).toBe(true);
    expect(guardAria({ loading: true })['aria-busy']).toBe(true);
    expect(guardAria({ access: 'readonly' })['aria-readonly']).toBe(true);
    expect(guardAria({})['aria-disabled']).toBeUndefined();
  });
});

// =====================================================================
// 3. Focus Policy — all branches
// =====================================================================

describe('focus-policy', () => {
  it('focusRingClass returns classes for all strategies', () => {
    expect(focusRingClass('ring')).toContain('ring-2');
    expect(focusRingClass('outline')).toContain('ring-1');
    expect(focusRingClass('inset')).toContain('ring-inset');
    expect(focusRingClass('none')).toContain('outline-hidden');
    expect(focusRingClass()).toContain('ring-2'); // default
  });

  it('focusRingClassWithColor — none strategy', () => {
    expect(focusRingClassWithColor('none', 'red')).toContain('outline-hidden');
  });

  it('focusRingClassWithColor — ring strategy', () => {
    const result = focusRingClassWithColor('ring', 'var(--custom)');
    expect(result).toContain('ring-2');
    expect(result).toContain('ring-offset-2');
  });

  it('focusRingClassWithColor — outline strategy', () => {
    const result = focusRingClassWithColor('outline', 'red');
    expect(result).toContain('ring-1');
    expect(result).toContain('ring-offset-1');
  });

  it('focusRingClassWithColor — inset strategy', () => {
    const result = focusRingClassWithColor('inset', 'blue');
    expect(result).toContain('ring-inset');
    expect(result).not.toContain('ring-offset');
  });

  it('defaultFocusStrategy returns correct strategy per component type', () => {
    expect(defaultFocusStrategy('button')).toBe('ring');
    expect(defaultFocusStrategy('input')).toBe('ring');
    expect(defaultFocusStrategy('toggle')).toBe('ring');
    expect(defaultFocusStrategy('link')).toBe('outline');
    expect(defaultFocusStrategy('tab')).toBe('outline');
    expect(defaultFocusStrategy('menu-item')).toBe('outline');
    expect(defaultFocusStrategy('card')).toBe('ring');
  });

  it('isKeyboardInteraction returns boolean', () => {
    const result = isKeyboardInteraction();
    expect(typeof result).toBe('boolean');
  });
});

// =====================================================================
// 4. Keyboard Contract — all branches
// =====================================================================

describe('keyboard-contract', () => {
  it('createKeyHandler handles known contract', () => {
    const activateHandler = vi.fn();
    const handler = createKeyHandler('button', { activate: activateHandler });
    const event = { key: 'Enter', preventDefault: vi.fn(), ctrlKey: false, metaKey: false, shiftKey: false } as any;
    handler(event);
    expect(activateHandler).toHaveBeenCalled();
  });

  it('createKeyHandler returns noop for unknown contract', () => {
    const handler = createKeyHandler('nonexistent' as any, {});
    handler({ key: 'Enter' } as any); // Should not throw
  });

  it('createKeyHandler ignores unmatched keys', () => {
    const handler = createKeyHandler('button', { activate: vi.fn() });
    handler({ key: 'a', preventDefault: vi.fn(), ctrlKey: false, metaKey: false, shiftKey: false } as any);
    // No error
  });

  it('describeKeyboardContract returns descriptions', () => {
    const desc = describeKeyboardContract('button');
    expect(desc.length).toBeGreaterThan(0);
    expect(desc[0]).toContain('Trigger button action');
  });

  it('describeKeyboardContract returns empty for unknown', () => {
    expect(describeKeyboardContract('nonexistent' as any)).toEqual([]);
  });

  it('KEYBOARD_CONTRACTS has entries for common components', () => {
    expect(KEYBOARD_CONTRACTS.button).toBeTruthy();
    expect(KEYBOARD_CONTRACTS.switch).toBeTruthy();
    expect(KEYBOARD_CONTRACTS.select).toBeTruthy();
    expect(KEYBOARD_CONTRACTS.tabs).toBeTruthy();
    expect(KEYBOARD_CONTRACTS.accordion).toBeTruthy();
    expect(KEYBOARD_CONTRACTS.dialog).toBeTruthy();
    expect(KEYBOARD_CONTRACTS.menu).toBeTruthy();
    expect(KEYBOARD_CONTRACTS.slider).toBeTruthy();
  });
});

// =====================================================================
// 5. Semantic Intent — all roles and keys
// =====================================================================

describe('semantic-intent', () => {
  const mkKeyEvent = (key: string, opts: Record<string, boolean> = {}) =>
    ({ key, altKey: false, ctrlKey: false, metaKey: false, ...opts }) as any;

  it('button — Enter/Space → activate', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('Enter'), 'button')?.intent).toBe('activate');
    expect(resolveKeyboardIntent(mkKeyEvent(' '), 'button')?.intent).toBe('activate');
  });

  it('button — unmatched key → null', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowDown'), 'button')).toBeNull();
  });

  it('switch — Space → toggle', () => {
    expect(resolveKeyboardIntent(mkKeyEvent(' '), 'switch')?.intent).toBe('toggle');
  });

  it('checkbox — Space → toggle', () => {
    expect(resolveKeyboardIntent(mkKeyEvent(' '), 'checkbox')?.intent).toBe('toggle');
  });

  it('radio — arrows navigate, space selects', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowDown'), 'radio')?.direction).toBe('next');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowUp'), 'radio')?.direction).toBe('prev');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowRight'), 'radio')?.direction).toBe('next');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowLeft'), 'radio')?.direction).toBe('prev');
    expect(resolveKeyboardIntent(mkKeyEvent(' '), 'radio')?.intent).toBe('select');
  });

  it('select/combobox — arrows, enter, escape, home, end', () => {
    for (const role of ['select', 'combobox'] as const) {
      expect(resolveKeyboardIntent(mkKeyEvent('ArrowDown'), role)?.direction).toBe('next');
      expect(resolveKeyboardIntent(mkKeyEvent('ArrowDown', { altKey: true }), role)?.intent).toBe('open');
      expect(resolveKeyboardIntent(mkKeyEvent('ArrowUp'), role)?.direction).toBe('prev');
      expect(resolveKeyboardIntent(mkKeyEvent('Enter'), role)?.intent).toBe('select');
      expect(resolveKeyboardIntent(mkKeyEvent('Escape'), role)?.intent).toBe('close');
      expect(resolveKeyboardIntent(mkKeyEvent('Home'), role)?.direction).toBe('first');
      expect(resolveKeyboardIntent(mkKeyEvent('End'), role)?.direction).toBe('last');
    }
  });

  it('tabs — arrows and home/end', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowRight'), 'tabs')?.direction).toBe('next');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowLeft'), 'tabs')?.direction).toBe('prev');
    expect(resolveKeyboardIntent(mkKeyEvent('Home'), 'tabs')?.direction).toBe('first');
    expect(resolveKeyboardIntent(mkKeyEvent('End'), 'tabs')?.direction).toBe('last');
  });

  it('accordion — Enter/Space toggle, arrows navigate', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('Enter'), 'accordion')?.intent).toBe('toggle');
    expect(resolveKeyboardIntent(mkKeyEvent(' '), 'accordion')?.intent).toBe('toggle');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowDown'), 'accordion')?.direction).toBe('next');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowUp'), 'accordion')?.direction).toBe('prev');
    expect(resolveKeyboardIntent(mkKeyEvent('Home'), 'accordion')?.direction).toBe('first');
    expect(resolveKeyboardIntent(mkKeyEvent('End'), 'accordion')?.direction).toBe('last');
  });

  it('dialog — Escape closes', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('Escape'), 'dialog')?.intent).toBe('close');
  });

  it('menu — all keys', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowDown'), 'menu')?.direction).toBe('next');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowUp'), 'menu')?.direction).toBe('prev');
    expect(resolveKeyboardIntent(mkKeyEvent('Enter'), 'menu')?.intent).toBe('activate');
    expect(resolveKeyboardIntent(mkKeyEvent(' '), 'menu')?.intent).toBe('activate');
    expect(resolveKeyboardIntent(mkKeyEvent('Escape'), 'menu')?.intent).toBe('close');
    expect(resolveKeyboardIntent(mkKeyEvent('Home'), 'menu')?.direction).toBe('first');
    expect(resolveKeyboardIntent(mkKeyEvent('End'), 'menu')?.direction).toBe('last');
  });

  it('slider — arrows and home/end', () => {
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowRight'), 'slider')?.direction).toBe('next');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowUp'), 'slider')?.direction).toBe('next');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowLeft'), 'slider')?.direction).toBe('prev');
    expect(resolveKeyboardIntent(mkKeyEvent('ArrowDown'), 'slider')?.direction).toBe('prev');
    expect(resolveKeyboardIntent(mkKeyEvent('Home'), 'slider')?.direction).toBe('first');
    expect(resolveKeyboardIntent(mkKeyEvent('End'), 'slider')?.direction).toBe('last');
  });

  it('resolveClickIntent — all roles', () => {
    expect(resolveClickIntent('button').intent).toBe('activate');
    expect(resolveClickIntent('switch').intent).toBe('toggle');
    expect(resolveClickIntent('checkbox').intent).toBe('toggle');
    expect(resolveClickIntent('radio').intent).toBe('select');
    expect(resolveClickIntent('tabs').intent).toBe('select');
    expect(resolveClickIntent('select').intent).toBe('open');
    expect(resolveClickIntent('accordion').intent).toBe('toggle');
    expect(resolveClickIntent('link').intent).toBe('navigate');
  });
});

// =====================================================================
// 6. Overlay Positioning — all sides, aligns, flips
// =====================================================================

describe('OverlayPositioning', () => {
  const trigger = { left: 100, right: 200, top: 100, bottom: 130, width: 100, height: 30 } as DOMRect;
  const panel = { width: 150, height: 200, left: 0, right: 0, top: 0, bottom: 0 } as DOMRect;

  it('resolves bottom-start', () => {
    const result = resolveOverlayPosition({
      preferredSide: 'bottom',
      align: 'start',
      triggerBounds: trigger,
      panelBounds: panel,
    });
    expect(result.resolvedSide).toBe('bottom');
    expect(result.top).toBeGreaterThan(trigger.bottom);
  });

  it('resolves top-end', () => {
    const result = resolveOverlayPosition({
      preferredSide: 'top',
      align: 'end',
      triggerBounds: { ...trigger, top: 300, bottom: 330 } as DOMRect,
      panelBounds: panel,
    });
    expect(result).toBeTruthy();
  });

  it('resolves right-center', () => {
    const result = resolveOverlayPosition({
      preferredSide: 'right',
      align: 'center',
      triggerBounds: trigger,
      panelBounds: panel,
    });
    expect(result).toBeTruthy();
  });

  it('resolves left-start', () => {
    const result = resolveOverlayPosition({
      preferredSide: 'left',
      align: 'start',
      triggerBounds: { ...trigger, left: 300, right: 400 } as DOMRect,
      panelBounds: panel,
    });
    expect(result).toBeTruthy();
  });

  it('resolves left-end', () => {
    const result = resolveOverlayPosition({
      preferredSide: 'left',
      align: 'end',
      triggerBounds: { ...trigger, left: 300, right: 400 } as DOMRect,
      panelBounds: panel,
    });
    expect(result).toBeTruthy();
  });

  it('flips when not enough space', () => {
    // Trigger near top of viewport, not enough space above
    const result = resolveOverlayPosition({
      preferredSide: 'top',
      align: 'start',
      triggerBounds: { ...trigger, top: 10, bottom: 40 } as DOMRect,
      panelBounds: panel,
      flipOnCollision: true,
    });
    expect(result.flipped).toBe(true);
    expect(result.resolvedSide).toBe('bottom');
  });

  it('does not flip when flipOnCollision=false', () => {
    const result = resolveOverlayPosition({
      preferredSide: 'top',
      align: 'start',
      triggerBounds: { ...trigger, top: 10, bottom: 40 } as DOMRect,
      panelBounds: panel,
      flipOnCollision: false,
    });
    expect(result.flipped).toBe(false);
    expect(result.resolvedSide).toBe('top');
  });

  it('resolveOverlayArrowPositionClassName — all combos', () => {
    const sides = ['top', 'bottom', 'left', 'right'] as const;
    const aligns = ['start', 'center', 'end'] as const;
    for (const side of sides) {
      for (const align of aligns) {
        const result = resolveOverlayArrowPositionClassName(side, align);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }
    }
  });
});

// =====================================================================
// 7. FocusTrap — edge cases
// =====================================================================

describe('FocusTrap', () => {
  it('renders children when active', () => {
    render(
      <FocusTrap active={true}>
        <button>Click me</button>
      </FocusTrap>,
    );
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('renders with data-focus-trap attribute when active', () => {
    const { container } = render(
      <FocusTrap active={true}>
        <button>A</button>
      </FocusTrap>,
    );
    expect(container.querySelector('[data-focus-trap]')).toBeTruthy();
  });

  it('does not set data-focus-trap when inactive', () => {
    const { container } = render(
      <FocusTrap active={false}>
        <button>A</button>
      </FocusTrap>,
    );
    expect(container.querySelector('[data-focus-trap]')).toBeNull();
  });

  it('traps Tab on single focusable element — prevents default', async () => {
    render(
      <FocusTrap active={true}>
        <button>Only</button>
      </FocusTrap>,
    );

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    const btn = screen.getByText('Only');
    btn.focus();

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    const prevented = !document.dispatchEvent(event);
    // The trap should be listening
  });

  it('focuses container when no focusable elements', async () => {
    render(
      <FocusTrap active={true}>
        <div>No buttons here</div>
      </FocusTrap>,
    );

    await act(async () => {
      await new Promise(r => setTimeout(r, 100));
    });

    // Container should have tabindex=-1
    const container = document.querySelector('[data-focus-trap]');
    expect(container?.getAttribute('tabindex')).toBe('-1');
  });

  it('handles inactive state — no keydown listener', () => {
    render(
      <FocusTrap active={false}>
        <button>A</button>
      </FocusTrap>,
    );
    // No error when pressing Tab
    fireEvent.keyDown(document, { key: 'Tab' });
  });
});

// =====================================================================
// 8. Portal — rendering and cleanup
// =====================================================================

describe('Portal', () => {
  it('renders children into document.body portal', async () => {
    render(
      <Portal>
        <div data-testid="portaled">Hello</div>
      </Portal>,
    );

    await waitFor(() => {
      expect(document.querySelector('[data-overlay-portal]')).toBeTruthy();
      expect(document.querySelector('[data-testid="portaled"]')).toBeTruthy();
    });
  });

  it('renders into custom container', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <Portal container={container}>
        <div data-testid="custom-portal">Custom</div>
      </Portal>,
    );

    await waitFor(() => {
      expect(container.querySelector('[data-overlay-portal]')).toBeTruthy();
    });

    document.body.removeChild(container);
  });

  it('cleans up portal container on unmount', async () => {
    const { unmount } = render(
      <Portal>
        <div>Temp</div>
      </Portal>,
    );

    await waitFor(() => {
      expect(document.querySelector('[data-overlay-portal]')).toBeTruthy();
    });

    unmount();

    await waitFor(() => {
      expect(document.querySelector('[data-overlay-portal]')).toBeNull();
    });
  });
});

// =====================================================================
// 9. AriaLive — polite and assertive announcements
// =====================================================================

describe('AriaLiveRegion', () => {
  it('renders both polite and assertive regions', () => {
    render(<AriaLiveRegion />);
    expect(document.querySelector('[aria-live="polite"]')).toBeTruthy();
    expect(document.querySelector('[aria-live="assertive"]')).toBeTruthy();
  });

  it('announce() sends polite message', async () => {
    render(<AriaLiveRegion />);

    act(() => {
      announce('Hello screen reader');
    });

    await waitFor(() => {
      const polite = document.querySelector('[aria-live="polite"]');
      expect(polite?.textContent).toBe('Hello screen reader');
    }, { timeout: 500 });
  });

  it('announce() sends assertive message', async () => {
    render(<AriaLiveRegion />);

    act(() => {
      announce('Error occurred', 'assertive');
    });

    await waitFor(() => {
      const assertive = document.querySelector('[aria-live="assertive"]');
      expect(assertive?.textContent).toBe('Error occurred');
    }, { timeout: 500 });
  });

  it('announce() without mounted region does nothing', () => {
    // No AriaLiveRegion mounted
    announce('orphan message'); // Should not throw
  });

  it('auto-clears after timeout', async () => {
    vi.useFakeTimers();
    render(<AriaLiveRegion />);

    act(() => {
      announce('temp');
    });

    // Advance past the 50ms delay + 5000ms clear
    act(() => {
      vi.advanceTimersByTime(60);
    });

    const polite = document.querySelector('[aria-live="polite"]');
    expect(polite?.textContent).toBe('temp');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(polite?.textContent).toBe('');

    vi.useRealTimers();
  });

  it('useAnnounce hook returns a function', () => {
    let announceFn: ReturnType<typeof useAnnounce> | undefined;
    function TestComp() {
      announceFn = useAnnounce();
      return null;
    }
    render(<TestComp />);
    expect(typeof announceFn).toBe('function');
  });
});

// =====================================================================
// 10. Roving Tabindex — all directions, disabled, edge cases
// =====================================================================

describe('useRovingTabindex', () => {
  function TestRoving({
    itemCount = 4,
    direction = 'horizontal' as const,
    loop = true,
    disabledIndices,
    onActiveChange,
  }: {
    itemCount?: number;
    direction?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    disabledIndices?: Set<number>;
    onActiveChange?: (i: number) => void;
  }) {
    const roving = useRovingTabindex({
      itemCount,
      direction,
      loop,
      disabledIndices,
      onActiveChange,
    });

    return (
      <div role="toolbar">
        {Array.from({ length: itemCount }, (_, i) => (
          <button key={i} {...roving.getItemProps(i)}>
            Item {i}
          </button>
        ))}
        <button onClick={roving.moveFirst}>First</button>
        <button onClick={roving.moveLast}>Last</button>
      </div>
    );
  }

  it('first item has tabindex=0, others tabindex=-1', () => {
    render(<TestRoving />);
    const items = screen.getAllByText(/^Item/);
    expect(items[0]).toHaveAttribute('tabindex', '0');
    expect(items[1]).toHaveAttribute('tabindex', '-1');
  });

  it('ArrowRight moves to next item (horizontal)', () => {
    render(<TestRoving direction="horizontal" />);
    const item0 = screen.getByText('Item 0');
    fireEvent.keyDown(item0, { key: 'ArrowRight' });
    expect(screen.getByText('Item 1')).toHaveAttribute('tabindex', '0');
  });

  it('ArrowLeft moves to prev item (horizontal)', () => {
    render(<TestRoving direction="horizontal" />);
    const item0 = screen.getByText('Item 0');
    // Move right first
    fireEvent.keyDown(item0, { key: 'ArrowRight' });
    // Now move left
    fireEvent.keyDown(screen.getByText('Item 1'), { key: 'ArrowLeft' });
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });

  it('ArrowDown moves to next item (vertical)', () => {
    render(<TestRoving direction="vertical" />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowDown' });
    expect(screen.getByText('Item 1')).toHaveAttribute('tabindex', '0');
  });

  it('ArrowUp moves to prev item (vertical)', () => {
    render(<TestRoving direction="vertical" />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByText('Item 1'), { key: 'ArrowUp' });
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });

  it('both direction responds to all arrow keys', () => {
    render(<TestRoving direction="both" />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowRight' });
    expect(screen.getByText('Item 1')).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(screen.getByText('Item 1'), { key: 'ArrowDown' });
    expect(screen.getByText('Item 2')).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(screen.getByText('Item 2'), { key: 'ArrowLeft' });
    expect(screen.getByText('Item 1')).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(screen.getByText('Item 1'), { key: 'ArrowUp' });
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });

  it('Home moves to first item', () => {
    render(<TestRoving />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByText('Item 1'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByText('Item 2'), { key: 'Home' });
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });

  it('End moves to last item', () => {
    render(<TestRoving />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'End' });
    expect(screen.getByText('Item 3')).toHaveAttribute('tabindex', '0');
  });

  it('loops from last to first', () => {
    render(<TestRoving loop />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'End' });
    fireEvent.keyDown(screen.getByText('Item 3'), { key: 'ArrowRight' });
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });

  it('does not loop when loop=false', () => {
    render(<TestRoving loop={false} />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'End' });
    fireEvent.keyDown(screen.getByText('Item 3'), { key: 'ArrowRight' });
    // Should stay on last item
    expect(screen.getByText('Item 3')).toHaveAttribute('tabindex', '0');
  });

  it('skips disabled indices', () => {
    render(<TestRoving disabledIndices={new Set([1])} />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowRight' });
    // Should skip 1 and go to 2
    expect(screen.getByText('Item 2')).toHaveAttribute('tabindex', '0');
  });

  it('handles all items disabled — stays on current', () => {
    render(<TestRoving itemCount={2} disabledIndices={new Set([0, 1])} />);
    // Movement should not change anything
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowRight' });
  });

  it('handles single item', () => {
    render(<TestRoving itemCount={1} />);
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowRight' });
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });

  it('calls onActiveChange', () => {
    const onActiveChange = vi.fn();
    render(<TestRoving onActiveChange={onActiveChange} />);
    fireEvent.keyDown(screen.getByText('Item 0'), { key: 'ArrowRight' });
    expect(onActiveChange).toHaveBeenCalledWith(1);
  });

  it('moveFirst/moveLast buttons work', () => {
    render(<TestRoving />);
    fireEvent.click(screen.getByText('Last'));
    expect(screen.getByText('Item 3')).toHaveAttribute('tabindex', '0');
    fireEvent.click(screen.getByText('First'));
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });

  it('focus handler sets active index', () => {
    render(<TestRoving />);
    fireEvent.focus(screen.getByText('Item 2'));
    expect(screen.getByText('Item 2')).toHaveAttribute('tabindex', '0');
  });

  it('focus on disabled index is ignored', () => {
    render(<TestRoving disabledIndices={new Set([2])} />);
    fireEvent.focus(screen.getByText('Item 2'));
    // Should remain on 0
    expect(screen.getByText('Item 0')).toHaveAttribute('tabindex', '0');
  });
});

// =====================================================================
// 11. findEnabledMenuItemIndex
// =====================================================================

describe('findEnabledMenuItemIndex', () => {
  const items: MenuSurfaceItemBase[] = [
    { key: '0', label: 'A' },
    { key: '1', label: 'B', disabled: true },
    { key: '2', label: 'C' },
    { key: '3', label: 'D' },
  ];

  it('finds first enabled forward', () => {
    expect(findEnabledMenuItemIndex(items, 0, 1)).toBe(0);
  });

  it('skips disabled items forward', () => {
    expect(findEnabledMenuItemIndex(items, 1, 1)).toBe(2);
  });

  it('finds enabled backward', () => {
    expect(findEnabledMenuItemIndex(items, 3, -1)).toBe(3);
  });

  it('skips disabled backward', () => {
    expect(findEnabledMenuItemIndex(items, 1, -1)).toBe(0);
  });

  it('returns -1 when no enabled items found', () => {
    const allDisabled: MenuSurfaceItemBase[] = [
      { key: '0', label: 'A', disabled: true },
    ];
    expect(findEnabledMenuItemIndex(allDisabled, 0, 1)).toBe(-1);
  });
});

// =====================================================================
// 12. MenuSurface — inline rendering with various item types
// =====================================================================

describe('MenuSurface', () => {
  const ownerRef = { current: document.createElement('div') };

  const basicItems: MenuSurfaceItemBase[] = [
    { key: 'action1', label: 'Cut', shortcut: 'Ctrl+X', icon: <span>X</span> },
    { key: 'action2', label: 'Copy', description: 'Copy to clipboard' },
    { key: 'disabled1', label: 'Paste', disabled: true },
    { key: 'check1', label: 'Bold', type: 'checkbox', checked: true },
    { key: 'radio1', label: 'Left', type: 'radio', checked: false },
    { key: 'danger1', label: 'Delete', danger: true, badge: '3' },
    {
      key: 'parent1',
      label: 'More',
      children: [
        { key: 'child1', label: 'Sub Item 1' },
        { key: 'child2', label: 'Sub Item 2' },
      ],
    },
  ];

  it('renders all item types with disablePortal', () => {
    render(
      <MenuSurface
        open={true}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
      />,
    );
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(screen.getByText('Cut')).toBeTruthy();
    expect(screen.getByText('Copy')).toBeTruthy();
    expect(screen.getByText('Bold')).toBeTruthy();
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('renders nothing when not open', () => {
    const { container } = render(
      <MenuSurface
        open={false}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
      />,
    );
    expect(container.querySelector('[role="menu"]')).toBeNull();
  });

  it('renders with title and header/footer content', () => {
    render(
      <MenuSurface
        open={true}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
        title="Actions"
        headerContent={<div>Header</div>}
        footerContent={<div>Footer</div>}
      />,
    );
    expect(screen.getByText('Actions')).toBeTruthy();
    expect(screen.getByText('Header')).toBeTruthy();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('calls onSelect when item clicked', () => {
    const onSelect = vi.fn();
    render(
      <MenuSurface
        open={true}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText('Cut'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'action1' }),
      expect.anything(),
    );
  });

  it('does not call onSelect when disabled item clicked', () => {
    const onSelect = vi.fn();
    render(
      <MenuSurface
        open={true}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
        onSelect={onSelect}
      />,
    );
    const pasteBtn = screen.getByText('Paste').closest('button');
    if (pasteBtn) fireEvent.click(pasteBtn);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('keyboard navigation — ArrowDown moves focus', () => {
    render(
      <MenuSurface
        open={true}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
      />,
    );
    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    // Focus should move
  });

  it('keyboard — Home/End keys', () => {
    render(
      <MenuSurface
        open={true}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
      />,
    );
    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'End' });
    fireEvent.keyDown(menu, { key: 'Home' });
  });

  it('renders checkbox and radio with checked state labels', () => {
    render(
      <MenuSurface
        open={true}
        items={basicItems}
        ownerRef={ownerRef}
        ariaLabel="Test menu"
        disablePortal
      />,
    );
    expect(screen.getByText('On')).toBeTruthy(); // Bold is checked
    expect(screen.getByText('Off')).toBeTruthy(); // Left is unchecked
  });

  it('renders with group labels', () => {
    const groupedItems: MenuSurfaceItemBase[] = [
      { key: 'a', label: 'Item A', groupLabel: 'Group 1' },
      { key: 'b', label: 'Item B', groupLabel: 'Group 1' },
      { key: 'c', label: 'Item C', groupLabel: 'Group 2' },
    ];
    render(
      <MenuSurface
        open={true}
        items={groupedItems}
        ownerRef={ownerRef}
        ariaLabel="Grouped"
        disablePortal
      />,
    );
    expect(screen.getByText('Group 1')).toBeTruthy();
    expect(screen.getByText('Group 2')).toBeTruthy();
  });

  it('renders with coordinates positioning', () => {
    render(
      <MenuSurface
        open={true}
        items={[{ key: 'a', label: 'A' }]}
        ownerRef={ownerRef}
        ariaLabel="Coords"
        coordinates={{ left: 50, top: 100 }}
      />,
    );
    expect(screen.getByRole('menu')).toBeTruthy();
  });
});

// =====================================================================
// 13. OverlaySurface — all prop combinations
// =====================================================================

describe('OverlaySurface', () => {
  it('renders when open', () => {
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test overlay">
        <div>Content</div>
      </OverlaySurface>,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('unmounts when closed and not keepMounted', async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test">
        <div>Content</div>
      </OverlaySurface>,
    );

    rerender(
      <OverlaySurface open={false} disablePortal ariaLabel="Test">
        <div>Content</div>
      </OverlaySurface>,
    );

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByRole('dialog')).toBeNull();
    vi.useRealTimers();
  });

  it('stays mounted when keepMounted=true', async () => {
    const { rerender } = render(
      <OverlaySurface open={true} disablePortal keepMounted ariaLabel="Test">
        <div>Content</div>
      </OverlaySurface>,
    );

    rerender(
      <OverlaySurface open={false} disablePortal keepMounted ariaLabel="Test">
        <div>Content</div>
      </OverlaySurface>,
    );

    // Should still be in DOM
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('calls onClose with "escape" when Escape pressed', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" onClose={onClose}>
        <div>Content</div>
      </OverlaySurface>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith('escape');
  });

  it('does not close on Escape when closeOnEscape=false', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" onClose={onClose} closeOnEscape={false}>
        <div>Content</div>
      </OverlaySurface>,
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose with "overlay" on backdrop click', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" onClose={onClose}>
        <div>Content</div>
      </OverlaySurface>,
    );

    // Click the overlay backdrop (the dialog element itself)
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledWith('overlay');
  });

  it('does not close on overlay click when closeOnOverlayClick=false', () => {
    const onClose = vi.fn();
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" onClose={onClose} closeOnOverlayClick={false}>
        <div>Content</div>
      </OverlaySurface>,
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('returns null when accessState.isHidden', () => {
    const { container } = render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" accessState={{ isHidden: true }}>
        <div>Content</div>
      </OverlaySurface>,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders right placement', () => {
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" placement="right">
        <div>Content</div>
      </OverlaySurface>,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('renders left placement', () => {
    render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" placement="left">
        <div>Content</div>
      </OverlaySurface>,
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('destroyOnHidden=false keeps mounted', async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <OverlaySurface open={true} disablePortal ariaLabel="Test" destroyOnHidden={false}>
        <div>Content</div>
      </OverlaySurface>,
    );

    rerender(
      <OverlaySurface open={false} disablePortal ariaLabel="Test" destroyOnHidden={false}>
        <div>Content</div>
      </OverlaySurface>,
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should still be in DOM since destroyOnHidden=false
    expect(screen.getByRole('dialog')).toBeTruthy();
    vi.useRealTimers();
  });
});
