import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "SparklineChart",
  indexItem: {
    "name": "SparklineChart",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_charts",
    "subgroup": "charts",
    "taxonomyGroupId": "x_charts",
    "taxonomySubgroup": "Sparkline chart",
    "demoMode": "planned",
    "description": "Kompakt satir ici sparkline grafigi; tablolar ve kartlar icinde mini trend gosterimi saglar.",
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
    "importStatement": "import { SparklineChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "SparklineChart",
    "variantAxes": [
      "type: line | bar | area",
      "color: primary | success | warning | danger"
    ],
    "stateModel": [
      "default",
      "empty",
      "animating"
    ],
    "previewStates": [
      "line-default",
      "bar-mode",
      "area-mode",
      "empty-data",
      "dark-theme"
    ],
    "behaviorModel": [
      "inline trend rendering",
      "auto min/max scaling",
      "line/bar/area type switching",
      "color token mapping",
      "empty data fallback",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "data",
        "type": "number[]",
        "default": "[]",
        "required": true,
        "description": "Sparkline icin veri noktasi dizisi."
      },
      {
        "name": "type",
        "type": "'line' | 'bar' | 'area'",
        "default": "line",
        "required": false,
        "description": "Sparkline grafik tipi."
      },
      {
        "name": "color",
        "type": "string",
        "default": "primary",
        "required": false,
        "description": "Grafik renk tokeni veya ozel renk degeri."
      },
      {
        "name": "width",
        "type": "number",
        "default": "100",
        "required": false,
        "description": "Grafik genisligi (piksel)."
      },
      {
        "name": "height",
        "type": "number",
        "default": "24",
        "required": false,
        "description": "Grafik yuksekligi (piksel)."
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
        "description": "Sparkline boyut varyantini belirler."
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
      "line vs bar vs area rendering",
      "auto-scaling behavior",
      "inline integration"
    ],
    "regressionFocus": [
      "bos veri seti goruntuleme",
      "min/max olcekleme dogrulugu",
      "animasyon performansi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
