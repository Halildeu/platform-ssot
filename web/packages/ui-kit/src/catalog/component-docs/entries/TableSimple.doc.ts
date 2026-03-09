import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TableSimple",
  indexItem: {
  "name": "TableSimple",
  "kind": "component",
  "importStatement": "import { TableSimple } from 'mfe-ui-kit';",
  "whereUsed": [
    "web/apps/mfe-shell/src/pages/admin/DesignLabPage.tsx"
  ],
  "group": "data_display",
  "subgroup": "table_simple",
  "tags": [
    "beta",
    "data-display",
    "table",
    "wave-4"
  ],
  "availability": "exported",
  "lifecycle": "beta",
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
  "uxPrimaryThemeId": "measurement_kpi_and_experimentation",
  "uxPrimarySubthemeId": "task_completion_time_p50_p95",
  "roadmapWaveId": "wave_4_data_display",
  "acceptanceContractId": "ui-library-wave-4-data-display-v1"
},
  apiItem: {
  "name": "TableSimple",
  "variantAxes": [
    "density: comfortable | compact",
    "surface: striped | flat",
    "header: static | sticky"
  ],
  "stateModel": [
    "loading rows",
    "empty data state",
    "row striping",
    "access-aware visibility"
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
    }
  ],
  "previewFocus": [
    "policy list",
    "loading + empty states",
    "sticky header"
  ],
  "regressionFocus": [
    "empty state fallback",
    "loading skeleton rows",
    "cell alignment and truncation"
  ]
},
};

export default entry;
