import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "GaugeChart",
  indexItem: {
    "name": "GaugeChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts Gauge",
    "demoMode": "live",
    "description": "Tekil metrik degerini yari daire gosterge ile goruntuleyen gauge grafigi; esik degerleri ve renk gecisleri destekler.",
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
    "importStatement": "import { GaugeChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "GaugeChart",
    "variantAxes": [
      "threshold: low | medium | high | critical",
      "display: value-visible | value-hidden"
    ],
    "stateModel": [
      "low",
      "medium",
      "high",
      "critical"
    ],
    "previewStates": [
      "low",
      "medium",
      "high",
      "critical",
      "dark-theme"
    ],
    "behaviorModel": [
      "arc angle calculation from value",
      "threshold-based color transition",
      "animated value change",
      "center label display",
      "min/max boundary rendering",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "value",
        "type": "number",
        "default": "-",
        "required": true,
        "description": "Gosterge ibresi degeri."
      },
      {
        "name": "min",
        "type": "number",
        "default": "0",
        "required": false,
        "description": "Gosterge minimum degeri."
      },
      {
        "name": "max",
        "type": "number",
        "default": "100",
        "required": false,
        "description": "Gosterge maksimum degeri."
      },
      {
        "name": "label",
        "type": "string",
        "default": "-",
        "required": false,
        "description": "Gosterge altinda goruntulenen etiket metni."
      },
      {
        "name": "thresholds",
        "type": "GaugeThreshold[]",
        "default": "-",
        "required": false,
        "description": "Renk gecis esik degerleri dizisi."
      },
      {
        "name": "showValue",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Merkez deger etiketini gosterir veya gizler."
      },
      {
        "name": "valueFormatter",
        "type": "(value: number) => string",
        "default": "-",
        "required": false,
        "description": "Merkez deger formatlama fonksiyonu."
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
      "threshold color transitions",
      "min/max boundary labels",
      "center value display"
    ],
    "regressionFocus": [
      "arc aci hesaplama dogrulugu",
      "esik degeri renk gecisi",
      "min/max sinir asilmasi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
