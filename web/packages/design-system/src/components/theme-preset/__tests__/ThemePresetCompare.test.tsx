// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemePresetCompare } from '../ThemePresetCompare';
import type { ThemePresetGalleryItem } from '../ThemePresetGallery';
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

const leftPreset = makePreset({ presetId: 'left', label: 'Left Preset' });
const rightPreset = makePreset({
  presetId: 'right',
  label: 'Right Preset',
  appearance: 'dark',
  isHighContrast: true,
  isDefaultMode: false,
  themeMode: 'dark',
});

/* ------------------------------------------------------------------ */
/*  Temel render                                                       */
/* ------------------------------------------------------------------ */

describe('ThemePresetCompare — temel render', () => {
  it('varsayilan props ile section elementini render eder', () => {
    const { container } = render(
      <ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} />,
    );
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-component', 'theme-preset-compare');
  });

  it('varsayilan title ve description gosterir', () => {
    render(<ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} />);
    expect(screen.getByText('Theme preset compare')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Presetler appearance, density, contrast ve intent eksenlerinde ayni compare matrisiyle okunur.',
      ),
    ).toBeInTheDocument();
  });

  it('ozel title ve description render eder', () => {
    render(
      <ThemePresetCompare
        leftPreset={leftPreset}
        rightPreset={rightPreset}
        title="Custom title"
        description="Custom desc"
      />,
    );
    expect(screen.getByText('Custom title')).toBeInTheDocument();
    expect(screen.getByText('Custom desc')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Preset karsilastirma                                               */
/* ------------------------------------------------------------------ */

describe('ThemePresetCompare — preset karsilastirma', () => {
  it('her iki presetin label bilgisini gosterir', () => {
    render(<ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} />);
    expect(screen.getAllByText('Left Preset').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Right Preset').length).toBeGreaterThanOrEqual(1);
  });

  it('varsayilan axes render eder', () => {
    render(<ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} />);
    expect(screen.getByText('appearance')).toBeInTheDocument();
    expect(screen.getByText('density')).toBeInTheDocument();
    expect(screen.getByText('intent')).toBeInTheDocument();
    expect(screen.getByText('contrast')).toBeInTheDocument();
  });

  it('ozel axes listesiyle sadece belirtilen eksenleri render eder', () => {
    render(
      <ThemePresetCompare
        leftPreset={leftPreset}
        rightPreset={rightPreset}
        axes={['appearance', 'mode']}
      />,
    );
    expect(screen.getByText('appearance')).toBeInTheDocument();
    expect(screen.getByText('mode')).toBeInTheDocument();
    expect(screen.queryByText('density')).not.toBeInTheDocument();
  });

  it('high contrast presetlerde "high" gosterir', () => {
    render(<ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

describe('ThemePresetCompare — empty state', () => {
  it('presetler eksik oldugunda empty mesaji gosterir', () => {
    render(<ThemePresetCompare />);
    expect(screen.getByText('Karsilastirma icin iki preset gerekli.')).toBeInTheDocument();
  });

  it('sadece leftPreset verildiginde empty state gosterir', () => {
    render(<ThemePresetCompare leftPreset={leftPreset} />);
    expect(screen.getByText('Karsilastirma icin iki preset gerekli.')).toBeInTheDocument();
  });

  it('sadece rightPreset verildiginde empty state gosterir', () => {
    render(<ThemePresetCompare rightPreset={rightPreset} />);
    expect(screen.getByText('Karsilastirma icin iki preset gerekli.')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Access control                                                     */
/* ------------------------------------------------------------------ */

describe('ThemePresetCompare — access control', () => {
  it('access="hidden" durumunda hicbir sey render etmez', () => {
    const { container } = render(
      <ThemePresetCompare
        leftPreset={leftPreset}
        rightPreset={rightPreset}
        access="hidden"
      />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('access="full" durumunda data-access-state="full" olur', () => {
    const { container } = render(
      <ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} access="full" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'full');
  });

  it('access="disabled" durumunda data-access-state="disabled" olur', () => {
    const { container } = render(
      <ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} access="disabled" />,
    );
    expect(container.querySelector('section')).toHaveAttribute('data-access-state', 'disabled');
  });

  it('accessReason title olarak atanir', () => {
    const { container } = render(
      <ThemePresetCompare
        leftPreset={leftPreset}
        rightPreset={rightPreset}
        accessReason="Yetkiniz yok"
      />,
    );
    expect(container.querySelector('section')).toHaveAttribute('title', 'Yetkiniz yok');
  });
});

/* ------------------------------------------------------------------ */
/*  Edge cases                                                         */
/* ------------------------------------------------------------------ */

describe('ThemePresetCompare — edge cases', () => {
  it('className forwarding calisir', () => {
    const { container } = render(
      <ThemePresetCompare
        leftPreset={leftPreset}
        rightPreset={rightPreset}
        className="custom-class"
      />,
    );
    expect(container.querySelector('section')?.className).toContain('custom-class');
  });

  it('bilinmeyen axis icin em dash gosterir', () => {
    render(
      <ThemePresetCompare
        leftPreset={leftPreset}
        rightPreset={rightPreset}
        axes={['unknownAxis']}
      />,
    );
    expect(screen.getAllByText('\u2014').length).toBeGreaterThanOrEqual(2);
  });
});

describe('ThemePresetCompare — accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ThemePresetCompare leftPreset={leftPreset} rightPreset={rightPreset} />);
    await expectNoA11yViolations(container);
  });
});
