// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreakpoint, BREAKPOINTS } from '../useBreakpoint';

describe('useBreakpoint', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: window.matchMedia ? false : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('dogru breakpoint dondurur', () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.current).toBe('lg');
  });

  it('isAbove dogru calisir', () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isAbove('md')).toBe(true);
    expect(result.current.isAbove('xl')).toBe(false);
  });

  it('isBelow dogru calisir', () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.isBelow('xl')).toBe(true);
    expect(result.current.isBelow('sm')).toBe(false);
  });

  it('width degerini dondurur', () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current.width).toBe(1024);
  });

  it('BREAKPOINTS export edilir', () => {
    expect(BREAKPOINTS.xs).toBe(0);
    expect(BREAKPOINTS.sm).toBe(640);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS['2xl']).toBe(1536);
  });
});
