import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ScatterChart",
  indexItem: {
    "name": "ScatterChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_charts",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts Scatter & Bubble",
    "demoMode": "live",
    "description": "Scatter ve bubble modlarini destekleyen nokta grafigi; coklu seri, boyut ekseni ve legend entegrasyonu sunar.",
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
    "importStatement": "import { ScatterChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ScatterChart",
    "variantAxes": [
      "mode: scatter | bubble",
      "grid: visible | hidden",
      "legend: visible | hidden"
    ],
    "stateModel": [
      "default scatter view",
      "bubble mode with size axis",
      "multi-series overlay"
    ],
    "previewStates": [
      "default",
      "bubble-mode",
      "multi-series",
      "dark-theme"
    ],
    "behaviorModel": [
      "scatter point rendering",
      "bubble size mapping",
      "multi-series color differentiation",
      "tooltip on hover",
      "axis grid toggle",
      "legend interaction",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "data",
        "type": "ScatterDataPoint[]",
        "default": "-",
        "required": true,
        "description": "Grafik veri noktalari dizisi."
      },
      {
        "name": "xKey",
        "type": "string",
        "default": "x",
        "required": false,
        "description": "Veri nesnesindeki x ekseni alan adi."
      },
      {
        "name": "yKey",
        "type": "string",
        "default": "y",
        "required": false,
        "description": "Veri nesnesindeki y ekseni alan adi."
      },
      {
        "name": "sizeKey",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Bubble modunda nokta boyutunu belirleyen alan adi."
      },
      {
        "name": "labelKey",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Tooltip ve etiket icin kullanilacak alan adi."
      },
      {
        "name": "bubbleMode",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Bubble grafik modunu aktif eder; sizeKey ile birlikte kullanilir."
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
        "description": "Arka plan grid cizgilerini gosterir veya gizler."
      },
      {
        "name": "showLegend",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Legend panelini gosterir veya gizler."
      },
      {
        "name": "title",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Grafik baslik metni."
      },
      {
        "name": "colors",
        "type": "string[]",
        "default": "-",
        "required": false,
        "description": "Ozel renk paleti dizisi."
      },
      {
        "name": "valueFormatter",
        "type": "(value: number) => string",
        "default": "-",
        "required": false,
        "description": "Tooltip ve etiketlerdeki deger formatlama fonksiyonu."
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
      "scatter vs bubble mode",
      "multi-series color mapping",
      "tooltip interaction"
    ],
    "regressionFocus": [
      "bubble size scaling dogrulugu",
      "bos veri seti goruntuleme",
      "legend toggle fonksiyoneligi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
