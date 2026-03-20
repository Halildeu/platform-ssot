import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ThemeAdminPreviewPanel from './ThemeAdminPreviewPanel';
import type { ThemeDetails, ThemeSummary } from './ThemeAdminPage.shared';

vi.mock('./useThemeAdminI18n', () => ({
  useThemeAdminI18n: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (params?.count !== undefined) {
        return `${key}:${String(params.count)}`;
      }
      return key;
    },
  }),
}));

describe('ThemeAdminPreviewPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('tema paleti secimini Segmented uzerinden surdurur', () => {
    const onSelectTheme = vi.fn();
    const paletteThemes: ThemeSummary[] = [
      {
        id: 'theme-light',
        name: 'Global Light',
        type: 'GLOBAL',
        appearance: 'light',
        surfaceTone: 'mid-2',
        axes: {
          accent: 'neutral',
          density: 'comfortable',
          radius: 'rounded',
          elevation: 'raised',
          motion: 'standard',
        },
      },
      {
        id: 'theme-dark',
        name: 'Global Dark',
        type: 'GLOBAL',
        appearance: 'dark',
        surfaceTone: 'deep-3',
        axes: {
          accent: 'ocean',
          density: 'compact',
          radius: 'rounded',
          elevation: 'raised',
          motion: 'standard',
        },
      },
    ];
    const selectedTheme: ThemeDetails = {
      ...paletteThemes[0],
      overrides: {},
    };

    render(
      <ThemeAdminPreviewPanel
        previewRef={{ current: null }}
        paletteThemes={paletteThemes}
        selectedThemeId="theme-light"
        selectedTheme={selectedTheme}
        themeMeta={null}
        previewThemeAttr="light-comfortable"
        previewStyle={{}}
        rowsByGroup={[]}
        overrides={{}}
        resolvedPreviewDisplayCssVars={{}}
        onSelectTheme={onSelectTheme}
      />,
    );

    expect(screen.getByTestId('theme-preview-theme-light')).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByTestId('theme-preview-theme-dark'));

    expect(onSelectTheme).toHaveBeenCalledWith('theme-dark');
  });
});
