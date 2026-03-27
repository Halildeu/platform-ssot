import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MiniChart",
  indexItem: {
    "name": "MiniChart",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_charts",
    "subgroup": "charts",
    "taxonomyGroupId": "x_charts",
    "taxonomySubgroup": "Mini chart",
    "demoMode": "planned",
    "description": "Kucuk boyutlu ozet grafik bileseni; donut, bar ve progress turlerini destekler, dashboard widget ve kart iceriklerinde kullanilir.",
    "sectionIds": [
      "component_library_management",
      "table_data_display",
      "state_feedback"
    ],
    "qualityGates": [
      "design_tokens",
      "preview_visibility",
      "registry_export_sync",
      "ux_catalog_alignment",
      "a11y_keyboard_support"
    ],
    "tags": [
      "wave-13",
      "enterprise-x-suite",
      "charts",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { MiniChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "MiniChart",
    "variantAxes": [
      "type: donut | bar | progress",
      "size: sm | md | lg"
    ],
    "stateModel": [
      "default",
      "empty",
      "loading"
    ],
    "previewStates": [
      "donut-default",
      "bar-mode",
      "progress-mode",
      "empty-data",
      "dark-theme"
    ],
    "behaviorModel": [
      "compact chart rendering",
      "donut/bar/progress type switching",
      "percentage value display",
      "color segment mapping",
      "loading skeleton state",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "data",
        "type": "MiniChartDataItem[]",
        "default": "[]",
        "required": true,
        "description": "Grafik veri oge dizisi."
      },
      {
        "name": "type",
        "type": "'donut' | 'bar' | 'progress'",
        "default": "donut",
        "required": false,
        "description": "Mini grafik tipi."
      },
      {
        "name": "value",
        "type": "number",
        "default": "-",
        "required": false,
        "description": "Progress modunda goruntulenen yuzde degeri."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Grafik merkez veya alt etiket metni."
      },
      {
        "name": "colors",
        "type": "string[]",
        "default": "-",
        "required": false,
        "description": "Ozel renk paleti dizisi."
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
        "description": "Grafik boyut varyantini belirler."
      },
      {
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "donut vs bar vs progress rendering",
      "compact size integration",
      "color segment mapping"
    ],
    "regressionFocus": [
      "bos veri seti goruntuleme",
      "progress yuzde hesaplama",
      "loading skeleton gorunumu",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
