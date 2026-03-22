// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMotion } from '../useMotion';

describe('useMotion', () => {
  it('returns default values (normal duration, default easing)', () => {
    const { result } = renderHook(() => useMotion());
    expect(result.current.duration).toBe(200); // normal = 200ms
    expect(result.current.easing).toContain('cubic-bezier');
    expect(result.current.reducedMotion).toBe(false);
  });

  it('returns fast duration when specified', () => {
    const { result } = renderHook(() => useMotion({ duration: 'fast' }));
    expect(result.current.duration).toBe(100);
  });

  it('returns slow duration when specified', () => {
    const { result } = renderHook(() => useMotion({ duration: 'slow' }));
    expect(result.current.duration).toBe(300);
  });

  it('returns spring easing when specified', () => {
    const { result } = renderHook(() => useMotion({ easing: 'spring' }));
    expect(result.current.easing).toContain('0.175');
  });

  it('transition string includes duration and easing', () => {
    const { result } = renderHook(() => useMotion({ duration: 'fast' }));
    expect(result.current.transition).toContain('100ms');
    expect(result.current.transition).toContain('cubic-bezier');
  });

  it('style object has correct properties', () => {
    const { result } = renderHook(() => useMotion());
    expect(result.current.style.transitionDuration).toBe('200ms');
    expect(result.current.style.transitionTimingFunction).toContain('cubic-bezier');
  });
});
