import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "WaterfallChart",
  indexItem: {
    "name": "WaterfallChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_charts",
    "subgroup": "charts",
    "taxonomyGroupId": "x_charts",
    "taxonomySubgroup": "X-Charts Waterfall",
    "demoMode": "live",
    "description": "Kumulatif artis ve azalis adimlarini goruntuleyen waterfall grafigi; baglanti cizgileri, toplam sutunu ve etiket destegi sunar.",
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
    "importStatement": "import { WaterfallChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "WaterfallChart",
    "variantAxes": [
      "connectors: visible | hidden",
      "labels: visible | hidden",
      "total: visible | hidden"
    ],
    "stateModel": [
      "increase-decrease flow",
      "with-total summary",
      "connector lines active"
    ],
    "previewStates": [
      "increase-decrease",
      "with-total",
      "dark-theme"
    ],
    "behaviorModel": [
      "cumulative bar position calculation",
      "increase/decrease color differentiation",
      "connector line rendering",
      "total summary bar",
      "bar label display",
      "tooltip on hover",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "data",
        "type": "WaterfallDataPoint[]",
        "default": "-",
        "required": true,
        "description": "Waterfall adim verisi dizisi; her adim artis veya azalisi temsil eder."
      },
      {
        "name": "showConnectors",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Adimlar arasi baglanti cizgilerini gosterir veya gizler."
      },
      {
        "name": "showLabels",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Bar uzerindeki deger etiketlerini gosterir veya gizler."
      },
      {
        "name": "totalLabel",
        "type": "string",
        "default": "Toplam",
        "required": false,
        "description": "Toplam sutunu etiket metni."
      },
      {
        "name": "valueFormatter",
        "type": "(value: number) => string",
        "default": "-",
        "required": false,
        "description": "Tooltip ve etiketlerdeki deger formatlama fonksiyonu."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "default": "md",
        "required": false,
        "description": "Grafik boyut varyantini belirler."
      },
      {
        "name": "colors",
        "type": "{ increase: string; decrease: string; total: string }",
        "default": "-",
        "required": false,
        "description": "Artis, azalis ve toplam bar renkleri."
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
      "increase/decrease color flow",
      "total summary bar",
      "connector line alignment"
    ],
    "regressionFocus": [
      "kumulatif pozisyon hesaplama dogrulugu",
      "negatif deger goruntuleme",
      "connector cizgi hizalama",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
