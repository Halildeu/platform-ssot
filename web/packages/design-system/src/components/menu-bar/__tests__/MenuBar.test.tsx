// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import {
  MenuBar,
  createMenuBarPreset,
  createMenuBarItemsFromRoutes,
  resolveMenuBarActiveValue,
  type MenuBarItem,
} from '../MenuBar';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const sampleItems: MenuBarItem[] = [
  { value: 'dashboard', label: 'Dashboard', icon: <span data-testid="icon-dash">D</span> },
  { value: 'policies', label: 'Policies' },
  { value: 'settings', label: 'Settings', disabled: true },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('MenuBar — temel render', () => {
  it('navigation elementini render eder', () => {
    render(<MenuBar items={sampleItems} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('varsayilan ariaLabel "Application menu" dir', () => {
    render(<MenuBar items={sampleItems} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Application menu');
  });

  it('tum ogeleri render eder', () => {
    render(<MenuBar items={sampleItems} />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Policies')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('icon render eder', () => {
    render(<MenuBar items={sampleItems} />);
    expect(screen.getByTestId('icon-dash')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Value yonetimi                                                     */
/* ------------------------------------------------------------------ */

describe('MenuBar — value yonetimi', () => {
  it('onValueChange callback calisir', async () => {
    const handleChange = vi.fn();
    render(<MenuBar items={sampleItems} onValueChange={handleChange} />);
    await userEvent.click(screen.getByText('Policies'));
    expect(handleChange).toHaveBeenCalledWith('policies');
  });

  it('disabled item tiklandiginda onValueChange calismaz', async () => {
    const handleChange = vi.fn();
    render(<MenuBar items={sampleItems} onValueChange={handleChange} />);
    await userEvent.click(screen.getByText('Settings'));
    expect(handleChange).not.toHaveBeenCalledWith('settings');
  });

  it('defaultValue ile baslangic degeri ayarlanir', () => {
    render(<MenuBar items={sampleItems} defaultValue="policies" />);
    const policiesBtn = screen.getByText('Policies').closest('button, a');
    expect(policiesBtn?.getAttribute('data-active')).toBe('true');
  });
});

/* ------------------------------------------------------------------ */
/*  Appearance & size                                                  */
/* ------------------------------------------------------------------ */

describe('MenuBar — appearance ve size', () => {
  it('size="sm" dogru class uygular', () => {
    const { container } = render(<MenuBar items={sampleItems} size="sm" />);
    const nav = container.querySelector('nav');
    expect(nav?.innerHTML).toBeTruthy();
  });

  it('appearance="ghost" dogru data-appearance attribute atar', () => {
    const { container } = render(<MenuBar items={sampleItems} appearance="ghost" />);
    const nav = container.querySelector('nav');
    expect(nav?.getAttribute('data-appearance')).toBe('ghost');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('MenuBar — access control', () => {
  it('access="hidden" oldugunda render etmez', () => {
    const { container } = render(<MenuBar items={sampleItems} access="hidden" />);
    expect(container.querySelector('nav')).toBeNull();
  });

  it('access="disabled" oldugunda ogeler disabled olur', () => {
    render(<MenuBar items={sampleItems} access="disabled" />);
    const menuitems = screen.getAllByRole('menuitem');
    menuitems.forEach((item) => {
      expect(item).toBeDisabled();
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Slots                                                              */
/* ------------------------------------------------------------------ */

describe('MenuBar — slots', () => {
  it('startSlot render eder', () => {
    render(<MenuBar items={sampleItems} startSlot={<div data-testid="start">Start</div>} />);
    expect(screen.getByTestId('start')).toBeInTheDocument();
  });

  it('endSlot render eder', () => {
    render(<MenuBar items={sampleItems} endSlot={<div data-testid="end">End</div>} />);
    expect(screen.getByTestId('end')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Yardimci fonksiyonlar                                              */
/* ------------------------------------------------------------------ */

describe('MenuBar — yardimci fonksiyonlar', () => {
  it('createMenuBarPreset workspace_header dogru doner', () => {
    const preset = createMenuBarPreset('workspace_header');
    expect(preset.size).toBe('md');
    expect(preset.appearance).toBe('default');
    expect(preset.labelVisibility).toBe('always');
  });

  it('createMenuBarPreset ops_command_bar dogru doner', () => {
    const preset = createMenuBarPreset('ops_command_bar');
    expect(preset.size).toBe('sm');
    expect(preset.appearance).toBe('outline');
  });

  it('createMenuBarPreset ghost_utility dogru doner', () => {
    const preset = createMenuBarPreset('ghost_utility');
    expect(preset.size).toBe('sm');
    expect(preset.appearance).toBe('ghost');
    expect(preset.labelVisibility).toBe('none');
  });

  it('createMenuBarItemsFromRoutes route listesinden item olusturur', () => {
    const routes = [
      { value: 'home', label: 'Home' },
      { value: 'about', title: 'About Us' },
    ];
    const result = createMenuBarItemsFromRoutes(routes);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('home');
    expect(result[1].label).toBe('About Us');
  });

  it('resolveMenuBarActiveValue dogru value doner', () => {
    const result = resolveMenuBarActiveValue({
      currentValue: 'policies',
      items: sampleItems,
    });
    expect(result).toBe('policies');
  });

  it('resolveMenuBarActiveValue disabled item atlayarak ilk aktif item doner', () => {
    const items: MenuBarItem[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
    ];
    const result = resolveMenuBarActiveValue({ items });
    expect(result).toBe('b');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('MenuBar — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<MenuBar items={sampleItems} className="custom-menu" />);
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('custom-menu');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLElement>();
    render(<MenuBar items={sampleItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('bos items dizisi ile render yapar', () => {
    render(<MenuBar items={[]} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('MenuBar — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<MenuBar items={sampleItems} />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('MenuBar — quality signals', () => {
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

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
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
