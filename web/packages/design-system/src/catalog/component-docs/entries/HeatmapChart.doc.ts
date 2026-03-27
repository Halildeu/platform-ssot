import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "HeatmapChart",
  indexItem: {
    "name": "HeatmapChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_charts",
    "subgroup": "charts",
    "taxonomyGroupId": "x_charts",
    "taxonomySubgroup": "Heatmap chart",
    "demoMode": "live",
    "description": "Iki boyutlu veri yogunlugunu renk skalasi ile goruntuleyen heatmap grafigi; ozel gradient ve etiket destegi sunar.",
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
    "importStatement": "import { HeatmapChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "HeatmapChart",
    "variantAxes": [
      "gradient: default | custom",
      "labels: visible | hidden"
    ],
    "stateModel": [
      "default color scale",
      "custom gradient range",
      "cell hover highlight"
    ],
    "previewStates": [
      "default",
      "custom-gradient",
      "dark-theme"
    ],
    "behaviorModel": [
      "color scale interpolation",
      "cell hover tooltip",
      "axis label rendering",
      "custom gradient range mapping",
      "responsive cell sizing",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "data",
        "type": "HeatmapDataPoint[]",
        "default": "-",
        "required": true,
        "description": "Heatmap veri noktalari dizisi."
      },
      {
        "name": "xLabels",
        "type": "string[]",
        "default": "-",
        "required": true,
        "description": "X ekseni etiketleri dizisi."
      },
      {
        "name": "yLabels",
        "type": "string[]",
        "default": "-",
        "required": true,
        "description": "Y ekseni etiketleri dizisi."
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
        "name": "valueKey",
        "type": "string",
        "default": "value",
        "required": false,
        "description": "Veri nesnesindeki deger alan adi; renk yogunlugunu belirler."
      },
      {
        "name": "colorRange",
        "type": "[string, string]",
        "default": "-",
        "required": false,
        "description": "Minimum ve maksimum renk degerleri dizisi; ozel gradient tanimlar."
      },
      {
        "name": "valueFormatter",
        "type": "(value: number) => string",
        "default": "-",
        "required": false,
        "description": "Tooltip ve hucre etiketlerdeki deger formatlama fonksiyonu."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Grafik boyut varyantini belirler."
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
      "default vs custom gradient",
      "axis label alignment",
      "cell hover tooltip"
    ],
    "regressionFocus": [
      "renk interpolasyon dogrulugu",
      "bos hucre goruntuleme",
      "responsive hucre boyutlandirma",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
