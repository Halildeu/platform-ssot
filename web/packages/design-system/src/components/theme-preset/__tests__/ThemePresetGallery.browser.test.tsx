import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { ThemePresetGallery } from '../ThemePresetGallery';

describe('ThemePresetGallery (Browser)', () => {
  it('renders preset items', async () => {
    const screen = render(
      <ThemePresetGallery
        presets={[
          { presetId: 'light', label: 'Light Mode', themeMode: 'light' },
          { presetId: 'dark', label: 'Dark Mode', themeMode: 'dark' },
        ]}
      />,
    );
    await expect.element(screen.getByText('Light Mode')).toBeVisible();
    await expect.element(screen.getByText('Dark Mode')).toBeVisible();
  });

  it('renders empty state', async () => {
    const screen = render(<ThemePresetGallery presets={[]} />);
    await expect.element(screen.getByText('Theme preset bulunamadi.')).toBeVisible();
  });
});
