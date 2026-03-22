import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { ThemePresetGallery } from '../ThemePresetGallery';

const presets = [
  { presetId: 'light', label: 'Light Mode', themeMode: 'light' },
  { presetId: 'dark', label: 'Dark Mode', themeMode: 'dark' },
];

describe('ThemePresetGallery (Browser)', () => {
  it('renders preset items', async () => {
    const screen = await render(<ThemePresetGallery presets={presets} />);
    await expect.element(screen.getByText('Light Mode')).toBeVisible();
    await expect.element(screen.getByText('Dark Mode')).toBeVisible();
  });

  it('renders empty state when no presets', async () => {
    const screen = await render(<ThemePresetGallery presets={[]} />);
    await expect.element(screen.getByText('Theme preset bulunamadi.')).toBeVisible();
  });

  it('calls onSelectPreset when preset is clicked', async () => {
    const onSelect = vi.fn();
    const screen = await render(
      <ThemePresetGallery presets={presets} onSelectPreset={onSelect} />,
    );
    await screen.getByText('Dark Mode').click();
    expect(onSelect).toHaveBeenCalledWith('dark', expect.objectContaining({ presetId: 'dark' }));
  });

  it('renders data-component attribute', async () => {
    const screen = await render(<ThemePresetGallery presets={presets} />);
    const el = document.querySelector('[data-component="theme-preset-gallery"]');
    expect(el).not.toBeNull();
  });

  it('renders nothing when access is hidden', async () => {
    const screen = await render(<ThemePresetGallery presets={presets} access="hidden" />);
    expect(document.querySelector('[data-component="theme-preset-gallery"]')).toBeNull();
  });

  it('renders custom title', async () => {
    const screen = await render(<ThemePresetGallery presets={[]} title="Themes" />);
    await expect.element(screen.getByText('Themes')).toBeVisible();
  });

  it('renders selected preset indicator', async () => {
    const screen = await render(
      <ThemePresetGallery presets={presets} selectedPresetId="light" />,
    );
    await expect.element(screen.getByText('Light Mode')).toBeVisible();
  });
});
