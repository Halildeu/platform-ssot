import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemePresetCompare from './ThemePresetCompare';

describe('ThemePresetCompare', () => {
  test('axis bazli preset farklarini gosterir', () => {
    render(
      <ThemePresetCompare
        leftPreset={{
          presetId: 'enterprise_light_default',
          label: 'Enterprise Light',
          themeMode: 'light',
          appearance: 'light',
          density: 'comfortable',
          intent: 'Kurumsal default',
        }}
        rightPreset={{
          presetId: 'accessibility_high_contrast',
          label: 'Accessibility High Contrast',
          themeMode: 'high-contrast',
          appearance: 'high-contrast',
          density: 'comfortable',
          intent: 'Kontrast odakli',
          isHighContrast: true,
        }}
      />,
    );

    expect(screen.getAllByText('Enterprise Light')).toHaveLength(2);
    expect(screen.getAllByText('Accessibility High Contrast')).toHaveLength(2);
    expect(screen.getByText('contrast')).toBeInTheDocument();
    expect(screen.getByText('standard')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });
});
