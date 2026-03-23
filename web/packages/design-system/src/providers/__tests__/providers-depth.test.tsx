// @vitest-environment jsdom
/**
 * Providers — interaction + edge-case depth tests
 *
 * Targets: DesignSystemProvider, ThemeProvider, DirectionProvider, LocaleProvider
 */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/* ---- Components under test ---- */
import { DesignSystemProvider } from '../DesignSystemProvider';
import { ThemeProvider, useTheme } from '../ThemeProvider';
import { DirectionProvider } from '../DirectionProvider';
import { LocaleProvider, useLocale } from '../LocaleProvider';

afterEach(() => {
  cleanup();
  try {
    window.localStorage.removeItem('themeAxes');
  } catch {
    // ignore
  }
});

/* ================================================================== */
/*  1. DesignSystemProvider — depth                                    */
/* ================================================================== */

describe('DesignSystemProvider — depth', () => {
  it('renders children', () => {
    render(
      <DesignSystemProvider>
        <span data-testid="dsp-child">Hello</span>
      </DesignSystemProvider>,
    );
    expect(screen.getByTestId('dsp-child')).toBeInTheDocument();
    expect(screen.getByTestId('dsp-child')).toHaveTextContent('Hello');
  });

  it('provides theme context to descendants', () => {
    let axes: Record<string, unknown> | undefined;
    function Consumer() {
      const t = useTheme();
      axes = t.axes as unknown as Record<string, unknown>;
      return <span>ok</span>;
    }
    render(
      <DesignSystemProvider>
        <Consumer />
      </DesignSystemProvider>,
    );
    expect(axes).toBeDefined();
    expect(axes).toHaveProperty('appearance');
  });

  it('empty children renders without crash', () => {
    const { container } = render(
      <DesignSystemProvider>{null}</DesignSystemProvider>,
    );
    expect(container).toBeTruthy();
  });

  it('passes custom locale', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;
    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }
    render(
      <DesignSystemProvider locale="fa">
        <Consumer />
      </DesignSystemProvider>,
    );
    expect(localeCtx!.locale).toBe('fa');
    expect(localeCtx!.direction).toBe('rtl');
  });

  it('passes explicit direction override', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;
    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }
    render(
      <DesignSystemProvider locale="en" direction="rtl">
        <Consumer />
      </DesignSystemProvider>,
    );
    expect(localeCtx!.direction).toBe('rtl');
  });

  it('click propagates through provider via userEvent', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DesignSystemProvider>
        <button onClick={onClick}>Action</button>
      </DesignSystemProvider>,
    );
    await user.click(screen.getByText('Action'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

/* ================================================================== */
/*  2. ThemeProvider — depth                                           */
/* ================================================================== */

describe('ThemeProvider — depth', () => {
  it('setAppearance switches to dark', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;
    function Consumer() {
      themeCtx = useTheme();
      return <span>ok</span>;
    }
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    expect(themeCtx!.axes.appearance).toBe('light');
    act(() => {
      themeCtx!.setAppearance('dark');
    });
    expect(themeCtx!.axes.appearance).toBe('dark');
  });

  it('setDensity switches density', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;
    function Consumer() {
      themeCtx = useTheme();
      return <span>ok</span>;
    }
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    act(() => {
      themeCtx!.setDensity('compact');
    });
    expect(themeCtx!.axes.density).toBe('compact');
  });

  it('update merges partial axes', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;
    function Consumer() {
      themeCtx = useTheme();
      return <span>ok</span>;
    }
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );
    act(() => {
      themeCtx!.update({ appearance: 'high-contrast' });
    });
    expect(themeCtx!.axes.appearance).toBe('high-contrast');
    // density should remain unchanged
    expect(themeCtx!.axes.density).toBe('comfortable');
  });

  it('throws when useTheme called outside provider', () => {
    function Consumer() {
      useTheme();
      return <span>ok</span>;
    }
    expect(() => render(<Consumer />)).toThrow();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <button>Theme action</button>
      </ThemeProvider>,
    );
    await user.tab();
    expect(screen.getByText('Theme action')).toHaveFocus();
  });
});

/* ================================================================== */
/*  3. DirectionProvider — depth                                       */
/* ================================================================== */

describe('DirectionProvider — depth', () => {
  it('sets dir=rtl on wrapper', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <span>Content</span>
      </DirectionProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('dir', 'rtl');
  });

  it('sets dir=ltr on wrapper', () => {
    const { container } = render(
      <DirectionProvider direction="ltr">
        <span>Content</span>
      </DirectionProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('dir', 'ltr');
  });

  it('children render inside direction wrapper', () => {
    render(
      <DirectionProvider direction="rtl">
        <span data-testid="dir-content">RTL</span>
      </DirectionProvider>,
    );
    expect(screen.getByTestId('dir-content')).toHaveTextContent('RTL');
  });

  it('renders empty children safely', () => {
    const { container } = render(
      <DirectionProvider direction="ltr">{null}</DirectionProvider>,
    );
    expect(container.firstElementChild).toBeTruthy();
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(
      <DirectionProvider direction="rtl">
        <button>Click me</button>
      </DirectionProvider>,
    );
    await user.tab();
    expect(screen.getByText('Click me')).toHaveFocus();
  });
});

/* ================================================================== */
/*  4. LocaleProvider — depth                                          */
/* ================================================================== */

describe('LocaleProvider — depth', () => {
  it('defaults to locale en and direction ltr', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() {
      ctx = useLocale();
      return <span>ok</span>;
    }
    render(
      <LocaleProvider>
        <Consumer />
      </LocaleProvider>,
    );
    expect(ctx!.locale).toBe('en');
    expect(ctx!.direction).toBe('ltr');
  });

  it('switches locale to Turkish', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() {
      ctx = useLocale();
      return <span>ok</span>;
    }
    render(
      <LocaleProvider locale="tr">
        <Consumer />
      </LocaleProvider>,
    );
    expect(ctx!.locale).toBe('tr');
    expect(ctx!.direction).toBe('ltr');
  });

  it('auto-detects RTL for Urdu', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() {
      ctx = useLocale();
      return <span>ok</span>;
    }
    render(
      <LocaleProvider locale="ur">
        <Consumer />
      </LocaleProvider>,
    );
    expect(ctx!.direction).toBe('rtl');
  });

  it('auto-detects RTL for Farsi', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() {
      ctx = useLocale();
      return <span>ok</span>;
    }
    render(
      <LocaleProvider locale="fa">
        <Consumer />
      </LocaleProvider>,
    );
    expect(ctx!.direction).toBe('rtl');
  });

  it('explicit direction overrides auto-detection', () => {
    let ctx: ReturnType<typeof useLocale> | undefined;
    function Consumer() {
      ctx = useLocale();
      return <span>ok</span>;
    }
    render(
      <LocaleProvider locale="ar" direction="ltr">
        <Consumer />
      </LocaleProvider>,
    );
    // ar would normally be rtl, but explicit override
    expect(ctx!.direction).toBe('ltr');
  });

  it('sets dir attribute on wrapper', () => {
    const { container } = render(
      <LocaleProvider locale="he">
        <span>Content</span>
      </LocaleProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('dir', 'rtl');
  });

  it('supports keyboard navigation via userEvent', async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <button>Locale action</button>
      </LocaleProvider>,
    );
    await user.tab();
    expect(screen.getByText('Locale action')).toHaveFocus();
  });
});
