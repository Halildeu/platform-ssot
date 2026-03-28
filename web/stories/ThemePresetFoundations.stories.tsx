import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge } from '../packages/design-system/src/components/Badge';
import {
  ThemePresetGallery,
  type ThemePresetGalleryItem,
} from '../packages/design-system/src/components/ThemePresetGallery';
import { ThemePresetCompare } from '../packages/design-system/src/components/ThemePresetCompare';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta = {
  title: 'UI Kit/ThemePresetFoundations',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const themePresets: ThemePresetGalleryItem[] = [
  {
    presetId: 'pw-light',
    label: 'PW Light',
    themeMode: 'light',
    appearance: 'default',
    density: 'comfortable',
    intent: 'Operasyon ekranlari ve yuksek okunabilirlik',
    isDefaultMode: true,
    badges: [<Badge key="light" variant="success">Shipping</Badge>],
  },
  {
    presetId: 'pw-ocean',
    label: 'PW Ocean',
    themeMode: 'light',
    appearance: 'ocean',
    density: 'comfortable',
    intent: 'AI-native ve insight agirlikli paneller',
    badges: [<Badge key="ocean" variant="info">Signal-rich</Badge>],
  },
  {
    presetId: 'pw-graphite',
    label: 'PW Graphite',
    themeMode: 'dark',
    appearance: 'graphite',
    density: 'compact',
    intent: 'Denetim ve uzun sureli gozetim ekranlari',
    isHighContrast: true,
    badges: [<Badge key="graphite" variant="warning">High contrast</Badge>],
  },
];

const ThemePresetCanvas = () => {
  const [selectedPresetId, setSelectedPresetId] = React.useState<string>('pw-light');
  const leftPreset = themePresets.find((preset) => preset.presetId === selectedPresetId) ?? themePresets[0];
  const rightPreset = themePresets.find((preset) => preset.presetId !== selectedPresetId) ?? themePresets[1];

  return (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6">
        <div className="rounded-[32px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Text as="div" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            Theme release surface
          </Text>
          <Text as="h2" className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
            ThemePresetGallery ve ThemePresetCompare ayni release cockpit icinde okunuyor
          </Text>
        </div>

        <ThemePresetGallery
          presets={themePresets}
          selectedPresetId={selectedPresetId}
          onSelectPreset={(presetId) => setSelectedPresetId(presetId)}
          compareAxes={['mode', 'appearance', 'density', 'contrast']}
          title="Preset family gallery"
          description="Preset secimi ve runtime release dili ayni galeride tutulur."
        />

        <ThemePresetCompare
          leftPreset={leftPreset}
          rightPreset={rightPreset}
          axes={['themeMode', 'appearance', 'density', 'intent', 'contrast']}
          title="Preset compare matrix"
          description="Theme release backlog'u, preset farklarini karsilastirma matrisiyle okuyabilir."
        />
      </div>
    </div>
  );
};

export const ThemePresetExplorer: Story = {
  render: () => <ThemePresetCanvas />,
};
