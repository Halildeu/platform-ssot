import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "ChartLegend",
  indexItem: {
    "name": "ChartLegend",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_charts",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts Legend",
    "demoMode": "planned",
    "description": "Grafik serileri icin interaktif legend bileseni; seri goster/gizle toggle ve renk eslemesi saglar.",
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
    "importStatement": "import { ChartLegend } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "ChartLegend",
    "variantAxes": [
      "position: top | bottom | left | right",
      "layout: horizontal | vertical"
    ],
    "stateModel": [
      "all-visible",
      "partial-hidden",
      "interactive"
    ],
    "previewStates": [
      "horizontal-bottom",
      "vertical-right",
      "with-hidden-series",
      "dark-theme"
    ],
    "behaviorModel": [
      "series toggle interaction",
      "color swatch rendering",
      "position-based layout",
      "overflow scroll/wrap",
      "keyboard series navigation",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "items",
        "type": "ChartLegendItem[]",
        "default": "[]",
        "required": true,
        "description": "Legend oge listesi; her oge seri adi, rengi ve gorunurluk durumunu icerir."
      },
      {
        "name": "position",
        "type": "'top' | 'bottom' | 'left' | 'right'",
        "default": "bottom",
        "required": false,
        "description": "Legend panelinin grafige gore konumu."
      },
      {
        "name": "layout",
        "type": "'horizontal' | 'vertical'",
        "default": "horizontal",
        "required": false,
        "description": "Legend ogelerinin siralama yonu."
      },
      {
        "name": "onToggle",
        "type": "(seriesKey: string, visible: boolean) => void",
        "default": "-",
        "required": false,
        "description": "Seri gorunurlugu degistiginde tetiklenen callback."
      },
      {
        "name": "interactive",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Legend ogelerinin tiklanabilir olup olmadigini belirler."
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
        "description": "Legend boyut varyantini belirler."
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
      "series toggle interaction",
      "position layout variants",
      "color swatch rendering"
    ],
    "regressionFocus": [
      "seri toggle callback dogrulugu",
      "overflow durumunda scroll/wrap",
      "keyboard navigasyon",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
