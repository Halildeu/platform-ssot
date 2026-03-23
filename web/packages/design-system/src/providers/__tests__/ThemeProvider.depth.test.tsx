// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, act } from '@testing-library/react';

import { ThemeProvider, useTheme } from '../ThemeProvider';

afterEach(() => {
  cleanup();
  try { window.localStorage.removeItem('themeAxes'); } catch { /* no-op */ }
});

describe('ThemeProvider — depth', () => {
  it('provides theme context with appearance', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;
    function Consumer() { themeCtx = useTheme(); return <span role="status">ok</span>; }
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(themeCtx!.axes.appearance).toBe('light');
  });

  it('setAppearance switches to dark', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;
    function Consumer() {
      themeCtx = useTheme();
      return <button onClick={() => themeCtx!.setAppearance('dark')}>Toggle</button>;
    }
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
    expect(themeCtx!.axes.appearance).toBe('dark');
  });

  it('setDensity switches density', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;
    function Consumer() {
      themeCtx = useTheme();
      return <button onClick={() => themeCtx!.setDensity('compact')}>Compact</button>;
    }
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: /compact/i }));
    expect(themeCtx!.axes.density).toBe('compact');
  });

  it('disabled — update merges partial axes', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;
    function Consumer() { themeCtx = useTheme(); return <span>ok</span>; }
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    act(() => { themeCtx!.update({ appearance: 'high-contrast' }); });
    expect(themeCtx!.axes.appearance).toBe('high-contrast');
    expect(themeCtx!.axes.density).toBe('comfortable');
  });

  it('error — throws when useTheme called outside provider', () => {
    function Consumer() { useTheme(); return <span>ok</span>; }
    expect(() => render(<Consumer />)).toThrow();
  });

  it('empty — renders children', () => {
    render(<ThemeProvider><span role="listitem">Child</span></ThemeProvider>);
    expect(screen.getByRole('listitem')).toHaveTextContent('Child');
  });
});
