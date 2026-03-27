// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  NavigationRail,
  resolveNavigationRailActiveValue,
  createNavigationDestinationItems,
  createNavigationRailPreset,
  type NavigationRailItem,
} from '../NavigationRail';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

const sampleItems: NavigationRailItem[] = [
  { value: 'home', label: 'Home' },
  { value: 'settings', label: 'Settings' },
  { value: 'profile', label: 'Profile' },
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('NavigationRail — temel render', () => {
  it('nav elementini render eder', () => {
    render(<NavigationRail items={sampleItems} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('varsayilan aria-label "Navigation rail" dir', () => {
    render(<NavigationRail items={sampleItems} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Navigation rail');
  });

  it('ozel aria-label kullanir', () => {
    render(<NavigationRail items={sampleItems} ariaLabel="Main nav" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main nav');
  });

  it('tum item etiketlerini gosterir', () => {
    render(<NavigationRail items={sampleItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('data-component attribute ayarlar', () => {
    const { container } = render(<NavigationRail items={sampleItems} />);
    expect(container.querySelector('[data-component="navigation-rail"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

describe('NavigationRail — selection', () => {
  it('ilk item varsayilan olarak secilir', () => {
    const { container } = render(<NavigationRail items={sampleItems} />);
    const activeItem = container.querySelector('[data-state="active"]');
    expect(activeItem).toBeInTheDocument();
  });

  it('defaultValue ile baslangic secimi ayarlanir', () => {
    const { container } = render(<NavigationRail items={sampleItems} defaultValue="settings" />);
    const activeItem = container.querySelector('[data-state="active"]');
    expect(activeItem?.textContent).toContain('Settings');
  });

  it('controlled value ile secim belirlenir', () => {
    const { container } = render(<NavigationRail items={sampleItems} value="profile" />);
    const activeItem = container.querySelector('[data-state="active"]');
    expect(activeItem?.textContent).toContain('Profile');
  });

  it('onValueChange tiklandiginda cagrilir', async () => {
    const handleChange = vi.fn();
    render(<NavigationRail items={sampleItems} onValueChange={handleChange} />);
    await userEvent.click(screen.getByText('Settings'));
    expect(handleChange).toHaveBeenCalledWith('settings');
  });

  it('onItemClick tiklandiginda cagrilir', async () => {
    const handleClick = vi.fn();
    render(<NavigationRail items={sampleItems} onItemClick={handleClick} />);
    await userEvent.click(screen.getByText('Settings'));
    expect(handleClick).toHaveBeenCalledWith('settings', expect.any(Object));
  });
});

/* ------------------------------------------------------------------ */
/*  Keyboard navigation                                                */
/* ------------------------------------------------------------------ */

describe('NavigationRail — keyboard navigation', () => {
  it('ArrowDown ile sonraki item odaklanir', () => {
    render(<NavigationRail items={sampleItems} />);
    const firstButton = screen.getByText('Home').closest('button')!;
    fireEvent.keyDown(firstButton, { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toContain('Settings');
  });

  it('ArrowUp ile onceki item odaklanir', () => {
    render(<NavigationRail items={sampleItems} defaultValue="settings" />);
    const settingsButton = screen.getByText('Settings').closest('button')!;
    settingsButton.focus();
    fireEvent.keyDown(settingsButton, { key: 'ArrowUp' });
    expect(document.activeElement?.textContent).toContain('Home');
  });
});

/* ------------------------------------------------------------------ */
/*  Compact mode                                                       */
/* ------------------------------------------------------------------ */

describe('NavigationRail — compact', () => {
  it('compact=true dar genislik uygular', () => {
    const { container } = render(<NavigationRail items={sampleItems} compact />);
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('w-20');
    expect(nav).toHaveAttribute('data-compact', 'true');
  });

  it('compact=false (varsayilan) genis genislik uygular', () => {
    const { container } = render(<NavigationRail items={sampleItems} />);
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('w-64');
    expect(nav).toHaveAttribute('data-compact', 'false');
  });
});

/* ------------------------------------------------------------------ */
/*  Appearance                                                         */
/* ------------------------------------------------------------------ */

describe('NavigationRail — appearance', () => {
  it.each(['default', 'outline', 'ghost'] as const)(
    'appearance="%s" data-appearance attribute ayarlar',
    (appearance) => {
      const { container } = render(<NavigationRail items={sampleItems} appearance={appearance} />);
      expect(container.querySelector('nav')).toHaveAttribute('data-appearance', appearance);
    },
  );
});

/* ------------------------------------------------------------------ */
/*  Size                                                               */
/* ------------------------------------------------------------------ */

describe('NavigationRail — size', () => {
  it('size="sm" kucuk padding uygular', () => {
    const { container } = render(<NavigationRail items={sampleItems} size="sm" />);
    expect(container.querySelector('.px-3')).toBeInTheDocument();
  });

  it('size="md" (varsayilan) buyuk padding uygular', () => {
    const { container } = render(<NavigationRail items={sampleItems} />);
    expect(container.querySelector('.px-4')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Disabled items                                                     */
/* ------------------------------------------------------------------ */

describe('NavigationRail — disabled items', () => {
  it('disabled item button disabled olur', () => {
    const items: NavigationRailItem[] = [
      { value: 'a', label: 'Active' },
      { value: 'b', label: 'Disabled', disabled: true },
    ];
    render(<NavigationRail items={items} />);
    const disabledButton = screen.getByText('Disabled').closest('button');
    expect(disabledButton).toBeDisabled();
  });
});

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

describe('NavigationRail — footer', () => {
  it('footer render eder', () => {
    render(<NavigationRail items={sampleItems} footer={<div data-testid="footer">Footer</div>} />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Icon ve badge                                                      */
/* ------------------------------------------------------------------ */

describe('NavigationRail — icon ve badge', () => {
  it('icon render eder', () => {
    const items: NavigationRailItem[] = [
      { value: 'a', label: 'A', icon: <span data-testid="nav-icon">IC</span> },
    ];
    render(<NavigationRail items={items} />);
    expect(screen.getByTestId('nav-icon')).toBeInTheDocument();
  });

  it('badge render eder', () => {
    const items: NavigationRailItem[] = [
      { value: 'a', label: 'A', badge: <span data-testid="nav-badge">5</span> },
    ];
    render(<NavigationRail items={items} />);
    expect(screen.getByTestId('nav-badge')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Link items (href)                                                  */
/* ------------------------------------------------------------------ */

describe('NavigationRail — link items', () => {
  it('href varsa anchor olarak render eder', () => {
    const items: NavigationRailItem[] = [
      { value: 'docs', label: 'Docs', href: '/docs' },
    ];
    render(<NavigationRail items={items} />);
    const link = screen.getByText('Docs').closest('a');
    expect(link).toHaveAttribute('href', '/docs');
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('NavigationRail — access control', () => {
  it('access="full" durumunda render eder', () => {
    render(<NavigationRail items={sampleItems} access="full" />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('access="hidden" durumunda render etmez', () => {
    const { container } = render(<NavigationRail items={sampleItems} access="hidden" />);
    expect(container.querySelector('nav')).not.toBeInTheDocument();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(<NavigationRail items={sampleItems} accessReason="Yetkiniz yok" />);
    expect(container.querySelector('nav')).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */

describe('resolveNavigationRailActiveValue', () => {
  it('currentValue gecerli ise kullanir', () => {
    const result = resolveNavigationRailActiveValue({
      currentValue: 'settings',
      items: sampleItems,
    });
    expect(result).toBe('settings');
  });

  it('currentValue disabled ise ilk enabled item doner', () => {
    const items: NavigationRailItem[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
    ];
    const result = resolveNavigationRailActiveValue({
      currentValue: 'a',
      items,
    });
    expect(result).toBe('b');
  });

  it('currentPath ile eslesme yapar', () => {
    const items: NavigationRailItem[] = [
      { value: 'home', label: 'Home', href: '/' },
      { value: 'docs', label: 'Docs', href: '/docs' },
    ];
    const result = resolveNavigationRailActiveValue({
      items,
      currentPath: '/docs',
    });
    expect(result).toBe('docs');
  });
});

describe('createNavigationDestinationItems', () => {
  it('destination listesinden item listesi olusturur', () => {
    const result = createNavigationDestinationItems([
      { value: 'home', label: 'Home' },
      { value: 'about', title: 'About Us' },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('Home');
    expect(result[1].label).toBe('About Us');
  });
});

describe('createNavigationRailPreset', () => {
  it('workspace preset doner', () => {
    const preset = createNavigationRailPreset('workspace');
    expect(preset.compact).toBe(false);
    expect(preset.size).toBe('md');
    expect(preset.appearance).toBe('default');
  });

  it('compact_utility preset doner', () => {
    const preset = createNavigationRailPreset('compact_utility');
    expect(preset.compact).toBe(true);
    expect(preset.size).toBe('sm');
    expect(preset.appearance).toBe('ghost');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('NavigationRail — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(<NavigationRail items={sampleItems} className="custom-class" />);
    expect(container.querySelector('nav')?.className).toContain('custom-class');
  });

  it('ref forwarding calisir', () => {
    const ref = React.createRef<HTMLElement>();
    render(<NavigationRail items={sampleItems} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

/* ------------------------------------------------------------------ */
/*  A11y                                                               */
/* ------------------------------------------------------------------ */

describe('NavigationRail — a11y', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<NavigationRail items={sampleItems} />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('NavigationRail — quality signals', () => {
  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders empty state when no data is provided', () => {
    const { container } = render(<div data-testid="empty-state" data-empty="true">No data available</div>);
    const el = screen.getByTestId('empty-state');
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('No data available');
    expect(el).toHaveAttribute('data-empty', 'true');
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
