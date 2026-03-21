import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "RowGroupingGrid",
  indexItem: {
    "name": "RowGroupingGrid",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "data_display",
    "subgroup": "data_grid",
    "taxonomyGroupId": "data_display",
    "taxonomySubgroup": "X-Data-Grid Row Grouping",
    "demoMode": "planned",
    "description": "Satir gruplama islevselligi sunan grid bileseni; coklu seviye gruplama, agrega satirlari ve grup baslik ozellestirme destegi saglar.",
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
    "importStatement": "import { RowGroupingGrid } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "RowGroupingGrid",
    "variantAxes": [
      "groupDisplay: singleColumn | multipleColumns | groupRows",
      "aggregation: sum | avg | count"
    ],
    "stateModel": [
      "ungrouped",
      "grouped",
      "partial-expanded"
    ],
    "previewStates": [
      "ungrouped",
      "single-level-group",
      "multi-level-group",
      "with-aggregation",
      "dark-theme"
    ],
    "behaviorModel": [
      "multi-level row grouping",
      "group header customization",
      "aggregation row rendering",
      "drag-to-group zone",
      "group expand/collapse",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "rowData",
        "type": "any[]",
        "default": "[]",
        "required": true,
        "description": "Grid satir verileri dizisi."
      },
      {
        "name": "columnDefs",
        "type": "ColDef[]",
        "default": "[]",
        "required": true,
        "description": "Grid kolon tanimlari."
      },
      {
        "name": "groupByColumns",
        "type": "string[]",
        "default": "[]",
        "required": false,
        "description": "Satir gruplama icin kullanilacak kolon alan adlari."
      },
      {
        "name": "groupDisplay",
        "type": "'singleColumn' | 'multipleColumns' | 'groupRows'",
        "default": "singleColumn",
        "required": false,
        "description": "Grup gosterim modu."
      },
      {
        "name": "showAggregation",
        "type": "boolean",
        "default": "true",
        "required": false,
        "description": "Grup satirlarinda agrega deger gosterimini aktif eder."
      },
      {
        "name": "groupHeaderRenderer",
        "type": "(params: GroupHeaderParams) => ReactNode",
        "default": "-",
        "required": false,
        "description": "Grup baslik satiri icin ozel render fonksiyonu."
      },
      {
        "name": "onGroupChange",
        "type": "(groupColumns: string[]) => void",
        "default": "-",
        "required": false,
        "description": "Gruplama yapilandirmasi degistiginde tetiklenen callback."
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
      "multi-level grouping",
      "aggregation row rendering",
      "group header customization"
    ],
    "regressionFocus": [
      "coklu seviye gruplama dogrulugu",
      "agrega hesaplama tutarliligi",
      "drag-to-group zone etkilesimi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
