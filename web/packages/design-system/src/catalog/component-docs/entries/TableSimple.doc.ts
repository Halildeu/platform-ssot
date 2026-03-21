import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TableSimple",
  indexItem: {
  "name": "TableSimple",
  "kind": "component",
  "availability": "exported",
  "lifecycle": "stable",
  "maturity": "beta",
  "group": "data_display",
  "subgroup": "table_simple",
  "taxonomyGroupId": "data_display",
  "taxonomySubgroup": "Table",
  "demoMode": "live",
  "description": "Hafif veri tablosu primitivei; loading, empty, sticky header ve density davranisini tek API ile sunar.",
  "sectionIds": [
    "table_data_display",
    "documentation_standards",
    "responsive_layout"
  ],
  "qualityGates": [
    "design_tokens",
    "preview_visibility",
    "registry_export_sync",
    "ux_catalog_alignment"
  ],
  "tags": [
    "wave-4",
    "data-display",
    "beta",
    "table"
  ],
  "uxPrimaryThemeId": "measurement_kpi_and_experimentation",
  "uxPrimarySubthemeId": "task_completion_time_p50_p95",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1",
  "importStatement": "import { TableSimple } from '@mfe/design-system';",
  "whereUsed": [
    "web/stories/TableSimple.stories.tsx",
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx",
    "web/apps/mfe-shell/src/pages/admin/design-lab/showcase/preview-components/DesignLabTableSimpleShowcase.tsx"
  ]
},
  apiItem: {
  "name": "TableSimple",
  "variantAxes": [
    "density: comfortable | compact",
    "surface: striped | flat",
    "header: static | sticky",
    "width: intrinsic | full-width",
    "state: data | loading | empty | readonly"
  ],
  "stateModel": [
    "loading rows",
    "empty data state",
    "row striping",
    "sticky header scroll context",
    "row emphasis and truncation",
    "access-aware visibility"
  ],
    "previewStates": [
      "loading rows",
      "empty data state",
      "row striping",
      "sticky header scroll context",
      "row emphasis and truncation",
      "access-aware visibility",
      "dark-theme"
    ],
    "behaviorModel": [
      "loading skeleton row rendering",
      "empty state fallback"
    ],
  "props": [
    {
      "name": "columns",
      "type": "TableSimpleColumn[]",
      "default": "-",
      "required": true,
      "description": "Header, accessor/render ve align bilgisini tasir."
    },
    {
      "name": "rows",
      "type": "Record<string, unknown>[]",
      "default": "-",
      "required": true,
      "description": "Gosterilecek veri satirlari."
    },
    {
      "name": "density",
      "type": "'comfortable' | 'compact'",
      "default": "comfortable",
      "required": false,
      "description": "Satir yogunlugunu belirler."
    },
    {
      "name": "striped",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Alternatif satir zeminini acar."
    },
    {
      "name": "stickyHeader",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Uzun listelerde sticky header davranisini acar."
    },
    {
      "name": "loading",
      "type": "boolean",
      "default": "false",
      "required": false,
      "description": "Skeleton row durumu ile yukleme sinyali verir."
    },
    {
      "name": "fullWidth",
      "type": "boolean",
      "default": "true",
      "required": false,
      "description": "Tablonun kapsayici genisligini tamamen doldurup doldurmayacagini belirler."
    },
    {
      "name": "getRowKey",
      "type": "(row, index) => React.Key",
      "default": "index",
      "required": false,
      "description": "Stabil satir kimligi vererek reorder veya partial refresh durumlarinda render tutarliligini artirir."
    },
    {
      "name": "localeText / emptyStateLabel",
      "type": "TableSimpleLocaleText / ReactNode",
      "default": "- / -",
      "required": false,
      "description": "Empty state etiketi ve fallback aciklamasini yerellestirilebilir sekilde ozellestirir."
    },
    {
      "name": "access",
      "type": "'full' | 'readonly' | 'disabled' | 'hidden'",
      "default": "'full'",
      "required": false,
      "description": "Table yuzeyinin policy tabanli gorunurluk ve etkilesim seviyesini belirler."
    },
    {
      "name": "className",
      "type": "string",
      "default": "-",
      "required": false,
      "description": "Root element icin ek CSS sinifi."
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "default": "md",
      "required": false,
      "description": "Table boyut varyanti."
    }
  ],
  "previewFocus": [
    "policy review board",
    "compact ops queue",
    "loading + empty states",
    "sticky header",
    "readonly registry"
  ],
  "regressionFocus": [
    "empty state fallback",
    "loading skeleton rows",
    "sticky header visibility",
    "cell alignment and truncation",
    "readonly opacity contract"
  ]
},
};

export default entry;
