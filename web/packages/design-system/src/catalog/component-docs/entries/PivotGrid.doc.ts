import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "PivotGrid",
  indexItem: {
    "name": "PivotGrid",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "data_grid",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Data-Grid Pivot",
    "demoMode": "planned",
    "description": "Pivot tablo islevselligi sunan grid bileseni; satir/sutun gruplama, agrega fonksiyonlari ve dinamik eksik degistirme destegi saglar.",
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
      "data-grid",
      "planned"
    ],
    "uxPrimaryThemeId": "task_completion_architecture",
    "uxPrimarySubthemeId": "role_goal_task_mapping",
    "roadmapWaveId": "wave_13_enterprise_x_suite",
    "acceptanceContractId": "ui-library-wave-13-enterprise-x-suite-v1",
    "importStatement": "import { PivotGrid } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "PivotGrid",
    "variantAxes": [
      "aggregation: sum | avg | count | min | max",
      "pivotMode: enabled | disabled"
    ],
    "stateModel": [
      "flat",
      "pivoted",
      "computing"
    ],
    "previewStates": [
      "flat-data",
      "pivot-enabled",
      "with-aggregation",
      "computing",
      "dark-theme"
    ],
    "behaviorModel": [
      "dynamic pivot axis configuration",
      "row/column grouping",
      "aggregation function selection",
      "drag-to-pivot zone",
      "pivot result caching",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "rowData",
        "type": "any[]",
        "default": "[]",
        "required": true,
        "description": "Pivot isleminin uygulanacagi kaynak veri dizisi."
      },
      {
        "name": "columnDefs",
        "type": "ColDef[]",
        "default": "[]",
        "required": true,
        "description": "Grid kolon tanimlari."
      },
      {
        "name": "pivotColumns",
        "type": "string[]",
        "default": "[]",
        "required": false,
        "description": "Pivot sutunu olarak kullanilacak alan adlari."
      },
      {
        "name": "rowGroupColumns",
        "type": "string[]",
        "default": "[]",
        "required": false,
        "description": "Satir gruplama icin kullanilacak alan adlari."
      },
      {
        "name": "aggregation",
        "type": "'sum' | 'avg' | 'count' | 'min' | 'max'",
        "default": "sum",
        "required": false,
        "description": "Varsayilan agrega fonksiyonu."
      },
      {
        "name": "pivotMode",
        "type": "boolean",
        "default": "false",
        "required": false,
        "description": "Pivot modunu aktif veya pasif eder."
      },
      {
        "name": "onPivotChange",
        "type": "(config: PivotConfig) => void",
        "default": "-",
        "required": false,
        "description": "Pivot yapilandirmasi degistiginde tetiklenen callback."
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
        "description": "Grid boyut varyantini belirler."
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
      "pivot axis configuration",
      "aggregation function rendering",
      "drag-to-pivot interaction"
    ],
    "regressionFocus": [
      "agrega hesaplama dogrulugu",
      "pivot sutun dinamik olusturma",
      "buyuk veri seti performansi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
