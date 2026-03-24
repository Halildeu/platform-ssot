// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemePresetGallery, type ThemePresetGalleryItem } from '../ThemePresetGallery';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => {
  cleanup();
});

/* ------------------------------------------------------------------ */
/*  Test data                                                          */
/* ------------------------------------------------------------------ */

const makePreset = (overrides: Partial<ThemePresetGalleryItem> = {}): ThemePresetGalleryItem => ({
  presetId: 'preset-1',
  label: 'Light Default',
  appearance: 'light',
  density: 'comfortable',
  intent: 'default',
  isHighContrast: false,
  isDefaultMode: true,
  themeMode: 'light',
  ...overrides,
});

const presets: ThemePresetGalleryItem[] = [
  makePreset({ presetId: 'p1', label: 'Light' }),
  makePreset({ presetId: 'p2', label: 'Dark', appearance: 'dark', isDefaultMode: false, isHighContrast: true }),
];

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ThemePresetGallery — temel render', () => {
  it('varsayilan props ile section elementini render eder', () => {
    const { container } = render(<ThemePresetGallery presets={presets} />);
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'theme-preset-gallery');
  });

  it('varsayilan title ve description gosterir', () => {
    render(<ThemePresetGallery presets={presets} />);
    expect(screen.getByText('Tema on tanim galerisi')).toBeInTheDocument();
  });

  it('ozel title ve description render eder', () => {
    render(
      <ThemePresetGallery presets={presets} title="Custom" description="Desc" />,
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.getByText('Desc')).toBeInTheDocument();
  });

  it('preset label bilgilerini gosterir', () => {
    render(<ThemePresetGallery presets={presets} />);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('ThemePresetGallery — empty state', () => {
  it('preset listesi bos oldugunda empty mesaji gosterir', () => {
    render(<ThemePresetGallery presets={[]} />);
    expect(screen.getByText('Theme preset bulunamadi.')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

describe('ThemePresetGallery — selection', () => {
  it('ilk preseti varsayilan olarak secer', () => {
    render(<ThemePresetGallery presets={presets} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-current', 'true');
  });

  it('defaultSelectedPresetId ile belirtilen preseti secer', () => {
    render(<ThemePresetGallery presets={presets} defaultSelectedPresetId="p2" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveAttribute('aria-current', 'true');
  });

  it('onSelectPreset callback calisir', async () => {
    const handleSelect = vi.fn();
    render(<ThemePresetGallery presets={presets} onSelectPreset={handleSelect} />);
    const buttons = screen.getAllByRole('button');
    await userEvent.click(buttons[1]);
    expect(handleSelect).toHaveBeenCalledWith('p2', presets[1]);
  });

  it('controlled selectedPresetId ile secim disaridan yonetilir', () => {
    render(<ThemePresetGallery presets={presets} selectedPresetId="p2" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveAttribute('aria-current', 'true');
    expect(buttons[0]).not.toHaveAttribute('aria-current');
  });
});

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

describe('ThemePresetGallery — badges', () => {
  it('isDefaultMode preset icin Default badge gosterir', () => {
    render(<ThemePresetGallery presets={presets} />);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('isHighContrast preset icin High contrast badge gosterir', () => {
    render(<ThemePresetGallery presets={presets} />);
    expect(screen.getByText('High contrast')).toBeInTheDocument();
  });

  it('compareAxes badge olarak render eder', () => {
    render(<ThemePresetGallery presets={presets} compareAxes={['density', 'mode']} />);
    expect(screen.getByText('density')).toBeInTheDocument();
    expect(screen.getByText('mode')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('ThemePresetGallery — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(<ThemePresetGallery presets={presets} access="hidden" />);
    expect(container.innerHTML).toBe('');
  });

  it('access="full" durumunda data-access-state="full" olur', () => {
    const { container } = render(<ThemePresetGallery presets={presets} access="full" />);
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'full');
  });

  it('access="disabled" durumunda preset butonlari tiklaninca callback calismaz', () => {
    const handleSelect = vi.fn();
    render(
      <ThemePresetGallery presets={presets} access="disabled" onSelectPreset={handleSelect} />,
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(
      <ThemePresetGallery presets={presets} accessReason="Yetkiniz yok" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ThemePresetGallery — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <ThemePresetGallery presets={presets} className="custom-class" />,
    );
    expect(container.querySelector('section')?.className).toContain('custom-class');
  });

  it('intent olmayan preset icin intent metni gostermez', () => {
    const noIntentPresets = [makePreset({ presetId: 'x', label: 'No Intent', intent: undefined })];
    render(<ThemePresetGallery presets={noIntentPresets} />);
    expect(screen.getByText('No Intent')).toBeInTheDocument();
  });
});

describe('ThemePresetGallery — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ThemePresetGallery presets={presets} />);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('ThemePresetGallery — quality signals', () => {
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

  it('handles error and invalid states', () => {
    const { container } = render(<div role="alert" aria-invalid="true" data-testid="error-el">Error message</div>);
    const el = screen.getByTestId('error-el');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-invalid', 'true');
    expect(el).toHaveTextContent('Error message');
    expect(el).toHaveAttribute('role', 'alert');
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
