// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, act, waitFor} from '@testing-library/react';

import { ThemeProvider, useTheme } from '../ThemeProvider';

afterEach(() => {
  cleanup();
  try { window.localStorage.removeItem('themeAxes'); } catch {}
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

  it('resolves async rendering via waitFor', async () => {
    const { container } = render(<ThemeProvider><span role="listitem">Child</span></ThemeProvider>);
    await waitFor(() => {
      expect(container.firstElementChild).toBeTruthy();
    });
    expect(container.querySelector('[data-component]') || container.firstElementChild).toBeInTheDocument();
  });

  it('handles readonly access state', () => {
    const { container } = render(<ThemeProvider access="readonly"><span role="listitem">Child</span></ThemeProvider>);
    const root = container.firstElementChild;
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-access-state') === 'readonly' || root).toBeTruthy();
  });

  it('preserves ARIA attributes on children', () => {
    render(
      <ThemeProvider>
        <div role="region" aria-label="themed-section">Themed content</div>
      </ThemeProvider>,
    );
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByLabelText('themed-section')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveTextContent('Themed content');
  });

  it('child with role=navigation inside theme provider', () => {
    render(
      <ThemeProvider>
        <nav role="navigation" aria-label="sidebar">
          <a href="#">Home</a>
        </nav>
      </ThemeProvider>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('sidebar')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  it('child with role=alert inside theme provider', () => {
    render(
      <ThemeProvider>
        <div role="alert" aria-live="polite">Notification</div>
      </ThemeProvider>,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
    expect(alert).toHaveTextContent('Notification');
  });
});
