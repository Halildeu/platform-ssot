// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemePresetGallery, type ThemePresetGalleryItem } from '../ThemePresetGallery';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';

afterEach(() => cleanup());

const makePresets = (): ThemePresetGalleryItem[] => [
  { presetId: 'light', label: 'Light Mode', themeMode: 'light', appearance: 'default' },
  { presetId: 'dark', label: 'Dark Mode', themeMode: 'dark', appearance: 'modern' },
];

describe('ThemePresetGallery contract', () => {
  it('renders with required props', () => {
    const { container } = render(<ThemePresetGallery presets={makePresets()} />);
    expect(container.querySelector('[data-component="theme-preset-gallery"]')).toBeInTheDocument();
  });

  it('renders preset labels', () => {
    render(<ThemePresetGallery presets={makePresets()} />);
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(<ThemePresetGallery presets={[]} title="Themes" description="Pick a theme" />);
    expect(screen.getByText('Themes')).toBeInTheDocument();
    expect(screen.getByText('Pick a theme')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<ThemePresetGallery presets={[]} className="custom-gallery" />);
    expect(container.querySelector('.custom-gallery')).toBeInTheDocument();
  });

  it('fires onSelectPreset callback', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<ThemePresetGallery presets={makePresets()} onSelectPreset={handler} />);
    await user.click(screen.getByText('Dark Mode'));
    expect(handler).toHaveBeenCalledWith('dark', expect.objectContaining({ presetId: 'dark' }));
  });

  it('marks selected preset with aria-current', () => {
    render(<ThemePresetGallery presets={makePresets()} selectedPresetId="dark" />);
    const darkButton = screen.getByText('Dark Mode').closest('button');
    expect(darkButton).toHaveAttribute('aria-current', 'true');
  });

  it('sets data-access-state attribute', () => {
    const { container } = render(<ThemePresetGallery presets={[]} access="readonly" />);
    expect(container.querySelector('[data-access-state="readonly"]')).toBeInTheDocument();
  });

  it('returns null when access is hidden', () => {
    const { container } = render(<ThemePresetGallery presets={[]} access="hidden" />);
    expect(container.querySelector('[data-component="theme-preset-gallery"]')).not.toBeInTheDocument();
  });

  it('renders empty state when no presets', () => {
    const { container } = render(<ThemePresetGallery presets={[]} />);
    expect(container.querySelector('[data-component="theme-preset-gallery"]')).toBeInTheDocument();
  });
});

describe('ThemePresetGallery — accessibility', () => {
  it('has no axe-core a11y violations', async () => {
    const { container } = render(<ThemePresetGallery presets={makePresets()} />);
    await expectNoA11yViolations(container);
  });
});
