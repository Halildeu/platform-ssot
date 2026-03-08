import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ThemePresetGallery from './ThemePresetGallery';

describe('ThemePresetGallery', () => {
  const presets = [
    {
      presetId: 'enterprise_light_default',
      label: 'Enterprise Light',
      themeMode: 'light',
      appearance: 'light',
      density: 'comfortable',
      intent: 'Dengeli kurumsal gorunum',
      isDefaultMode: true,
    },
    {
      presetId: 'accessibility_high_contrast',
      label: 'Accessibility High Contrast',
      themeMode: 'high-contrast',
      appearance: 'high-contrast',
      density: 'comfortable',
      intent: 'Yuksek kontrast erisilebilir preset',
      isHighContrast: true,
    },
  ];

  test('preset kartlarini render eder', () => {
    render(<ThemePresetGallery presets={presets} />);

    expect(screen.getByText('Enterprise Light')).toBeInTheDocument();
    expect(screen.getByText('Accessibility High Contrast')).toBeInTheDocument();
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  test('select callback cagrilir', () => {
    const onSelectPreset = jest.fn();
    render(<ThemePresetGallery presets={presets} onSelectPreset={onSelectPreset} />);

    fireEvent.click(screen.getByRole('button', { name: /Accessibility High Contrast/i }));
    expect(onSelectPreset).toHaveBeenCalledWith(
      'accessibility_high_contrast',
      expect.objectContaining({ presetId: 'accessibility_high_contrast' }),
    );
  });
});
