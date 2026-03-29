import type { ExampleEntry } from './types';

export const examples: Record<string, ExampleEntry[]> = {
  ThemePresetGallery: [
    {
      id: "preset-gallery-basic",
      title: "Temel Preset Galerisi",
      description: "Seçilebilir tema preset kartları galerisi.",
      category: "basic",
      code: `import { ThemePresetGallery } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetGallery
      presets={[
        {
          presetId: 'default-light',
          label: 'Varsayılan Açık',
          themeMode: 'Light',
          appearance: 'Modern',
          density: 'Comfortable',
          isDefaultMode: true,
        },
        {
          presetId: 'default-dark',
          label: 'Varsayılan Koyu',
          themeMode: 'Dark',
          appearance: 'Modern',
          density: 'Comfortable',
        },
      ]}
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "preset", "secim"],
    },
    {
      id: "preset-gallery-controlled",
      title: "Kontrollü Preset Galerisi",
      description: "Dışarıdan yönetilen seçim durumu ile preset galerisi.",
      category: "advanced",
      code: `import { ThemePresetGallery } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selectedId, setSelectedId] = useState('default-light');

  return (
    <ThemePresetGallery
      presets={[
        {
          presetId: 'default-light',
          label: 'Varsayılan Açık',
          themeMode: 'Light',
          appearance: 'Modern',
          density: 'Comfortable',
          isDefaultMode: true,
        },
        {
          presetId: 'high-contrast',
          label: 'Yüksek Kontrast',
          themeMode: 'Light',
          appearance: 'Classic',
          density: 'Comfortable',
          isHighContrast: true,
        },
        {
          presetId: 'compact',
          label: 'Kompakt',
          themeMode: 'Light',
          appearance: 'Modern',
          density: 'Compact',
        },
      ]}
      selectedPresetId={selectedId}
      onSelectPreset={(id) => setSelectedId(id)}
      compareAxes={['Appearance', 'Density', 'Contrast']}
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "kontrollu", "kontrast"],
    },
    {
      id: "preset-gallery-empty",
      title: "Boş Preset Galerisi",
      description: "Preset tanımlı olmadığında boş durum mesajı.",
      category: "basic",
      code: `import { ThemePresetGallery } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePresetGallery
      presets={[]}
      title="Tema Presetleri"
      description="Kullanılabilir preset bulunamadı."
    />
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "bos", "empty-state"],
    },
  ],
  ThemePreviewCard: [
    {
      id: "preview-card-basic",
      title: "Temel Önizleme Kartı",
      description: "Tema varyasyonunu minik kart olarak gösteren önizleme.",
      category: "basic",
      code: `import { ThemePreviewCard } from '@mfe/design-system';

export function Example() {
  return (
    <div className="flex gap-4">
      <ThemePreviewCard />
      <ThemePreviewCard selected />
    </div>
  );
}`,
      previewProps: {},
      tags: ["tema", "onizleme", "kart"],
    },
    {
      id: "preview-card-selected",
      title: "Seçili Önizleme Kartı",
      description: "Aktif preset vurgusu ile seçili durum kartı.",
      category: "basic",
      code: `import { ThemePreviewCard } from '@mfe/design-system';

export function Example() {
  return (
    <ThemePreviewCard
      selected
      localeText={{
        titleText: 'Başlık metni',
        secondaryText: 'İkincil metin',
        saveLabel: 'Kaydet',
        selectedLabel: 'Seçili tema önizlemesi',
      }}
    />
  );
}`,
      previewProps: { selected: true },
      tags: ["tema", "secili", "onizleme", "yerellestirilmis"],
    },
    {
      id: "preview-card-gallery",
      title: "Galeri İçinde Önizleme",
      description: "Birden fazla önizleme kartının galeri düzeninde kullanımı.",
      category: "patterns",
      code: `import { ThemePreviewCard } from '@mfe/design-system';
import { useState } from 'react';

export function Example() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid grid-cols-3 gap-3">
      {['Açık Tema', 'Koyu Tema', 'Yüksek Kontrast'].map((label, i) => (
        <button key={label} onClick={() => setSelected(i)} className="text-left">
          <ThemePreviewCard
            selected={selected === i}
            localeText={{ titleText: label }}
          />
          <span className="mt-1 block text-xs">{label}</span>
        </button>
      ))}
    </div>
  );
}`,
      previewProps: {},
      tags: ["tema", "galeri", "coklu", "secim"],
    },
  ],
  Tabs: [
    {
      id: "tabs-basic",
      title: "Basic Tabs",
      description: "Tab navigation for switching between content panels.",
      category: "basic",
      code: `import { Tabs } from '@mfe/design-system';

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
      <Tabs.Panel value="billing">Billing content</Tabs.Panel>
    </Tabs>
  );
}`,
      previewProps: {},
      tags: ["navigation", "panel", "switch"],
    },
  ],};
