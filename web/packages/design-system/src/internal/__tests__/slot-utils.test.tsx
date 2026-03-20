// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {
  mergeClassNames,
  resolveSlotProps,
  renderSlot,
  type SlotPropsMap,
  type SlotComponentMap,
} from '../slot-utils';

/* ------------------------------------------------------------------ */
/*  mergeClassNames                                                    */
/* ------------------------------------------------------------------ */
describe('mergeClassNames', () => {
  it('merges multiple class strings', () => {
    expect(mergeClassNames('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out undefined, null, and false', () => {
    expect(mergeClassNames('a', undefined, null, false, 'b')).toBe('a b');
  });

  it('returns empty string when all values are falsy', () => {
    expect(mergeClassNames(undefined, null, false)).toBe('');
  });

  it('returns single class without trailing space', () => {
    expect(mergeClassNames('only')).toBe('only');
  });

  it('filters empty strings', () => {
    // empty string is falsy in JS, so filter(Boolean) removes it
    expect(mergeClassNames('a', '', 'b')).toBe('a b');
  });
});

/* ------------------------------------------------------------------ */
/*  resolveSlotProps                                                    */
/* ------------------------------------------------------------------ */
describe('resolveSlotProps', () => {
  it('returns defaults when no slotProps provided', () => {
    const defaults = { className: 'btn', role: 'button' };
    expect(resolveSlotProps(defaults)).toEqual(defaults);
  });

  it('returns defaults when slotProps is undefined', () => {
    const defaults = { className: 'btn' };
    expect(resolveSlotProps(defaults, undefined)).toEqual(defaults);
  });

  it('merges consumer overrides with defaults', () => {
    const defaults = { className: 'btn', role: 'button' as const };
    const slot = { 'data-testid': 'custom' };
    const result = resolveSlotProps(defaults, slot);
    expect(result).toEqual({ className: 'btn', role: 'button', 'data-testid': 'custom' });
  });

  it('consumer props take precedence over defaults', () => {
    const defaults = { role: 'button', tabIndex: 0 };
    const slot = { role: 'link' };
    const result = resolveSlotProps(defaults, slot);
    expect(result.role).toBe('link');
    expect(result.tabIndex).toBe(0);
  });

  it('concatenates className values', () => {
    const defaults = { className: 'base-class' };
    const slot = { className: 'consumer-class' };
    const result = resolveSlotProps(defaults, slot);
    expect(result.className).toBe('base-class consumer-class');
  });

  it('handles className when default is undefined', () => {
    const defaults = { className: undefined as string | undefined };
    const slot = { className: 'consumer-class' };
    const result = resolveSlotProps(defaults, slot);
    expect(result.className).toBe('consumer-class');
  });

  it('deep merges style objects', () => {
    const defaults = { style: { color: 'red', fontSize: '14px' } };
    const slot = { style: { color: 'blue', padding: '8px' } };
    const result = resolveSlotProps(defaults, slot);
    expect(result.style).toEqual({ color: 'blue', fontSize: '14px', padding: '8px' });
  });

  it('does not override with undefined consumer values', () => {
    const defaults = { className: 'btn', role: 'button' };
    const slot = { role: undefined };
    const result = resolveSlotProps(defaults, slot);
    expect(result.role).toBe('button');
  });
});

/* ------------------------------------------------------------------ */
/*  renderSlot                                                         */
/* ------------------------------------------------------------------ */
describe('renderSlot', () => {
  it('renders default component when no override provided', () => {
    render(renderSlot('button', undefined, { 'data-testid': 'slot-btn' }, 'Click'));
    const el = screen.getByTestId('slot-btn');
    expect(el.tagName).toBe('BUTTON');
    expect(el).toHaveTextContent('Click');
  });

  it('renders override component when provided', () => {
    render(renderSlot('button', 'a', { 'data-testid': 'slot-link', href: '#' }, 'Link'));
    const el = screen.getByTestId('slot-link');
    expect(el.tagName).toBe('A');
    expect(el).toHaveTextContent('Link');
  });

  it('renders custom React component as override', () => {
    const CustomRoot: React.FC<{ children?: React.ReactNode; 'data-testid'?: string }> = ({
      children,
      ...props
    }) => <div {...props} data-custom="true">{children}</div>;

    render(renderSlot('button', CustomRoot, { 'data-testid': 'slot-custom' }, 'Custom'));
    const el = screen.getByTestId('slot-custom');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveAttribute('data-custom', 'true');
    expect(el).toHaveTextContent('Custom');
  });

  it('passes props through to rendered component', () => {
    render(
      renderSlot('span', undefined, { className: 'icon', 'aria-hidden': 'true', 'data-testid': 'icon' }),
    );
    const el = screen.getByTestId('icon');
    expect(el).toHaveClass('icon');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });
});

/* ------------------------------------------------------------------ */
/*  Type-level tests (compile-time only — no runtime assertions)       */
/* ------------------------------------------------------------------ */
describe('type helpers (compile-time checks)', () => {
  it('SlotPropsMap produces correct partial types', () => {
    type ButtonSlotProps = SlotPropsMap<{
      root: React.HTMLAttributes<HTMLButtonElement>;
      label: React.HTMLAttributes<HTMLSpanElement>;
    }>;

    // This block only needs to compile — the runtime assertion is trivial.
    const slotProps: ButtonSlotProps = {
      root: { className: 'custom', 'aria-label': 'btn' },
      label: { 'data-testid': 'lbl' },
    };
    expect(slotProps).toBeDefined();
  });

  it('SlotComponentMap produces correct optional types', () => {
    type ButtonSlots = SlotComponentMap<{
      root: React.ElementType;
      startIcon: React.ElementType;
    }>;

    const slots: ButtonSlots = {
      root: 'a',
      // startIcon intentionally omitted — should be optional
    };
    expect(slots).toBeDefined();
  });
});
