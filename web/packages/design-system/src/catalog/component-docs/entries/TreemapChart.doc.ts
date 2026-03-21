import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "TreemapChart",
  indexItem: {
    "name": "TreemapChart",
    "kind": "component",
    "availability": "exported",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "charts",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Charts Treemap",
    "demoMode": "live",
    "description": "Hiyerarsik veri dagilimini alan bazli dikdortgenlerle goruntuleyen treemap grafigi; duz ve ic ice veri yapisi destegi sunar.",
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
    "importStatement": "import { TreemapChart } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "TreemapChart",
    "variantAxes": [
      "depth: flat | nested",
      "label: visible | hidden"
    ],
    "stateModel": [
      "flat layout",
      "nested hierarchy",
      "hover highlight"
    ],
    "previewStates": [
      "flat",
      "nested",
      "dark-theme"
    ],
    "behaviorModel": [
      "squarified treemap layout algorithm",
      "nested hierarchy drill-down",
      "hover highlight and tooltip",
      "proportional area calculation",
      "label overflow management",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "data",
        "type": "TreemapNode[]",
        "default": "-",
        "required": true,
        "description": "Treemap veri dugum dizisi; ic ice children destekler."
      },
      {
        "name": "labelKey",
        "type": "string",
        "default": "label",
        "required": false,
        "description": "Dugum etiket alani adi."
      },
      {
        "name": "valueKey",
        "type": "string",
        "default": "value",
        "required": false,
        "description": "Dugum deger alani adi; alan buyuklugunu belirler."
      },
      {
        "name": "childrenKey",
        "type": "string",
        "default": "children",
        "required": false,
        "description": "Ic ice alt dugum dizisi alan adi."
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
      "flat vs nested layout",
      "proportional area display",
      "label overflow handling"
    ],
    "regressionFocus": [
      "alan hesaplama dogrulugu",
      "derin hiyerarsi render performansi",
      "bos veri seti goruntuleme",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
