import type { DesignLabComponentDocEntry } from '../types';

const entry: DesignLabComponentDocEntry = {
  name: "MasterDetailGrid",
  indexItem: {
    "name": "MasterDetailGrid",
    "kind": "component",
    "availability": "planned",
    "lifecycle": "stable",
    "maturity": "beta",
    "group": "x_data_grid",
    "subgroup": "data_grid",
    "taxonomyGroupId": "x_data_grid",
    "taxonomySubgroup": "Master-detail grid",
    "demoMode": "planned",
    "description": "Satir genisletme ile detay paneli gosteren master-detail grid bileseni; ic ice grid veya ozel icerik render destegi saglar.",
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
    "importStatement": "import { MasterDetailGrid } from '@mfe/design-system';",
    "whereUsed": []
  },
  apiItem: {
    "name": "MasterDetailGrid",
    "variantAxes": [
      "detailType: grid | custom",
      "expandMode: single | multiple"
    ],
    "stateModel": [
      "collapsed",
      "expanded",
      "loading-detail"
    ],
    "previewStates": [
      "collapsed-all",
      "single-expanded",
      "multi-expanded",
      "loading-detail",
      "dark-theme"
    ],
    "behaviorModel": [
      "row expansion toggle",
      "nested grid rendering",
      "custom detail panel slot",
      "lazy detail loading",
      "single/multi expand mode",
      "theme-aware token resolution"
    ],
    "props": [
      {
        "name": "rowData",
        "type": "any[]",
        "default": "[]",
        "required": true,
        "description": "Ana grid satir verileri dizisi."
      },
      {
        "name": "columnDefs",
        "type": "ColDef[]",
        "default": "[]",
        "required": true,
        "description": "Ana grid kolon tanimlari."
      },
      {
        "name": "detailCellRenderer",
        "type": "(params: DetailCellRendererParams) => ReactNode",
        "default": "-",
        "required": false,
        "description": "Genisletilmis detay paneli icin ozel render fonksiyonu."
      },
      {
        "name": "detailRowHeight",
        "type": "number",
        "default": "300",
        "required": false,
        "description": "Detay panelinin piksel cinsinden yuksekligi."
      },
      {
        "name": "expandMode",
        "type": "'single' | 'multiple'",
        "default": "multiple",
        "required": false,
        "description": "Ayni anda tek veya birden fazla satir genisletme modu."
      },
      {
        "name": "onDetailExpand",
        "type": "(rowId: string) => void",
        "default": "-",
        "required": false,
        "description": "Satir genisletildiginde tetiklenen callback."
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
      "row expansion interaction",
      "nested grid rendering",
      "custom detail panel"
    ],
    "regressionFocus": [
      "genisletme/daraltma toggle dogrulugu",
      "lazy detail loading zamanlama",
      "single expand modu sinirlamasi",
      "dark theme token uyumu"
    ]
  },
};

export default entry;
