import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "RadarChart",
  indexItem: {
    "name": "RadarChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_charts",
    "subgroup": "charts",
    "taxonomyGroupId": "x_charts",
    "taxonomySubgroup": "X-Charts Radar",
    "demoMode": "live",
    "description": "Cok boyutlu veri karsilastirmasi icin radar (orumcek ag) grafigi; tekli ve coklu seri, dolgulu mod ve legend destegi sunar.",
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
      "beta"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { RadarChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "RadarChart",
    "variantAxes": [
      "fill: outline | filled",
      "grid: visible | hidden",
      "legend: visible | hidden"
    ],
    "stateModel": [
      "single-series",
      "multi-series",
      "filled"
    ],
    "previewStates": ["single-series", "multi-series", "filled", "dark-theme"],
    "behaviorModel": [
      "radial axis rendering",
      "multi-series overlay comparison",
      "filled area opacity",
      "tooltip on vertex hover",
      "grid ring display",
      "legend interaction",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "data",
        "type": "RadarDataPoint[]",
        "default": "-",
        "required": true,
        "description": "Radar grafik veri noktalari dizisi."
      },
      {
        "name": "categories",
        "type": "string[]",
        "default": "-",
        "required": true,
        "description": "Radar eksenlerini tanimlayan kategori etiketleri."
      },
      {
        "name": "series",
        "type": "RadarSeries[]",
        "default": "-",
        "required": false,
        "description": "Coklu seri tanimlari; her biri ayri bir radar cizgisi olusturur."
      },
      {
        "name": "filled",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Radar alanini yari saydam dolgu ile gosterir."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Grafik boyut varyantini belirler."
      },
      {
        "name": "showGrid",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Arka plan grid halkalarini gosterir veya gizler."
      },
      {
        "name": "showLegend",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Legend panelini gosterir veya gizler."
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
        "name": "aria-label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Erisilebilirlik icin aciklayici etiket."
      }
    ],
    "previewFocus": [
      "single vs multi-series comparison",
      "filled area overlay",
      "category axis labels"
    ],
    "regressionFocus": [
      "cok serili cakisma goruntuleme",
      "bos kategori dizisinde goruntuleme",
      "filled opacity hesaplama",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
