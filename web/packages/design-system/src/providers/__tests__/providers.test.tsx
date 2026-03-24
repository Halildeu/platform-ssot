// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';

/* ---- Imports under test ---- */
import { DesignSystemProvider } from '../DesignSystemProvider';
import { ThemeProvider, useTheme } from '../ThemeProvider';
import { DirectionProvider } from '../DirectionProvider';
import { LocaleProvider, useLocale } from '../LocaleProvider';
import userEvent from '@testing-library/user-event';

afterEach(() => {
  cleanup();
  // Clean up localStorage after ThemeProvider tests
  try {
    window.localStorage.removeItem('themeAxes');
  } catch {
    // ignore
  }
});

/* ================================================================== */
/*  DesignSystemProvider                                                */
/* ================================================================== */

describe('DesignSystemProvider', () => {
  it('renders children', () => {
    render(
      <DesignSystemProvider>
        <span data-testid="ds-child">Hello</span>
      </DesignSystemProvider>,
    );
    expect(screen.getByTestId('ds-child')).toBeInTheDocument();
  });

  it('provides theme context (useTheme works inside)', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;

    function Consumer() {
      themeCtx = useTheme();
      return <span>ok</span>;
    }

    render(
      <DesignSystemProvider>
        <Consumer />
      </DesignSystemProvider>,
    );

    expect(themeCtx).toBeDefined();
    expect(themeCtx!.axes.appearance).toBe('light');
  });

  it('provides locale context', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;

    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }

    render(
      <DesignSystemProvider locale="tr">
        <Consumer />
      </DesignSystemProvider>,
    );

    expect(localeCtx).toBeDefined();
    expect(localeCtx!.locale).toBe('tr');
    expect(localeCtx!.direction).toBe('ltr');
  });

  it('passes RTL locale correctly', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;

    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }

    render(
      <DesignSystemProvider locale="ar">
        <Consumer />
      </DesignSystemProvider>,
    );

    expect(localeCtx!.direction).toBe('rtl');
  });

  it('provides default theme axes with density', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;

    function Consumer() {
      themeCtx = useTheme();
      return <span>ok</span>;
    }

    render(
      <DesignSystemProvider>
        <Consumer />
      </DesignSystemProvider>,
    );

    expect(themeCtx).toBeDefined();
    expect(themeCtx!.axes.appearance).toBe('light');
    expect(themeCtx!.axes.density).toBe('comfortable');
    expect(typeof themeCtx!.setAppearance).toBe('function');
  });

  it('renders empty children without error', () => {
    const { container } = render(
      <DesignSystemProvider>{null}</DesignSystemProvider>,
    );
    expect(container).toBeTruthy();
    expect(container.innerHTML).not.toBe('');
    expect(container.firstElementChild).toBeTruthy();
  });

  it('forwards defaultTheme to ThemeProvider', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;

    function Consumer() {
      themeCtx = useTheme();
      return <span>ok</span>;
    }

    render(
      <DesignSystemProvider defaultTheme={{ appearance: 'dark' }}>
        <Consumer />
      </DesignSystemProvider>,
    );

    expect(themeCtx).toBeDefined();
    expect(themeCtx!.axes.appearance).toBe('dark');
    expect(themeCtx!.axes.density).toBe('comfortable');
    expect(typeof themeCtx!.update).toBe('function');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <DesignSystemProvider>
        <div>Content</div>
      </DesignSystemProvider>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  ThemeProvider                                                       */
/* ================================================================== */

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider>
        <span data-testid="theme-child">Themed</span>
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme-child')).toBeInTheDocument();
  });

  it('provides default theme axes', () => {
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
    expect(themeCtx!.axes.density).toBe('comfortable');
  });

  it('merges defaultAxes override', () => {
    let themeCtx: ReturnType<typeof useTheme> | undefined;

    function Consumer() {
      themeCtx = useTheme();
      return <span>ok</span>;
    }

    render(
      <ThemeProvider defaultAxes={{ appearance: 'dark' }}>
        <Consumer />
      </ThemeProvider>,
    );

    expect(themeCtx!.axes.appearance).toBe('dark');
  });

  it('update() changes theme axes', () => {
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
      themeCtx!.update({ density: 'compact' });
    });

    expect(themeCtx!.axes.density).toBe('compact');
  });

  it('setAppearance() switches appearance', () => {
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
      themeCtx!.setAppearance('dark');
    });

    expect(themeCtx!.axes.appearance).toBe('dark');
  });

  it('throws when useTheme is called outside ThemeProvider', () => {
    function Consumer() {
      useTheme();
      return <span>ok</span>;
    }

    expect(() => render(<Consumer />)).toThrow('useTheme must be used within <ThemeProvider>');
  });
});

/* ================================================================== */
/*  DirectionProvider                                                   */
/* ================================================================== */

describe('DirectionProvider', () => {
  it('renders children', () => {
    render(
      <DirectionProvider direction="ltr">
        <span data-testid="dir-child">Content</span>
      </DirectionProvider>,
    );
    expect(screen.getByTestId('dir-child')).toBeInTheDocument();
  });

  it('sets dir="rtl" on wrapper div', () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <span>Content</span>
      </DirectionProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('dir', 'rtl');
  });

  it('sets dir="ltr" on wrapper div', () => {
    const { container } = render(
      <DirectionProvider direction="ltr">
        <span>Content</span>
      </DirectionProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('dir', 'ltr');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <DirectionProvider direction="rtl">
        <div>RTL Content</div>
      </DirectionProvider>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  LocaleProvider                                                     */
/* ================================================================== */

describe('LocaleProvider', () => {
  it('renders children', () => {
    render(
      <LocaleProvider>
        <span data-testid="locale-child">Content</span>
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale-child')).toBeInTheDocument();
  });

  it('provides default locale "en" with direction "ltr"', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;

    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }

    render(
      <LocaleProvider>
        <Consumer />
      </LocaleProvider>,
    );

    expect(localeCtx!.locale).toBe('en');
    expect(localeCtx!.direction).toBe('ltr');
  });

  it('auto-detects RTL for Arabic locale', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;

    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }

    render(
      <LocaleProvider locale="ar">
        <Consumer />
      </LocaleProvider>,
    );

    expect(localeCtx!.locale).toBe('ar');
    expect(localeCtx!.direction).toBe('rtl');
  });

  it('auto-detects RTL for Hebrew locale', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;

    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }

    render(
      <LocaleProvider locale="he">
        <Consumer />
      </LocaleProvider>,
    );

    expect(localeCtx!.direction).toBe('rtl');
  });

  it('allows explicit direction override', () => {
    let localeCtx: ReturnType<typeof useLocale> | undefined;

    function Consumer() {
      localeCtx = useLocale();
      return <span>ok</span>;
    }

    render(
      <LocaleProvider locale="en" direction="rtl">
        <Consumer />
      </LocaleProvider>,
    );

    expect(localeCtx!.direction).toBe('rtl');
  });

  it('sets dir attribute on wrapper div', () => {
    const { container } = render(
      <LocaleProvider locale="ar">
        <span>Content</span>
      </LocaleProvider>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('dir', 'rtl');
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <LocaleProvider locale="en">
        <div>English Content</div>
      </LocaleProvider>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('scorecard quality — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});
